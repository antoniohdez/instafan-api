var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CampaignSchema = new Schema({
    name:        { type: String, required: true },
    target:      { type: String, required: true },
    targetID:    String,
    hashtag:     String,
    startDate:   Date,
    endDate:     Date,
    status:      { type: String, required: true, enum: ['active', 'inactive', 'suspended'] },
    stickers:    { type: [ String ], required: true, validate: { validator: (stickers) => { return stickers.length >= 4 && stickers.length <= 8 }, message: 'Invalid number of stickers' } },
    watermark:   String,

    createdOn:    Date,
    updatedOn:    Date
});

// All but status and createdOn
CampaignSchema.methods.setPublicSchema = function(campaign) {
    this.name        = campaign.name || this.name;
    //this.target      = campaign.target || this.target
    //this.targetID    = campaign.targetID || this.targetID
    this.hashtag     = campaign.hashtag || this.hashtag
    this.startDate   = campaign.startDate || this.startDate
    this.endDate     = campaign.endDate || this.endDate
    this.status      = campaign.status || this.status
    this.stickers    = campaign.stickers || this.stickers
    this.watermark   = campaign.watermark || this.watermark

    return this;
}

module.exports = mongoose.model('Campaigns', CampaignSchema);