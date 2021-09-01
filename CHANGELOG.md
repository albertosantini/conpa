7.3.0 / 2021-09-01
==================

* Change Yahoo search url

7.2.0 / 2021-07-17
==================

* Use Tailwind as css library instead of Tachyons.

7.1.3 / 2021-05-09
==================

* No wrap asset in latest portfolios.

7.1.2 / 2021-05-09
==================

* Fix dates width in latest portfolios.

7.1.1 / 2021-04-07
==================

* Fix other portfolios order.

7.1.0 / 2021-04-07
==================

* Use Skypack CDN for browser libs.
* Remove build and watch workflows.
* Remove sleep in other portfolios.

7.0.0 / 2021-04-05
==================

* Port to Supabase and Netlify.

6.0.3 / 2020-03-22
==================

* Add favicon.
* Update deps.

6.0.2 / 2020-02-13
==================

* Fix lint script.

6.0.1 / 2020-02-13
==================

* Improve setup.

6.0.0 / 2020-02-13
==================

* Refactor to serverless Zeit Now.

5.3.13 / 2018-11-23
==================

* Update pouchdb-server 4.2.0 and other deps to zeroing vulnerabilities.
* Use GitHub Actions for CI instead of Travis CI.

5.3.12 / 2018-11-23
==================

* Update Now platform.
* Update hyperhtml 2.17.2.

5.3.11 / 2018-09-14
==================

* Update hyperhtml 2.14.0.

5.3.10 / 2018-07-29
==================

* Check optimization result before basket coherence.
* Refactor portfolio params.

5.3.9 / 2018-07-28
==================

* Fix portfolios count in latest portfolios.
* Fix optimization if basket is changed.
* Update hyperhtml 2.12.0

5.3.8 / 2018-07-20
==================

* Fix date range for other portfolio query.
* Update hyperhtml 2.11.3

5.3.7 / 2018-07-06
==================

* Improve displaying basket table.

5.3.6 / 2018-07-05
==================

* Rename Year-Over-Year to YOY.
* Refactor header alignment.
* Extract id from basket and asset tables.
* Align stats at the end of the template.
* Add padding to the basket input.

5.3.5 / 2018-07-04
==================

* Improve styles in header and stats table.
* Update finance 4.4.3, hyperhtml 2.11.1.

5.3.4 / 2018-07-03
==================

* Add header to stats table.
* Add horizontal margin to the app.
* Remove center style from the latest table.

5.3.3 / 2018-07-02
==================

* Add event target polyfill for Safari.
* Remove space between asset symbol and its weight in the tables.

5.3.2 / 2018-07-01
==================

* Check data for other portfolios.
* Fix Ready toast.
* Improve styles in the tables.

5.3.1 / 2018-07-01
==================

* Update finance 4.4.2.
* Handle zero ptfs in portfolio count.

5.3.0 / 2018-06-28
==================

* Use queryByDate in other portfolios.
* Update finance 4.4.1.

5.2.0 / 2018-06-27
==================

* Update finance 4.3.0.
* Rename YearToDate methods to Year-Over-Year.

5.1.3 / 2018-06-26
==================

* Update finance 4.2.4.
* Update eslint 5.x.

5.1.2 / 2018-06-22
==================

* Update finance 4.2.3.

5.1.1 / 2018-06-21
==================

* Add console.warn to toasts.
* Improve toasts display alignment.
* Add queue to the toasts.
* Update workway 0.5.2, finance 4.2.1.

5.1.0 / 2018-06-20
==================

* Improve error handling in the optimization.
* Update workway 0.5.1, finance 4.2.0.
* Hide basket table if there are not search assets.
* Justify left basket and asstes tables.
* Add a table for the basket.
* Add description of the symbol in the assets table.
* Update hyperhtml 2.10.13.

5.0.4 / 2018-06-17
==================

* Update workway 0.4.1.

5.0.3 / 2018-06-15
==================

* Catch backend errors in the templates.
* Improve toasts.
* Improve deploying installing deps only (vs. devDeps).

5.0.2 / 2018-06-14
==================

* Escape assets name or description containing single or double quotes.
* Refactor rate limiter apis.
* Check optimization before saving the portfolio.

5.0.1 / 2018-06-13
==================

* Add the rest of crm methods to the rate limiter.

5.0.0 / 2018-06-10
==================

* Port to hyperHTML and workway.

4.10.0 / 2018-05-13
==================

* Update finance 4.1.0.

4.9.0 / 2018-05-12
==================

* Update finance 4.0.0.

4.8.0 / 2018-05-11
==================

* Update all deps.

4.7.0 / 2017-12-09
==================

* Use locally a PouchDB in-memory instance.

4.6.2 / 2017-12-09
==================

* Update finance 3.3.1.

4.6.1 / 2017-12-08
==================

* Move pouchdb deps to devDependencies.
* Ignore db folder when deploying and publishing.

4.6.0 / 2017-12-08
==================

* Add api rate limiter.
* Migrate to IBM Cloudant.

4.5.3 / 2017-10-11
==================

* Update finance 3.3.0 and other deps.

4.5.2 / 2017-10-07
==================

* Update angularjs 1.6.6 and many other deps.
* Add deploy script to package.json.
* Fix linter errors due to major upgrade of the linter.

4.5.1 / 2017-07-08
==================

* Fix 400 errors in the autocomplete.

4.5.0 / 2017-07-08
==================

* Configure package.json for now hosting.
* Update angularjs 1.6.5 and many other deps.

4.4.0 / 2017-06-05
==================

* Update angularjs 1.6.4 and many other deps.
* Update finance dep due to Yahoo Finance endpoint change.

4.3.0 / 2017-01-15
==================

* Update angularjs 1.6.1.
* Fix jsonp call for quote autocomplete.
* Fix key statistics due to finance dep 3.x.
* Update other deps.

4.2.0 / 2016-10-08
==================

* Use yahoo service for quotes completion.
* Update angular 1.5.8.
* Update sqlite 3.1.6.
* Update deps.

4.1.0 / 2016-06-20
==================

* Update pouchdb-server 1.2.0 (PouchDB 5.4.4).
* Update angular 1.5.7.
* Update other deps.

4.0.1 / 2016-05-17
==================

* Update finance 2.4.7.
* Add now-start script.

4.0.0 / 2016-05-16
==================

* Use PouchDB instance (vs. CouchDB).

3.10.0 / 2016-05-15
==================

* Use google service for quotes completion.
* Remove routing.
* Use angular component api.
* Update Material 1.0.8

3.9.0 / 2016-04-22
==================

* Update AngularJS 1.5.5.
* Update Material 1.0.7.
* Use local resources (node_modules) for frontend assets.
* Use monospace font.

3.8.0 / 2016-02-04
==================

* Update AngularJS 1.5.0-rc.2.
* Update Material 1.0.4.
* Remove grunt from build workflow.

3.7.1 / 2015-12-22
==================

* Add asset weights in latest and other portfolios.

3.7.0 / 2015-12-20
==================

* Add R script to check results.
* Add portfolio count to the basket view.
* Update Material 1.0.1.

3.6.0 / 2015-12-19
==================

* Refactor worst and best views.
* Throw an exception if crm env vars not set.
* Add Travis CI support.

3.5.0 / 2015-12-18
==================

* Use recent best and worst portfolios.
* Add most used assets.

3.4.0 / 2015-12-17
==================

* Fix asset stats when basket is empty.
* Add assets list to portfolios dashboard.

3.3.0 / 2015-12-16
==================

* Save asset symbols to local storage.

3.2.0 / 2015-12-15
==================

* Add portfolio performances.
* Add year-to-date portfolio.

3.1.1 / 2015-12-13
==================

* Reset optimal weights for every optimization.

3.1.0 / 2015-12-13
==================

* Save the portfolio after the optimization.

3.0.0 / 2015-12-13
==================

* Rewritten from scratch based on AngularJS.

2.5.0 / 2015-12-10
==================

* Update Bootstrap 3.3.5.
* Update finance 2.4.0.
* Fix typos.
* Update deps.

2.4.0 / 2014-06-08
==================

* Updated finance 2.2.0.
* Updated Bootstrap 3.1.1, Lo-Dash 2.4.1, jQuery 1.11.1.

2.3.1 / 2013-11-02
==================

* Quick fix for a new generated app file.

2.3.0 / 2013-11-02
==================

* Replaced sparkline library with Google Chart.
* Added karma tests.
* Updated Bootstrap 3.0.1.
* Updated Lo-Dash 2.2.1.

2.2.0 / 2013-08-25
==================

* Updated Bootstrap 3.0.0.

2.1.0 / 2013-08-24
==================

* Updated finance 2.0.0.
* Updated jQuery 1.10.2, Lo-Dash 1.3.1, SparkLines 2.1.2.

2.0.7 / 2013-04-01
==================

* Updated jQuery 1.9.1, Lo-Dash 1.1.1, Bootstrap 2.3.1, SparkLines 2.1.1.

2.0.6 / 2012-11-27
==================

* Updated finance module: 1.3.1.

* Updated external libraries: jQuery 1.8.3, Lo-Dash 0.10.0, Bootstrap 2.2.1.

2.0.5 / 2012-10-07
==================

* Fix json response in getPortfolio.

* Updated external libraries: jQuery 1.8.2, Lo-Dash 0.8.1.

2.0.4 / 2012-09-06
==================

* Updated external libraries: jQuery 1.8.1.

2.0.3 / 2012-09-05
==================

* Updated external libraries: Bootstrap 2.1.1.

* The selection of an asset in the suggestion box fires a change event and not
a selectitem event.

2.0.2 / 2012-09-02
==================

* Updated external libraries: Lo-Dash 0.6.1.

* Added table-hover to the dashboard tables.

2.0.1 / 2012-08-23
==================

* Updated external libraries: Bootstrap 2.0.1, jQuery 1.8.0, Lo-Dash 0.5.2.

2.0.0 / 2012-08-02
==================

* Rewritten from scratch based on jQuery.

1.2.3 / 2012-07-15
==================

* Updated to node-finance 1.2.13.

1.2.2 / 2012-05-25
==================

* Updated to YUI 3.5.1.
* Ported performance graph to YUI 3.
* Modifed the footer.

1.2.1 / 2012-04-13
==================

* Fixed the tooltip in dashboard.

1.2.0 / 2012-04-13
==================

* Updated to YUI 3.5.0 and finance 1.2.12.

1.1.8 / 2011-11-20
==================

* Updated to node-finance 1.2.11.

1.1.7 / 2011-11-17
==================

* Updated to node-finance 1.2.10.

1.1.6 / 2011-11-17
==================

* Updated to node-finance 1.2.9.

1.1.5 / 2011-11-17
==================

* Updated to node-finance 1.2.8.

1.1.4 / 2011-11-15
==================

* Updated to node-finance 1.2.7.

1.1.3 / 2011-11-14
==================

* Fixed get optimal portfolio when timeout condition is raised.

1.1.2 / 2011-11-13
==================

* Fixed when there are not performances.

1.1.1 / 2011-10-25
==================

* Removed observer script.

1.1.0 / 2011-10-02
==================

* R script of the portfolio optimization is provided server-side.

1.0.1 / 2011-10-01
==================

* Updated to YUI 3.4.1.

1.0.0 / 2011-09-28
==================

* Initial release.
