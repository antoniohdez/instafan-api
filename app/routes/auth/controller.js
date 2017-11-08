var bcrypt = require('bcrypt');
var User = require('../../models/user');

exports.login = function(req, res) {

};

exports.logout = function(req, res) {

}

exports.register = function(req, res) {

}

exports.changePassword = function(req, res) {

}

exports.resetPassword = function(req, res) {

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
