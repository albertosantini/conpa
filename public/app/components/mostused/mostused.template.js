import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { ToastsComponent } from "../toasts/toasts.component.js";

export class MostUsedTemplate {
    static update(render) {
        const classes = "border-2 font-bold py-2 px-4 rounded-full m-2 cursor-default";

        /* eslint-disable indent */
        render`
            <h2 class="text-2xl font-semibold my-4">Most Used Assets</h2>
            ${{
                any: fetch("/.netlify/functions/get-mostusedassets").then(res => res.json()).then(assets =>
                    hyperHTML.wire()`
                        ${assets.map(asset => `<button class="${classes}"><b>${asset.name}</b> ${asset.frequency}</button>`)}
                    `).catch(err => ToastsComponent.update({ message: err.message || err })),
                placeholder: "Loading..."
            }}
        `;
        /* eslint-enable indent */
    }
}
