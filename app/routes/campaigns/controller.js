const Campaign = require('../../models/campaign');
const util = require('../../util');

exports.list = function(req, res) {
    Campaign.find()
        .then(util.returnFullSchema(res))
        .catch(util.returnError(res));
}

exports.create = function(req, res) {
    const campaign = createCampaign(req, res);

    campaign.save()
        .then(util.returnFullSchema(res))
        .catch(util.returnError(res));
}

exports.show = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then(util.returnFullSchema(res))
        .catch(util.returnError(res));
}

exports.update = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then((campaign) => {
            updatedCampaign = campaign.setPublicSchema(req.body);
            updatedCampaign.updatedOn = Date.now();

            updatedCampaign.save()
                .then(util.returnFullSchema(res))
                .catch(util.returnError(res));

        })
        .catch(util.returnError(res));
}

exports.delete = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then((campaign) => {
            campaign.status = 'inactive';
            campaign.save()
                .then(util.returnFullSchema(res))
                .catch(util.returnError(res));
        })
        .catch(util.returnError(res));
    /*Campaign.remove({ _id: req.params.campaign_id })
        .then(util.returnFullSchema(res))
        .catch(util.returnError(res));*/
};

function createCampaign(req, res) {
    let campaign = new Campaign();
    campaign = Object.assign(campaign, req.body);
    
    campaign.status = 'active';
    campaign.createdOn = Date.now();
    campaign.updatedOn = Date.now();
    
    return campaign;
}