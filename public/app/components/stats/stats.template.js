import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { ToastsComponent } from "../toasts/toasts.component.js";

export class StatsTemplate {
    static update(render, { symbol = "" } = {}) {
        if (!symbol) {
            render`
                <h2 class="text-2xl font-semibold my-4">Last Asset Stats</h2>

                No stats available for last asset.
            `;

            return;
        }

        /* eslint-disable indent */
        render`
            <h2 class="text-2xl font-semibold my-4">Last Asset Stats ${symbol}</h2>

            ${{
                any: fetch(`/.netlify/functions/get-keystatistics?symbol=${symbol}`).then(res => res.json()).then(data => {
                    const labels = Object.keys(data);
                    const headerClasses = "text-sm text-right pr-2 pb-1 border-b-2 bg-gray-200";
                    const trClasses = "text-xs text-right pr-2 pb-1 pt-1 border-b-2";

                    return hyperHTML.wire()`
                        <table class="text-xs max-w-5xl p-2 border-separate">
                            <thead>
                                <th class="${headerClasses}">Label</th>
                                <th class="${headerClasses}">Value</th>
                            </thead>

                            <tbody>${labels.map(label => {
                                const value = data[label]?.fmt;

                                if (!value) {
                                    return hyperHTML.wire()`<tr></tr>`;
                                }

                                return hyperHTML.wire()`<tr>
                                    <td class="${trClasses}">${label}</td>
                                    <td class="${trClasses}">${value}</td>
                                </tr>`;
                            })
                        }</tbody>
                        </table>
                    `;
                }).catch(err => {
                    ToastsComponent.update({ message: `${symbol} Stats ${err.message || err}` });

                    return "Fundamental data not available for the asset.";
                }),
                placeholder: "Loading..."
            }}
        `;
        /* eslint-enable indent */
    }
}
