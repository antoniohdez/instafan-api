const Campaign = require('../../models/campaign');
const response = require('../../util/response');
const vuforia = require('../../../lib/vuforia')

const client = vuforia.client({
    accessKey: 'fdf4ade770a4833e7782c1961be14813fd2bf799',
    secretKey: 'b65d27f06ec8ecbb6cd629f63ae07967ca2f422a'
});
util = vuforia.util();

exports.list = function(req, res) {
    Campaign.find({ userID: req.query.userID })
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));
}

exports.create = function(req, res) {
    const campaign = createCampaign(req, res);

    campaign.save()
        .then(
            (campaign) => {
                // Delete the string: 'data:image/png;base64,' and 'data:image/jpeg;base64,'
                let target_image = campaign.target.split(',');
                target_image.shift();
                target_image = target_image.join('');

                const target = {
                    name: campaign._id,
                    width: 100.0, // Currently used in existing DB in Vuforia. Could change.
                    image: target_image,
                    active_flag: true,
                    application_metadata: util.encodeBase64(JSON.stringify({ id: campaign._id }))
                }
                
                client.addTarget(target, (error, result) => {
                    if (error) {
                        console.log(error);
                        req.params.campaign_id = campaign._id;

                        exports.delete(req, res);
                    } else {
                        if (result.result_code === "TargetCreated") {
                            campaign.targetID = result.target_id;
                            campaign.save()
                                .then(response.returnFullSchema(res))
                                .catch(response.returnError(res));
                        } else {
                            // Check missing case here. 
                            console.log("=== Missing handler ===");
                            console.log(error);
                            console.log(result);
                            console.log("=== Missing handler ===");
                        }
                    }
                });
            })
        .catch(response.returnError(res));
}

exports.show = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));
}

// TODO: Test restriction on target image update, only info should be updated
exports.update = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then((campaign) => {
            updatedCampaign = campaign.setPublicSchema(req.body);
            updatedCampaign.updatedOn = Date.now();

            updatedCampaign.save()
                .then(response.returnFullSchema(res))
                .catch(response.returnError(res));

        })
        .catch(response.returnError(res));
}

exports.delete = function(req, res) {
    Campaign.findById(req.params.campaign_id)
        .then((campaign) => {
            campaign.status = 'deleted';
            campaign.updatedOn = Date.now();

            client.deleteTarget(campaign.targetID, (error, result) => {
                if (error) {
                    response.returnError(res)(error);
                } else {
                    campaign.save()
                        .then(response.returnFullSchema(res))
                        .catch(response.returnError(res));
                }
            });
        })
        .catch(response.returnError(res));
    /*Campaign.remove({ _id: req.params.campaign_id })
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));*/
};

function createCampaign(req, res) {
    let campaign = new Campaign();
    campaign = Object.assign(campaign, req.body);
    
    campaign.status = 'active';
    campaign.createdOn = Date.now();
    campaign.updatedOn = Date.now();
    
    return campaign;
}