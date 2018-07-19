/**
 * Created by diegojonio on 2017-09-08.
 */
var util = require('../util.js');
var UserAgentParser = require('ua-parser-js');
var request = require('request');

const url = require("url");

module.exports = {
    beforeSend: (req, res, next) => {
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

        var userAgent = UserAgentParser(req.header('User-Agent'));

        var data = '/type=resumecompageviews&unixtime=' + Date.now() + '&url='+ (req.prerender.url || '') + '&method=' + (req.method || '')
            + '&host=' + (parts.host || '') + '&path=' + (parts.path || '') + '&protocol=' + (parts.protocol || '') + '&ua=' + (userAgent.ua || '')
            + '&browser=' + (userAgent.browser.name || '') + '&browserVersion=' + (userAgent.browser.version || '')
            + '&device=' + (userAgent.device.model || '') + '&os=' + (userAgent.os.name || '') + '&osVersion=' + (userAgent.os.version || '')
            + '&engine=' + (userAgent.engine.name || '') + '&architecture=' + (userAgent.cpu.architecture || '')
            + '&vendor=' + (userAgent.device.vendor || '') + '&httpVersion=' + (req.httpVersion || '') + '&ip=' + (req.client.remoteAddress || '')
            + '&responseCode=' + req.prerender.statusCode + '&&';
        
        console.log('access_log: ', data);

        var options = {
            uri: process.env.CLIP_URL,
            method: "POST",
            'Content-type': 'application/x-www-form-urlencoded',
            headers: {
                'X-Clip-Secret': process.env.CLIP_KEY
            },
            body: data
        };

        request(options, function (error, response, body) {

            if (error) {
                console.log('CLIP Error:', error);
            } else if ( response) {
                if (response.statusCode != 200) {
                    console.log('CLIP Error:', response.statusMessage);
                } else {
                    console.log('CLIP Response: ', response.statusCode);
                }
            } else {
                console.log('CLIP Unknown Error: ', JSON.stringify(error));
            }
        });


        next();
    }
};
