/*global YUI, YAHOO */

/**
 * @module conpa-assetsearch
 */
YUI.add('conpa-assetsearch', function (Y) {
    Y.namespace('ConPA.AssetSearch');

    Y.ConPA.AssetSearch.init = function () {
        var oDS, acNode = Y.one('#ysearchinput');

        oDS = new Y.DataSource.Get({
            source: "http://d.yimg.com/aq/autoc?query=",
            generateRequestCallback: function (id) {
                // YAHOO = {};
                // YAHOO.util = {};
                // YAHOO.util.ScriptNodeDataSource = {};
                YAHOO.util.ScriptNodeDataSource.callbacks =
                    YUI.Env.DataSource.callbacks[id];
                return "&callback=YAHOO.util.ScriptNodeDataSource.callbacks";
            }
        });
        oDS.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "ResultSet.Result",
                resultFields: ["symbol", "name", "exch", "type", "exchDisp"]
            }
        });

        acNode.plug(Y.Plugin.AutoComplete, {
            maxResults: 10,
            activateFirstItem: true,
            resultTextLocator: 'symbol',
            resultFormatter: function (query, results) {
                return Y.Array.map(results, function (result) {
                    var asset = result.raw;

                    return asset.symbol +
                        " " + asset.name +
                        " (" + asset.type +
                        " - " + asset.exchDisp + ")";
                });
            },
            requestTemplate:  "{query}&region=US&lang=en-US",
            source: oDS,
            width: 'auto'
        });

        Y.fire('ConPA-AssetSearch:init', acNode);

        acNode.ac.after('resultsChange', function (e) {
            var newWidth = this.get('boundingBox').get('offsetWidth');
            acNode.setStyle('width', Math.max(newWidth, 100));
        });

        acNode.ac.on('select', function (e) {
            var data = e.result.raw;

            data.optimalWeight = 0;
            data.min = 0;
            data.max = 100;

            Y.fire('ConPA-AssetSearch:select', data);
        });
    };

}, '1.0', {
    requires: ['autocomplete'],
    skinnable: true
});
