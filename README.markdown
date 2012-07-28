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


CONPA
=====

This module contains an asset allocation application.

The entry point is:

http://my.address.com:myport/ConPA/ConPA.html

It depends how the [express](http://github.com/visionmedia/express) instance
is configured.

For instance,

http://localhost:8001/ConPA/ConPA.html

See [welcome](http://www.youtube.com/watch?v=ia_UVHtuBTM) and
[tutorial](http://www.youtube.com/watch?v=xIwbc6lQzNk) videos.

There are two tabs: basket and dashboard.

In basket tab firstly you should build a basket of assets and, then, get the
optimal weights for each assets.

"Add Asset" field is a autocomplete field: if you start to type some character,
it will open a list of products, matching with the string.

You have to select the product and press enter (or click the left button of the
mouse) to insert the product in the basket. The first product of the list is
automatically selected.

You have to insert minimum three assets (and a maximum of ten) to get the
weights of the optimal portfolio. Finally, you could the constraints for each
asset and, after pushing the button "Get Optimal Portfolio", please, wait a few
seconds to get the result: we should retrieve the historical prices,
create the covariance matrix, set the constraints and optimize a la Markowitz
the asset allocation.

The optimized portfolio is identified with an id: hoovering on id, a tooltip
displays performance, risk (the standard deviation of the portfolio returns)
and return of the portfolio.

The covariance matrix is built using weekly returns since two years before the
reference date.

You can set the annual target return. The default is 0%: it means the target
return is calculated as the mean of the asset returns.

If you (left) click on the symbol of the asset in the basket, you can see the
key statistics and implied volatility graphs for that asset.

If you want to check the figures, you can click on the script icon and an
R script, corresponding to the optimal portfolio, is displayed.

In dashboard tab there are stats of all portfolios created by the users:
last created portfolios, best/worst performing porfolios, high/low risk profile
portfolios and high/low return profile portfolios.

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

