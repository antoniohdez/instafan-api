const User = require('../../models/user');
const response = require('../../util/response');
const password = require('../../util/password');

exports.list = function(req, res) {
    User.find()
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));
}

exports.create = function(req, res) {
    const user = createUser(req, res);

    user.save()
        .then(response.returnPublicSchema(res))
        .catch(response.returnError(res));
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

function createUser(req, res) {
    let user = new User();
    user = Object.assign(user, req.body);
    
    user.status = 'active';
    user.createdOn = Date.now();
    user.updatedOn = Date.now();
    
    password.validatePassword(req.body.password, req, res);
    user.password = password.hashPassword(req.body.password);
    
    return user;
}