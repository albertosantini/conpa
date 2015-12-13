CONPA
=====
[![NPM version](https://badge.fury.io/js/conpa.png)](http://badge.fury.io/js/conpa)
[![NGN Dependencies](https://david-dm.org/albertosantini/node-conpa.png)](https://david-dm.org/albertosantini/node-conpa)

ConPA 3 is a complete frontend stack for an asset allocation application.

ConPA 3 is a single page app with the following components: the asset search,
the list of assets, the basket info, the assets stats and the dashboard of
portfolios.

To fill the basket, the user needs to add an asset, using the autocomplete
search: typing the name or the symbol of an asset, the autocomplete component
suggests a few assets. When the user selects an asset, it is added to the
basket, displaying the symbol.

In the meantime for the last asset added to the basket, the app provides the key
statistics.

When the basket contains at least three assets, the basket is optimized,
displaying the optimal weights of the assets.

There is also a dashboard of portfolios. It contains the stats of all portfolios
created by the users: last created portfolios, best/worst performing portfolios,
high/low risk profile portfolios and high/low return profile portfolios.

Installation
============

[![NPM](https://nodei.co/npm/conpa.png?downloads=true)](https://nodei.co/npm/conpa/)
[![NPM](https://nodei.co/npm-dl/conpa.png)](https://nodei.co/npm/conpa/)

To install with [npm](http://github.com/isaacs/npm):

    npm install conpa

You may start the app, creating a `server.js` file:

    process.env.CONPA_LIVE_URL = "... live url for crm ...";
    process.env.CONPA_TEST_URL = "... test url for crm ...";

    require("conpa");

Then

    node server.js

And browse, for instance, `http://localhost:8080`.

Tested locally with Node.js 5.x.

Notes
=====

Before running ConPA, you need to configure the details of the persistence
system. The portfolios are saved on a CouchDB instance. The configuration allows
a live and testing system, you don't need to change the source code when the app
is delivered to a live system.

Optionally, you may add a Rserve configuration (local or remote). If Rserve is
not configured, ConPA uses a javascript implementation for the optimization.

ConPA [Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=Q29uUEEtPk5vZGVKUzogbmF2aWdhdGlvbgphbHQgABkFIGJhY2tlbmQgd2l0aCBqcyBjYWxjCiAgICBub3RlIG92ZXIgADoGABAFABMGZGUtY29ucGEgAAYOZmluYW5jZQAbDnF1YWRwcm9nAE8FZW5kAFMFCmVsc2UAbRRSIGNsb3VkAF4jcmlvIChSc2VydmUgYWRhcHRlcikAVg4gICAAgTQHLT4AUQVudW1iZXJzLmNvbTogZ2V0IG9wdGltYWwgcG9ydGZvbGlvABEjcGVyZm9ybWFuY2VzAEAjaW1wbGllZCB2b2xhdGlsaXR5AIJODwCBChAAgl4JAIFWBgCCbQl0c2VyaQBsBwAaBUpTT05JTwCBYRIAgVsQLQCDdgsAgXwFIGNydW5jaGluZyByZXNwb25zZQplbmQKAIIlBy0-AIQyBToAEwoKCgoKCgo&s=napkin).

History
=======

- ConPA rel. 0 (2008 - 2011): Jaxer + YUI.
- ConPA rel. 1 (2011 - 2012): Node.js + YUI.
- ConPA rel. 2 (2012 - 2015): Node.js + jQuery MVC.
- ConPA rel. 3 (2015 - present): Node.js + AngularJS 1.

There are two old videos about ConPA 0:
[welcome](http://www.youtube.com/watch?v=ia_UVHtuBTM) and
[tutorial](http://www.youtube.com/watch?v=xIwbc6lQzNk).
