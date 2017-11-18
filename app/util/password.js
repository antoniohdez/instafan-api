const bcrypt = require('bcrypt');

exports.hashPassword = function(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

exports.validatePassword = function(password, req, res) {
    if (req.body.password.length < 8) {
        returnCustomError(res, 401, {key: 'password', name: 'ValidatorError', message: 'Invalid password', value: req.body.password})
        throw 'Invalid password';
    }

    return true;
}