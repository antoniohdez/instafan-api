var bcrypt = require('bcrypt');
var User = require('../../models/user');

const userTypes = {
    personal: "personal",
    business: "business",
    marketing: "marketing",
    PYME: "PYME"
}

exports.list = function(req, res) {
    User.find()
    .then((users) => {
        res.json(users);
    }).catch((err) => {
        res.end(err);
    });
}

exports.create = function(req, res) {
    if (!validateNewUser(req.body)) {
        res.status(400).json({ error: "Invalid request", message: "" });
        return;
    };

    let user = createUserModel(req);
    
    user.save()
        .then(dbSuccessHandler(res))
        .catch(dbErrorHandler(res));
}

exports.show = function(req, res) {
    User.findById(req.params.user_id)
    .then((user) => {
        res.json(user);
    }).catch((err) => {
        res.end(err);
    });
}

exports.update = function(req, res) {
    User.findById(req.params.user_id)
    .then((user) => {
        user.name = req.body.name;

        user.save()
        .then(() => {
            res.json({ message: 'User updated!' });
        }).catch((err) => {
            res.end(err);
        });

    }).catch((err) => {
        res.end(err);
    });
}

exports.delete = function(req, res) {
    User.remove({ _id: req.params.user_id })
    .then((user) => {
        res.json({ message: 'Successfully deleted' });
    }).catch((err) => {
        res.end(err);
    })
};

/*
    UTIL: GENERAL USE
*/

function dbSuccessHandler(res) {
    return (data) => {
        res.json(data);
    }
}

function dbErrorHandler(res) {
    return (err) => {
        res.json(err);
    }
}

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

/*
    UTIL: CREATE USER
*/

function validateNewUser(user) {
    let valid = true;
    const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    
    valid = valid && regex.test(user.email);
    valid = valid && ["business", "marketing", "PYME", "personal"].includes(user.type);
    valid = valid && user.password && user.password.length >= 8;

    return valid;
}

function createUserModel(req) {
    var user = new User();

    switch (user.type) {
        case userTypes.personal:
            user.name     = req.body.name;
            user.lastname = req.body.lastname;
            break;

        case userTypes.business:
        case userTypes.marketing:
        case userTypes.PYME:
            user.businessName = req.body.businessName;
    }  
    user.status = "active";
    user.website = req.body.website;
    user.createdOn = Date.now();
    user.updatedOn = Date.now();
    user.password = hashPassword(req.body.password);

    return user
}

