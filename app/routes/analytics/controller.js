const Analytics = require('../../models/analytics');
const Campaign = require('../../models/campaign');
const response = require('../../util/response');
const password = require('../../util/password');
const mongoose = require('mongoose');

exports.summarize = function(req, res) {
    Campaign
        .find({ userID: req.query.userID })
        .select('target')
        .then((campaigns) => {
            campaigns = campaigns.map((campaign) => campaign._id);

            Analytics.find({ 'target': { $in: campaigns } })
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
    Campaign
        .find({ _id: req.params.target_id }, "createdOn")
        .then((data) => {
            //response.returnFullSchema(res)(data);
        })

    Analytics
        .count({ target: req.params.target_id, type: 'scan' })
        .then((data) => {
            //response.returnFullSchema(res)(data);
        })

    Analytics
        .find({ target: req.params.target_id, type: 'timeSpan' })
        .then((data) => {
            //response.returnFullSchema(res)(data);
        })
        .catch(response.returnError(res));

    Analytics
        .find({ target: req.params.target_id, type: 'share' })
        .then((data) => {
            //response.returnFullSchema(res)(data);
        })
        .catch(response.returnError(res));

    Analytics
        .count({ target: req.params.target_id, type: 'photo' })
        .then((data) => {
            //response.returnFullSchema(res)(data);
        })
        .catch(response.returnError(res));

    Analytics
        .aggregate( [
            {
                $match: { 
                    type: "sticker",
                    target: mongoose.Types.ObjectId(req.params.target_id)
                }
            },
            { 
                $group: { 
                    _id: "$sticker",
                    count: { $sum: 1 }
                }
            }
        ] )
        .then((data) => {
            response.returnFullSchema(res)(data);
        })
        .catch(response.returnError(res));

    /*Analytics
        .find({ target: req.params.target_id })
        .then((data) => {

            response.returnFullSchema(res)({});
        })
        .catch(response.returnError(res));
        */
}