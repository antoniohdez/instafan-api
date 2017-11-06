var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name:           String, // Takes a value only when 'type' is personal
    lastname:       String, // Takes a value only when 'type' is personal
    businessName:   String, // Takes a value only when 'type' is other than personal
    email:          String,
    type:           String, // [business|marketing|PYME|personal]
    status:         String, // [active|inactive|suspended]
    website:        String,
    password:       String,
    createdOn:      Date,
    updatedOn:      Date
});

module.exports = mongoose.model('User', UserSchema);