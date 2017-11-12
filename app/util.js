const bcrypt = require('bcrypt');

exports.returnPublicSchema = function(res) {
    return (schema) => {
        var publicSchema = schema.getPublicSchema();
        res.json(publicSchema);
    }
}

exports.returnFullSchema = function(res) {
    return (schema) => {
        res.json(schema);
    }
}

exports.returnError = function(res) {
    return (err) => {
        res.json(err);
    }
}

exports.returnCustomError = function(res, status, err) {
    res.status(status)
        .json({
        	'success': false,
            'errors': {
                [err.key]: {
                    'message': err.Errormessage,
                    'name': err.name,
                    'value': err.value
                }
            }
        }
    );
}

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