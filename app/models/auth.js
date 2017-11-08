var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AuthSchema = new Schema({
    email:        String,
    status:       { type: String, enum: ["active", "inactive", "suspended"] },
    password:     String
});

module.exports = mongoose.model('User', AuthSchema);