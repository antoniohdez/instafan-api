const User = require('../../models/user');
const response = require('../../util/response');
const password = require('../../util/password');

exports.list = function(req, res) {
    User.find()
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));
}

exports.create = function(req, res) {
    const user = createUserModel(req, res);
    user.then((user) => {
            if (user) {
                user.save()
                    .then(response.returnPublicSchema(res))
                    .catch(response.returnError(res));
            }
        })
        .catch((err) => {
            response.returnCustomError(res, 400, err);
        });
}

exports.show = function(req, res) {
    User.findById(req.params.user_id)
        .then(response.returnPublicSchema(res))
        .catch(response.returnError(res));
}

exports.update = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            updatedUser = user.setPublicSchema(req.body);
            updatedUser.updatedOn = Date.now();

            updatedUser.save()
                .then(response.returnPublicSchema(res))
                .catch(response.returnError(res));

        })
        .catch(response.returnError(res));
}

exports.delete = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            user.status = 'inactive';
            user.save()
                .then(response.returnPublicSchema(res))
                .catch(response.returnError(res));
        })
        .catch(response.returnError(res));
    /*User.remove({ _id: req.params.user_id })
        .then(response.returnPublicSchema(res))
        .catch(response.returnError(res));*/
};

async function createUserModel(req, res) {
    req.body.email = req.body.email.toLowerCase();

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        let newUser = new User();
        newUser = Object.assign(newUser, req.body);
        
        newUser.status = 'active';
        newUser.createdOn = Date.now();
        newUser.updatedOn = Date.now();
        
        password.validatePassword(newUser.password, req, res);
        newUser.password = password.hashPassword(req.body.password);
        
        return newUser;    
    }
    throw new Error("User already registered.");
}