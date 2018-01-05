const Analytics = require('../../models/analytics');
const Campaign = require('../../models/campaign');
const response = require('../../util/response');
const password = require('../../util/password');

exports.summarize = function(req, res) {
    Campaign
        .find({ userID: req.query.userID })
        .select('targetID')
        .then((campaigns) => {
            campaigns = campaigns.map((campaign) => campaign._id);

            Analytics.find({ 'targetID': { $in: campaigns } })
                .then((data) => {
                    const summary = data.reduce((summary, d) => {
                        switch(d.type) {
                            case 'scan':
                            case 'share':
                            case 'sticker':
                            case 'photo':
                                summary[ d.type ]++;
                        }
                        return summary;
                    }, { scan: 0, share: 0, sticker: 0, photo: 0 });
                    
                    response.returnFullSchema(res)(summary);
                })
                .catch(response.returnError(res));
        })
        .catch(response.returnError(res));
}

exports.log = function(req, res) {
    let analytics = new Analytics();
    
    analytics = Object.assign(analytics, req.body);
    analytics.createdOn = Date.now();
    analytics.updatedOn = Date.now();

    analytics.save()
        .then(response.returnFullSchema(res))
        .catch(response.returnError(res));
}

exports.show = function(req, res) {
    // TO DO: Verify query
    Analytics.findById(req.params.target_id)
        .then(response.returnPublicSchema(res))
        .catch(response.returnError(res));
}