const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const LocationSchema = new Schema({
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true },
    city: { type: String }
});

const TimeSpanSchema = new Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true }
});

const AnalyticsSchema = new Schema({
    target:     { // Reference to the collection currently named "campaigns"
                    type: Schema.Types.ObjectId,
                    required: true
                },
    type:       { 
                    type: String, 
                    required: true, 
                    enum: ['scan', 'share', 'sticker', 'location', 'photo', 'timeSpan'],
                    validate: {
                        validator: typeValidator,
                        message: 'Invalid object: Missing data'
                    }
                },
    social:     { 
                    type: String, 
                    //enum: ['facebook', 'twitter'], 
                    validate: {
                        validator: function(value) { return this.type === 'share'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    sticker:    { 
                    type: Schema.Types.ObjectId,
                    validate: {
                        validator: function(value) { return this.type === 'sticker'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    location:   {
                    type: LocationSchema,
                    validate: {
                        validator: function(value) { return this.type === 'location'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    timeSpan:   {
                    type: TimeSpanSchema,
                    validate: {
                        validator: function(value) { return this.type === 'timeSpan'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    createdOn:  { type: Date, required: true },
    updatedOn:  { type: Date, required: true }
});

function typeValidator(type) {
    switch (type) {
        case 'share': 
            return !!this.social;
        case 'sticker':
            return !!this.sticker;
        case 'location':
            return !!this.location;
        case 'timeSpan':
            return !!this.timeSpan;
    }
    return true;
}

module.exports = mongoose.model('Analytics', AnalyticsSchema);