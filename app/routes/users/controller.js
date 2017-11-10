const User = require('../../models/user');
const util = require('../../util');

exports.list = function(req, res) {
    User.find()
        .then(util.returnFullObject(res))
        .catch(util.returnError(res));
}

exports.create = function(req, res) {
    const user = createUser(req, res);

    user.save()
        .then(util.returnPublicUser(res))
        .catch(util.returnError(res));
}

exports.show = function(req, res) {
    User.findById(req.params.user_id)
        .then(util.returnPublicUser(res))
        .catch(util.returnError(res));
}

exports.update = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            updatedUser = user.setPublicUser(req.body);
            updatedUser.updatedOn = Date.now();

            updatedUser.save()
                .then(util.returnPublicUser(res))
                .catch(util.returnError(res));

        })
        .catch(util.returnError(res));
}

exports.delete = function(req, res) {
    User.findById(req.params.user_id)
        .then((user) => {
            user.status = 'inactive';
            user.save()
                .then(util.returnPublicUser(res))
                .catch(util.returnError(res));
        })
        .catch(util.returnError(res));
    /*User.remove({ _id: req.params.user_id })
        .then(util.returnPublicUser(res))
        .catch(util.returnError(res));*/
};

function createUser(req, res) {
    let user = new User();
    user = Object.assign(user, req.body);
    
    user.status = 'active';
    user.createdOn = Date.now();
    user.updatedOn = Date.now();
    
    util.validatePassword(req.body.password, req, res);
    user.password = util.hashPassword(req.body.password);
    
    return user;
}