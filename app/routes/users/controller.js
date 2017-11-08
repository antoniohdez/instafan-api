var bcrypt = require('bcrypt');
var User = require('../../models/user');

exports.list = function(req, res) {
    User.find()
        .then(returnFullObject(res))
        .catch(returnError(res));
}

exports.create = function(req, res) {
    const user = createUser(req, res);

    user.save()
        .then(returnPublicUser(res))
        .catch(returnError(res));
}

exports.show = function(req, res) {
    User.findById(req.params.user_id)
        .then(returnPublicUser(res))
        .catch(returnError(res));
}

exports.update = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            updatedUser = user.setPublicUser(req.body);
            updatedUser.updatedOn = Date.now();

            updatedUser.save()
                .then(returnPublicUser(res))
                .catch(returnError(res));

        })
        .catch(returnError(res));
}

exports.delete = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            user.status = "inactive";
            user.save()
                .then(returnPublicUser(res))
                .catch(returnError(res));
        })
        .catch(returnError(res));
    /*User.remove({ _id: req.params.user_id })
        .then(returnPublicUser(res))
        .catch(returnError(res));*/
};

/*
    UTIL: GENERAL USE
*/

function returnPublicUser(res) {
    return (user) => {
        var publicUser = user.getPublicUser();
        res.json(publicUser);
    }
}

function returnFullObject(res) {
    return (user) => {
        res.json(user);
    }
}

function returnError(res) {
    return (err) => {
        res.json(err);
    }
}

function returnCustomError(res, status, err) {
    res.status(status)
        .end(JSON.stringify(
            {   
                "errors": {
                    [err.key]: {
                        "message": err.message,
                        "name": err.name,
                        "value": err.value
                    }
                }
            }
        )
    );
}

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

function validatePassword(password, req, res) {
    if (req.body.password.length < 8) {
        returnCustomError(res, 401, {key: "password", name: "ValidatorError", message: "Invalid password", value: req.body.password})
        throw "Invalid password";
    }

    return true;
}

function createUser(req, res) {
    let user = new User();
    user = Object.assign(user, req.body);
    
    user.status = "active";
    user.createdOn = Date.now();
    user.updatedOn = Date.now();
    
    validatePassword(req.body.password, req, res);
    user.password = hashPassword(req.body.password);
    
    return user;
}