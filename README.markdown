Todo for ConPA 2 (see conpa2-jquery branch)
================

- Update README for ConPA 2 (events, architecture, etc.).

- Add a link to large application doc by Addy Osmani.

- Add a note about the videos related with ConPA 1.

- Add a note for grunt and supervisor file.

- Add most used symols tag cloud above the charts.

- Add volatility graphs below asset stats.

- Add user portofolios in local storage above latest portfolios.

- Update the labels in portfolio dashboard.

- Add a route to aggregate the dashboard calls.

- Update the search field to the big one.

- Add the description to the symbol.

- Add the constraints.

- Add a tooltip with the stats of the portfolio in the dashboard for the ids.

- Add the loading of the portfolio, if the id of the dashboard is clicked.

- Fix the header page on iPhone.

- Add default assets to the basket, if it is empty.

- Add ie support: http://todomvc.com/assets/ie.js


CONPA
=====

This module contains a complete frontend stack for an asset allocation 
application.

The entry point may be the following one:

http://my.address.com:myport/ConPA/

It depends how the [express](http://github.com/visionmedia/express) instance
is configured.

For instance,

http://localhost:8001/ConPA/

There are two old videos about ConPA 1:
[welcome](http://www.youtube.com/watch?v=ia_UVHtuBTM) and
[tutorial](http://www.youtube.com/watch?v=xIwbc6lQzNk).

ConPA aggregates a few components in a single page: the asset search, the list
of assets, the portfolio charts, the assets stats and the dashboard.

To fill the basket, the user needs to add an asset, using the search edit field: 
typing the name or the symbol of an asset, the autocomplete component suggests a 
few assets. When the user selects an asset, it is added to the basket, 
displaying the symbol.

In the meantime for the last asset added to the basket, the app provides the key
statistics.

When the basket contains at least three assets, the basket is optimized, 
creating two portfolios: the first portfolio contains the optimal weights of the
assets at the actual date; the second one contains the optimal weights of the
portfolio as it was created one year ago (year to date). The performances of the
portfolio created in the past are calculated and displayed.

Below basket and asset info there is the dashboard: it contains the stats of all 
portfolios created by the users: last created portfolios, best/worst performing 
porfolios, high/low risk profile portfolios and high/low return profile 
portfolios.

Example
=======

In the examples directory there is a simple express configuration.

Installation
============

To install with [npm](http://github.com/isaacs/npm):

    npm install conpa

Tested with node 0.8.x.

Notes
=====

Before running ConPA, you need to configure the details of the persistence
system. The portfolios are saved on a CouchDB instance. The configuration
allows a live and testing system, you don't need to change the source code
when the app is delivered to a live system.

Optionally, you may add a Rserve configuration (local or remote). If Rserve is
not configured, ConPA uses a javascript implementation for the optimization.

For instance,

    crm: {
        liveDomain: "x.x.x",
        liveUrl: "http://key1:pass1@p.c.com",
        liveDb: "myLiveDBName",
        testingUrl: "http://key2:pass2@p.c.com",
        testingDb: "myTestingDBName",
        design: "designName",
    },
    rserve: {
        host: "myHost",
        port: "myPort",
        user: "myUser",
        password: "myPassword"
    }

ConPA [Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=Q29uUEEtPk5vZGVKUzogbmF2aWdhdGlvbgphbHQgABkFIGJhY2tlbmQgd2l0aCBqcyBjYWxjCiAgICBub3RlIG92ZXIgADoGABAFABMGZGUtY29ucGEgAAYOZmluYW5jZQAbDnF1YWRwcm9nAE8FZW5kAFMFCmVsc2UAbRRSIGNsb3VkAF4jcmlvIChSc2VydmUgYWRhcHRlcikAVg4gICAAgTQHLT4AUQVudW1iZXJzLmNvbTogZ2V0IG9wdGltYWwgcG9ydGZvbGlvABEjcGVyZm9ybWFuY2VzAEAjaW1wbGllZCB2b2xhdGlsaXR5AIJODwCBChAAgl4JAIFWBgCCbQl0c2VyaQBsBwAaBUpTT05JTwCBYRIAgVsQLQCDdgsAgXwFIGNydW5jaGluZyByZXNwb25zZQplbmQKAIIlBy0-AIQyBToAEwoKCgoKCgo&s=napkin).

The module adds the following routes to the express instance:

- /ConPA/getOptimalPortfolio

- /ConPA/getScriptOptimalPortfolio

- /ConPA/getKeyStatistics

- /ConPA/getImpliedVolatility

- /ConPA/getPortfolio

- /ConPA/putPortfolioOnCRM

- /ConPA/getLastCreatedPortfolios

- /ConPA/getBestPerformingPortfolios

- /ConPA/getWorstPerformingPortfolios

- /ConPA/getHighProfileRiskPortfolios

- /ConPA/getLowProfileRiskPortfolios

- /ConPA/getHighProfileReturnPortfolios

- /ConPA/getLowProfileReturnPortfolios

- /ConPA/getPortfolioCount

- /ConPA/getMostUsedAssets

In lib/ConPA/public folder there is the frontend implementation.

Methods
=======

configure(app, express, config)
---------

It creates an optimal portfolio. If *config* is defined, the method call a
Rserve instance, otherwise a native implementation is used.

- *app* an instance of the express.HTTPServer, created with createServer().

- *express* an instance of the express module.

- *config*

    - *crm*

        - *liveDomain* url for the live domain.

        - *liveUrl* url for the live instance, eventually with the credentials.

        - *liveDb* name of live instance.

        - *testingUrl* url for the testing instance, eventually with the credentials.

        - *testingDb* name of testing instance.

        - *design* name of design document.

    - *rserve*

        - *host* hostname or ip address of R instance.

        - *port* port of Rserve instance.

        - *user* username for remote connection of Rserve instance.

        - *password* password for remote connection of Rserve instance.

