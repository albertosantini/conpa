import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";

export class AssetsTemplate {
    static update(render, state, events) {
        if (!state.assets.length) {
            render`
                <h2 class="text-2xl font-semibold my-4">Assets</h2>

                <p>No assets.</p>
                <p>Add, at least, three or more assets from Basket to get an optimal portfolio.</p>
            `;

            return;
        }

        const headerClasses = "text-sm text-left pr-2 pb-1 border-b-2 bg-gray-200";
        const trClasses = "text-xs pr-2 pb-1 pt-1 border-b-2";

        const trClassesLink = `${trClasses} cursor-pointer hover:bg-gray-100`;
        const trClassesNumber = `${trClasses} text-right`;

        /* eslint-disable indent */
        render`
            <h2 class="text-2xl font-semibold my-4">Assets</h2>

            <table class="text-xs max-w-5xl p-2 border-separate">
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
                        <td class="${trClasses}">${asset.shortname}</td>
                        <td class="${trClassesNumber}">${Util.formatNumber(state.weightsTD[index] * 100, 1)}%</td>
                        <td class="${trClassesNumber}">${Util.formatNumber(state.weightsYOY[index] * 100, 1)}%</td>
                    </tr>`;
                })}</tbody>
            </table>
        `;
        /* eslint-enable indent */
    }
}
