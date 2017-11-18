var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AuthSchema = new Schema({
    email:        { type: String, required: true },
    status:       { type: String, required: true, enum: ['active', 'inactive', 'suspended', 'blocked'] },
    password:     { type: String, required: true }
});

module.exports = mongoose.model('Auth', AuthSchema, 'Users');