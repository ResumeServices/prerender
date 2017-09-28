/**
 * Created by diegojonio on 2017-09-08.
 */
var url = require('url');
var util = require('../util.js');

module.exports = {
    init: function() {
        this.IGNORE_QUERY_PARAMS = (process.env.IGNORE_QUERY_PARAMS && process.env.IGNORE_QUERY_PARAMS.split(',')) || [];
    },
    beforePhantomRequest: function(req, res, next) {
        // Gets the URL to prerender from a request, stripping out unnecessary parts
        var decodedUrl
            , realUrl = req.prerender.url
            , parts;

        // util.log('env: '+ JSON.stringify(process.env));

        realUrl = realUrl.replace(/^\//, '');

        try {
            decodedUrl = decodeURIComponent(realUrl);
        } catch (e) {
            decodedUrl = realUrl;
        }

        //encode a # for a non #! URL so that we access it correctly
        decodedUrl = util.encodeHash(decodedUrl);

        //if decoded url has two query params from a decoded escaped fragment for hashbang URLs
        if (decodedUrl.indexOf('?') !== decodedUrl.lastIndexOf('?')) {
            decodedUrl = decodedUrl.substr(0, decodedUrl.lastIndexOf('?')) + '&' + decodedUrl.substr(decodedUrl.lastIndexOf('?') + 1);
        }

        parts = url.parse(decodedUrl, true);

        // Remove the _escaped_fragment_ query parameter
        if (parts.query && this.IGNORE_QUERY_PARAMS) {
            for (var i = 0; i < this.IGNORE_QUERY_PARAMS.length; i++) {
                if (parts.query[this.IGNORE_QUERY_PARAMS[i]]) {
                    // util.log('removing param: ' + this.IGNORE_QUERY_PARAMS[i]);
                    // util.log('params: ' + JSON.stringify(parts.query));
                    delete parts.query[this.IGNORE_QUERY_PARAMS[i]];
                    delete parts.search;
                }
            }
        }

        var newUrl = url.format(parts);

        //url.format encodes spaces but not arabic characters. decode it here so we can encode it all correctly later
        try {
            newUrl = decodeURIComponent(newUrl);
        } catch (e) {
        }

        newUrl = util.encodeHash(newUrl).replace(/\/+$/, '');
        util.log("new url: " + newUrl);

        req.prerender.url = newUrl;
        next();
    }
};