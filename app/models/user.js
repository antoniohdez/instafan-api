var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    firstname:    String,
    lastname:     String,
    businessName: String,
    email:        { type: String, required: true, validate: { validator: validateEmail, message: 'Invalid email address.' } },
    type:         { type: String, required: true, enum: ['business', 'marketing', 'PYME', 'personal'] },
    status:       { type: String, required: true, enum: ['active', 'inactive', 'suspended', 'blocked'] },
    website:      String,
    password:     String,
    
    createdOn:    Date,
    updatedOn:    Date
});

// All except password hash
UserSchema.methods.getPublicSchema = function() {
    return {
        firstname:    this.firstname,
        lastname:     this.lastname,
        businessName: this.businessName,
        email:        this.email,
        type:         this.type,
        status:       this.status,
        website:      this.website,
        createdOn:    this.createdOn,
        updatedOn:    this.updatedOn
    }
}

UserSchema.methods.setPublicUser = function(user) {
    this.firstname    = user.firstname || this.firstname;
    this.lastname     = user.lastname || this.lastname;
    this.businessName = user.businessName || this.businessName;
    this.type         = user.type || this.type;
    this.status       = user.status || this.status;
    this.website      = user.website || this.website;

    return this;
}

function validateEmail(email) {
    const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return regex.test(email);
}

module.exports = mongoose.model('Users', UserSchema, 'Users');