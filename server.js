#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    chromeFlags: ['--headless', '--disable-gpu', '--hide-scrollbars']
});

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.ignoreQueryParams());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(require('prerender-memory-cache'));


server.start();
