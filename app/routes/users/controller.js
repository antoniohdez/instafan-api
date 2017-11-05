var User = require('../../models/user');

exports.list = function(req, res) {
    User.find()
    .then((users) => {
        res.json(users);
    }).catch((err) => {
        res.end(err);
    });
}

exports.create = function(req, res) {
    var user = new User();
    
    user.name = req.body.name;

    user.save()
    .then(() => {
        res.json({ message: 'User created' });
    }).catch((err) => {
        res.end(err);
    });
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

