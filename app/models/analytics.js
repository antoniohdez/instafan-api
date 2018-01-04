const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const locationSchema = new Schema({
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true }
});

const timeSpanSchema = new Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true }
});

const AnalyticsSchema = new Schema({
    targetID:   { // Reference to the collection currently named "campaigns"
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
                    enum: ['facebook', 'twitter'], 
                    validate: {
                        validator: function(value) { return this.type === 'share'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    stickerID:  { 
                    type: Schema.Types.ObjectId, 
                    validate: {
                        validator: function(value) { return this.type === 'sticker'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    location:   {
                    type: locationSchema,
                    validate: {
                        validator: function(value) { return this.type === 'location'; },
                        message: 'Invalid object: Invalid parameter for request type'
                    }
                },
    timeSpan:   {
                    type: timeSpanSchema,
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
            return !!this.stickerID;
        case 'location':
            return !!this.location;
        case 'timeSpan':
            return !!this.timeSpan;
    }
    return true;
}

module.exports = mongoose.model('Analytics', AnalyticsSchema);