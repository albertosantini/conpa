import { Util } from "../../util.js";

export class BasketTemplate {
    static update(render, state, events) {
        const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-black-10";
        const trClasses = "pv1 pr1 bb b--black-20";
        const trClassesLink = `${trClasses} pointer dim`;

        /* eslint-disable indent */
        render`
            <h2>Basket</h2>

            <div class="pa2 w5">
                <input id="assetsSearch" class="pa2" size="32" oninput="${events}" placeholder="What assets to be added?">
            </div>
            <table style="${Util.show(state.assetsSearch.length)}" class="f7 mw8 pa2">
                <thead>
                    <th class="${headerClasses}">Symbol</th>
                    <th class="${headerClasses}">Description</th>
                    <th class="${headerClasses}">Type</th>
                    <th class="${headerClasses}">Market</th>
                </thead>

                <tbody>${state.assetsSearch.map(asset => {
                    const id = `assetSearch-${asset.symbol}`;

                    return hyperHTML.wire()`<tr>
                        <td id="${id}" onclick=${e => events(e, asset)}
                            class="${trClassesLink}"
                            title="Click to add the asset">${asset.symbol}</td>
                        <td class="${trClasses}">${asset.name}</td>
                        <td class="${trClasses}">${asset.type}</td>
                        <td class="${trClasses}">${asset.exchDisp}</td>
                    </tr>`;
                })}</tbody>
            </table>
        `;
        /* eslint-enable indent */
    }
}
