/*global YUI, YAHOO, setTimeout */

/**
 * @module conpa-mostusedsymbols
 */
YUI.add('conpa-mostusedsymbols', function (Y) {
    Y.namespace('ConPA.MostUsedSymbols');

    Y.ConPA.MostUsedSymbols.init = function () {
        Y.on('ConPA-AssetSearch:init', function (acNode) {
            Y.io("/ConPA/getMostUsedAssets", {
                on: {
                    success: function (id, o) {
                        var i, symbols, mostUsedSymbols, oMenuSymbolsButton;

                        mostUsedSymbols = JSON.parse(o.responseText);

                        function onMenuSymbolClick(p_sType, p_aArgs) {
                            var oMenuItem = p_aArgs[1].cfg.getProperty("text");

                            Y.one("#ysearchinput").set('value', oMenuItem);
                            setTimeout(function () {
                                acNode.focus();
                                acNode.ac.sendRequest(oMenuItem);
                            }, 0);
                        }

                        symbols = [];
                        for (i = 0; i < mostUsedSymbols.length; i = i + 1) {
                            symbols.push({
                                text: mostUsedSymbols[i][0], // symbol
                                value: mostUsedSymbols[i][1] // usage
                            });
                        }
                        oMenuSymbolsButton = new YAHOO.widget.Button(
                            "mostUsedSymbols",
                            {
                                type: "menu",
                                menu: symbols
                            }
                        );

                        oMenuSymbolsButton.getMenu()
                            .subscribe("click", onMenuSymbolClick);
                    }
                }
            });
        });
    };

}, '1.0', {
    requires: [],
    skinnable: true
});
