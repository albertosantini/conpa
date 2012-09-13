CONPA
=====

ConPA 2 is a complete frontend stack for an asset allocation application.

ConPA 2 is a single page with the following components: the asset search, the list
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

Below basket and asset info, there is the dashboard. It contains the stats of
all portfolios created by the users: last created portfolios, best/worst
performing porfolios, high/low risk profile portfolios and high/low return
profile portfolios.

There are two old videos about ConPA 1:
[welcome](http://www.youtube.com/watch?v=ia_UVHtuBTM) and
[tutorial](http://www.youtube.com/watch?v=xIwbc6lQzNk).

Architecture
============

After reading the following paper
[Patterns For Large-Scale JavaScript Application Architecture]
(http://addyosmani.com/largescalejavascript/),
ConPA 2 is based on modules loosely coupled, using a pub/sub pattern to exchange
information.

The asset libraries are the following:

- [Bootstrap](http://twitter.github.com/bootstrap/) - 2.1.1 -
  css, typeahead and alert components.

- [jQuery](http://jquery.com/) - 1.8.1

- [Sparklines](http://omnipotent.net/jquery.sparkline/) - 2.0 -
  to draw the graphs.

- [Lo-Dash](http://lodash.com/) - 0.7.0 -
  drop-in replacement for [Underscore.js]
  (http://documentcloud.github.com/underscore/).

- [jQuery Tiny Pub/Sub](https://gist.github.com/661855) - 0.7

The app may evolve using [Backbone.js]
(http://documentcloud.github.com/backbone/).

Just in case the following libraries are in the radar:

- [Datepicker for Bootstrap](http://www.eyecon.ro/bootstrap-datepicker/)

- [A localStorage adapter for Backbone.js]
  (https://github.com/jeromegn/Backbone.localStorage)

- [Underscore.string](http://epeli.github.com/underscore.string/) -
  to format strings and numbers.

- [A lightweight javascript date library](http://momentjs.com/) -
  to format dates.

- [A conditional AMD loader](http://yepnopejs.com/)

assetSearch
-----------

- *Description*: It calls the Yahoo Finance autocompletion url, providing ten
  suggestions (symbol, name, type and market) to complete the string typed. It
  fills the input with the quote symbol.

- *Tag*: 'input'

- *Route*: http://autoc.finance.yahoo.com/autoc

- *Event*

    - change, fired when the user selects an item in the suggestion box.

assetList
---------

- *Description*: It renders the list of the assets added to the basket. The user
  can delete an asset. When there are less than three assets in the basket, the
  reference date is reset to year-to-date.

- *Tag*: '#asset-list'

- *Route*: none

- *Events*

    - render.app.conpa, fired when an asset is deleted.

    - render.assetlist.conpa, catched when an asset is added to the basket.

assetStats
----------

- *Description*: It renders the key statistics, in two columns, of the last
  asset in the basket. The header of the statistics is modified accordingly.

- *Tags*:

    - '#asset-stats-name'

    - '#asset-stats-list1'

    - '#asset-stats-list2'

- *Route*: /ConPA/getKeyStatistics

- *Event*

    - stats.asset.conpa, catched when an asset is added to the basket.

portfolioOptimization
---------------------

- *Description*: It displays the optimal weights of the assets in the basket at
  two reference dates: today and the reference date (default is year to date).
  It draw two pie charts and a one bar chart related to the performance of the
  portfolio since the reference date until today.

- *Tags*:

    - '#basket-pie-chart'

    - '#basket-pie-refdate-label'

    - '#basket-pie-ytd-chart'

    - '#basket-performance-refdate-label'

    - '#basket-performance-ytd-chart'

- *Routes*:

    - /ConPA/getOptimalPortfolio

    - /ConPA/putPortfolioOnCRM

- *Events*

    - error.message.conpa, fired when the portfolio optimization fails.

    - crm.portfolio.conpa, fired when the portfolio is optimized.

    - clear.portfolio.conpa, catched when the assets in the basket are
      greater than two.

    - optimization.portfolio.conpa, catched when the assets in the basket are
      greater than two.

portfolioDashboard
------------------

- *Description*: It display the latest optimized portfolios and the best or the
  worst portfolios with respect to performance, risk and return.

- *Tags*:

    - '#latest-portfolios-list'

    - '#best-performing-portfolios-list'

    - '#worst-performing-portfolios-list'

    - '#lowprofile-risk-portfolios-list'

    - '#highprofile-risk-portfolios-list'

    - '#lowprofile-return-portfolios-list'

    - '#highprofile-return-portfolios-list'

- *Routes*:

    - /ConPA/getLastCreatedPortfolios

    - /ConPA/getBestPerformingPortfolios

    - /ConPA/getWorstPerformingPortfolios

    - /ConPA/getLowProfileRiskPortfolios

    - /ConPA/getHighProfileRiskPortfolios

    - /ConPA/getLowProfileReturnPortfolios

    - /ConPA/getHighProfileReturnPortfolios

- *Events*

    - render.app.conpa, fired when the user click on a row of the dashboard
      tables to load a stored portfolio.

    - render.dashboard.conpa, catched when the app renders.

portfolioCRM
------------

- *Description*: It saves a portfolio in the backend.

- *Tag*: none

- *Route*: /ConPA/putPortfolioOnCRM

- *Events*

    - render.dashboard.conpa, fired when a new portfolio is saved to the
      backend.

    - crm.portfolio.conpa, catched when the portfolio is optimized to save
      it.

errorMessage
------------

- *Description*: It displays an error message.

- *Tag*: '#message'

- *Route*: none

- *Events*

    - clear.message.conpa, catched to clear the message.

    - error.message.conpa, catched to display an error message.

appUtil
-------

- string $.conpa.utils.rfc4122v4()

- string $.conpa.helpers.percentageFormatter(number)

- string $.conpa.helpers.hyphenFormatter(id)

- date $.conpa.dates.today()

- boolean $.conpa.dates.isToday(date)

- date $.conpa.dates.yearToDate()

- string $.conpa.dates.ymdDate(date)

model
-----

    {
        assets: [{
           id: uuid
           symbol: string
        }],

        refdate: date string
    }

Todo
====

- Update charts labels when the the portfolio is reset.

- Add most used symbols tag cloud above the charts.

- Add user portfolios in local storage above latest portfolios.

- Update the labels in portfolio dashboard.

- Update the search field to the big one.

- Add the description to the symbol (maybe using jquery-handsontable).

- Add a route to aggregate the dashboard calls.

- Add volatility graphs below asset stats.

- Add the assets constraints.

- Add a tooltip to the ids with the assets of the portfolio in the dashboard.

- Check the top of the page on iPhone, because it seems there is a margin.

- Add default assets to the basket, if it is empty.

Installation
============

To install with [npm](http://github.com/isaacs/npm):

    npm install conpa

Tested with node 0.8.x.

The module adds the following routes to the
[express](http://github.com/visionmedia/express) instance:

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

In the examples directory there is a simple express configuration.

Notes
=====

Before running ConPA, you need to configure the details of the persistence
system. The portfolios are saved on a CouchDB instance. The configuration allows
a live and testing system, you don't need to change the source code when the app
is delivered to a live system.

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

Methods
=======

configure(app, express, config)
---------

It creates an optimal portfolio. If *config* is defined, the method call a
Rserve instance, otherwise a native implementation is used.

- *app* an instance of the express.HTTPServer, created with createServer().

- *express* an instance of the express module.

- *config*

    - *pubdir* folder for the frontend files (default "/public").

    - *crm*

        - *liveDomain* url for the live domain.

        - *liveUrl* url for the live instance, eventually with the credentials.

        - *liveDb* name of live instance.

        - *testingUrl* url for the testing instance, eventually with the
          credentials.

        - *testingDb* name of testing instance.

        - *design* name of design document.

    - *rserve*

        - *host* hostname or ip address of R instance.

        - *port* port of Rserve instance.

        - *user* username for remote connection of Rserve instance.

        - *password* password for remote connection of Rserve instance.

