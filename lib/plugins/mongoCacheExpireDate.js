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
                    this.mongoCache.set(req.url, moment().add(this.CACHE_TIME_TO_LIVE, 'd').utc().toDate());
                    next();
                } else {
                    throw err;
                }
            });
        } else {
            this.mongoCache.set(req.url, moment().add(this.CACHE_TIME_TO_LIVE, 'd').utc().toDate());
            next();
        }
    }
};


var mongo_cache = {
    set: function(pagePath, value, callback) {
        database.collection('page_expiration', function (err, collection) {
            collection.update({_id: pagePath.slice(1)},
                {
                    $set: {
                        date_expire: value, date_updated: moment().utc().toDate(),
                        $inc: {"metrics.daily":1, "metrics.half_week":1, "metrics.weekly":1, "metrics.monthly":1}
                    },
                    $setOnInsert: {
                        date_created: moment().utc().toDate(),
                        metrics: {
                            daily: 1,
                            half_week: 1,
                            weekly: 1,
                            monthly: 1
                        }
                    }
                }, {upsert: true}, function (err) {}
            );
        });
    }
};