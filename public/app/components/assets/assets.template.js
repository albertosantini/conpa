import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";

export class AssetsTemplate {
    static update(render, state, events) {
        if (!state.assets.length) {
            /* eslint-disable indent */
            render`
                <h2>Assets</h2>

                <p>No assets.</p>
                <p>Add, at least, three or more assets from Basket to get an optimal portfolio.</p>
            `;
            /* eslint-enable indent */

            return;
        }

        const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-black-10";
        const trClasses = "pv1 pr1 bb b--black-20";
        const trClassesLink = `${trClasses} pointer dim`;
        const trClassesNumber = `${trClasses} tr`;

        /* eslint-disable indent */
        render`
            <h2>Assets</h2>

            <table class="f7 mw8 pa2">
                <thead>
                    <th class="${headerClasses}">Symbol</th>
                    <th class="${headerClasses}">Description</th>
                    <th class="${headerClasses}">Weight TD</th>
                    <th class="${headerClasses}">Weight YOY</th>
                </thead>

                <tbody>${state.assets.map((asset, index) => {
                    const id = `asset-${asset.symbol}`;

                    return hyperHTML.wire()`<tr>
                        <td id="${id}" onclick="${e => events(e, asset)}"
                            class="${trClassesLink}"
                            title="Click to remove the asset">${asset.symbol}</td>
                        <td class="${trClasses}">${asset.name}</td>
                        <td class="${trClassesNumber}">${Util.formatNumber(state.weightsTD[index] * 100, 1)}%</td>
                        <td class="${trClassesNumber}">${Util.formatNumber(state.weightsYOY[index] * 100, 1)}%</td>
                    </tr>`;
                })}</tbody>
            </table>
        `;
        /* eslint-enable indent */
    }
}
