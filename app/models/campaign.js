var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CampaignSchema = new Schema({
    name:        String,
    targetImage: String,
    hashtag:     String,
    startDate:   Date,
    endDate:     Date,
    status:      { type: String, enum: ['active', 'inactive', 'suspended'] },
    stickers:    [ String ],
    watermark:   String,

    createdOn:    Date,
    updatedOn:    Date
});

// All but status and createdOn
CampaignSchema.methods.setPublicSchema = function(campaign) {
    this.name        = campaign.name || this.name;
    this.targetImage = campaign.targetImage || this.targetImage
    this.hashtag     = campaign.hashtag || this.hashtag
    this.startDate   = campaign.startDate || this.startDate
    this.endDate     = campaign.endDate || this.endDate
    this.status      = campaign.status || this.status
    this.stickers    = campaign.stickers || this.stickers
    this.watermark   = campaign.watermark || this.watermark

    return this;
}

module.exports = mongoose.model('Campaigns', CampaignSchema);