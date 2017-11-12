var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AuthSchema = new Schema({
    email:        String,
    status:       { type: String, enum: ['active', 'inactive', 'suspended', 'blocked'] },
    password:     String
});

module.exports = mongoose.model('Auth', AuthSchema, 'Users');