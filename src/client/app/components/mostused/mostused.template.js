import { ToastsComponent } from "../toasts/toasts.component.js";

export class MostUsedTemplate {
    static update(render) {
        const classes = "f6 link br-pill ba ph3 pv2 mb2 dib black ma1";

        /* eslint-disable indent */
        render`
            <h2>Most Used Assets</h2>
            ${{
                any: fetch("/.netlify/functions/get-mostusedassets").then(res => res.json()).then(assets =>
                    hyperHTML.wire()`
                        ${assets.map(asset => `<span class="${classes}"><b>${asset.name}</b> ${asset.frequency}</span>`)}
                    `).catch(err => ToastsComponent.update({ message: err.message || err })),
                placeholder: "Loading..."
            }}
        `;
        /* eslint-enable indent */
    }
}
