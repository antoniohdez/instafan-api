var app = require('../../../index');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Auth = require('../../models/auth');
var User = require('../users/controller');
const password = require('../../util/password');

exports.login = function(req, res) {
    Auth.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({ success: false, message: 'Authentication failed.' });
            } else {
                // Validate Password
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    
                    const payload = { email: user.email };
                    const expirationTime = 60 * 60; // 1 hours
                    const accessToken = generateWebToken(payload, expirationTime);

                    res.json({
                        success: true,
                        message: 'Authentication successful.',
                        accessToken: accessToken
                    });
                } else {
                    res.status(401).json({ success: false, message: 'Authentication failed.' });
                }
            }
        })
        .catch((error) => {
            res.status(401).json({ success: false, message: 'Authentication failed.' });
        });
};

exports.logout = function(req, res) {
    // Pending: Check to token will be handled in the frontend.
}

exports.register = function(req, res) {
    User.create(req, res);
}

exports.changePassword = function(req, res) {
    Auth.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.json({ success: false, message: 'Invalid password.' });
            } else {
                // Validate Password
                if (bcrypt.compareSync(req.body.currentpassword, user.password)) {

                    user.password = password.hashPassword(req.body.newPassword);
                    user.save()
                        .then((user) => {
                            res.json({
                                success: true,
                                message: 'Password change successful.'
                            });
                        })
                        .catch(() => {
                            
                        });
                } else {
                    res.json({ success: false, message: 'Authentication failed.' });
                }
            }
        })
        .catch();
}

exports.resetPassword = function(req, res) {
    // Pending: Check how email will work.
}

exports.verifyToken = function(req, res) {
    const accessToken = req.headers['x-access-token'];

    if (accessToken) {
        jwt.verify(accessToken, app.get('superSecret'), (err, decoded) => {
            if (err) {
                res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                res.json({
                    success: true,
                    message: 'Authenticated.'
                });
            }
        });    
    } else {
        res.status(401).json({ success: false, message: 'No token provided.' });
    }
    
}

function generateWebToken(payload, expirationTime) {
    const accessToken = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: expirationTime
    });

    return accessToken;
}