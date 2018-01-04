const Analytics = require('../../models/analytics');
const response = require('../../util/response');
const password = require('../../util/password');

exports.summarize = function(req, res) {
    // TO DO: Make query
    Analytics.find()
        .then(response.returnFullSchema(res))
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