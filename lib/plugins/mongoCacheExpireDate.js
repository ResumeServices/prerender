var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGO_URL;

var database;

MongoClient.connect(mongoUri, function(err, db) {
    if (err) {
        throw err;
    }

    database = db;
});


module.exports = {
    init: function() {
        this.CACHE_TIME_TO_LIVE = process.env.CACHE_TIME_TO_LIVE_IN_DAYS;
        this.mongoCache = mongo_cache
    },

    afterPhantomRequest: function(req, res, next) {
        if (!database) {
            MongoClient.connect(mongoUri, function(err, db) {
                if (db) {
                    database = db;
                    this.mongoCache.set(req.url.slice(1));
                    next();
                } else {
                    throw err;
                }
            });
        } else {
            this.mongoCache.set(req.url.slice(1));
            next();
        }
    }
};


var mongo_cache = {
    set: function(pagePath) {
        database.collection('page_expiration', function (err, collection) {
            if (err) {throw err;}
            collection.update({_id: pagePath}, {
                    $set: {date_updated: moment().utc().toDate()},
                    $inc: {"metrics.daily": 1, "metrics.half_week": 1, "metrics.weekly": 1, "metrics.monthly": 1},
                    $setOnInsert: {date_created: moment().utc().toDate()}
                }, {upsert: true}, function (err) {
                    if (err) {throw err;}
            });
        });
    }
};