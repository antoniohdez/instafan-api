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
        res.status(400).json(err);
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