import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

export class BasketTemplate {
    static update(render, state, events) {
        const tableClasses = "text-xs max-w-5xl p-2 border-separate";
        const headerClasses = "font-semibold border-b border-black text-left pb-1 pr-2 bg-gray-200";
        const trClasses = "pt-1 pb-1 pr-2 border-b border-black";
        const trClassesLink = `${trClasses} cursor-pointer hover:bg-gray-100`;

        /* eslint-disable indent */
        render`
            <h2 class="text-2xl font-semibold my-4">Basket</h2>

            <div class="p-2 w-64">
                <label for="assetsSearch">What assets to be added?</label>
                <input id="assetsSearch" oninput="${events}"
                    class="border-2 border-solid p-2 w-64"
                    placeholder="asset">
            </div>

            ${state.assetsSearch.length ? () => hyperHTML.wire()`
                    <table class="${tableClasses}">
                        <thead>
                            <th class="${headerClasses}">Symbol</th>
                            <th class="${headerClasses}">Description</th>
                            <th class="${headerClasses}">Type</th>
                            <th class="${headerClasses}">Market</th>
                        </thead>

                        <tbody>${state.assetsSearch.map(asset => {
                            const id = `assetSearch-${asset.symbol}`;

                            return hyperHTML.wire()`<tr>
                                <td id="${id}" onclick="${e => events(e, asset)}"
                                    class="${trClassesLink}"
                                    title="Click to add the asset">${asset.symbol}</td>
                                <td class="${trClasses}">${asset.name}</td>
                                <td class="${trClasses}">${asset.type}</td>
                                <td class="${trClasses}">${asset.exchDisp}</td>
                            </tr>`;
                        })}</tbody>
                    </table>
                ` : ""
            }
        `;
        /* eslint-enable indent */
    }
}
