export class BasketTemplate {
    static update(render, state, events) {
        /* eslint-disable indent */
        render`
            <h2>Basket</h2>

            <input id="assetsSearch" size="32" oninput="${events}" placeholder="What assets to be added?">
            <ul onclick="${events}">${state.assetsSearch.map(asset =>
                `<li id="assetSearch-${asset.symbol}" data-value='${JSON.stringify(asset)}' class="pointer dim">
                    ${asset.symbol} ${asset.name} (${asset.type} - ${asset.exchDisp})
                </li>`)
            }</ul>
        `;
        /* eslint-enable indent */
    }
}
