import { ToastsComponent } from "../toasts/toasts.component.js";

export class StatsTemplate {
    static update(render, { symbol = "" } = {}) {
        if (!symbol) {
            render`
                <h2>Last Asset Stats</h2>

                No stats available for last asset.
            `;

            return;
        }

        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Last Asset Stats ${symbol}</h2>

                ${{
                    any: finance.getKeyStatistics({ symbol }).then(data => {
                        const labels = Object.keys(data);
                        const trClasses = "pv1 pr1 bb b--black-20 tr";

                        return hyperHTML.wire()`
                            <table class="f7 mw8 center pa2">
                                <tbody>${labels.map(label => {
                                    const value = data[label] && data[label].fmt;

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
        });
    }
}
