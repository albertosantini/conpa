import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class OtherTemplate {
    static update(render) {
        const otherBestPtfs = [
            { method: "getBestPerformingPortfolios", metric: "Perf", kind: "Best" },
            { method: "getLowProfileRiskPortfolios", metric: "Risk", kind: "Low" },
            { method: "getHighProfileReturnPortfolios", metric: "Ret", kind: "High" }
        ];
        const otherWorstPtfs = [
            { method: "getWorstPerformingPortfolios", metric: "Perf", kind: "Worst" },
            { method: "getHighProfileRiskPortfolios", metric: "Risk", kind: "High" },
            { method: "getLowProfileReturnPortfolios", metric: "Ret", kind: "Low" }
        ];

        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Other Portfolios</h2>

                <div class="flex">
                    <div class="flex flex-wrap">${{
                        any: otherBestPtfs.map(other =>
                            OtherTemplate.otherPortfolios(finance,
                                other.method, other.metric, other.kind)),
                        placeholder: "Loading Best Portfolios..."
                    }}</div>

                    <div class="flex flex-wrap">${{
                        any: otherWorstPtfs.map(other =>
                            OtherTemplate.otherPortfolios(finance,
                                other.method, other.metric, other.kind)),
                        placeholder: "Loading Worst Portfolios..."
                    }}</div>
                </div>
            `;
            /* eslint-enable indent */
        });
    }

    static otherPortfolios(finance, method, metric, kind) {
        return finance[method](3).then(data => {
            const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-white tr";

            /* eslint-disable indent */
            return hyperHTML.wire()`
                <table class="f7 mw8 center pa2" cellpsacing="0">
                    <thead>
                        <th class="${headerClasses}">${metric}</th>
                        <th class="${headerClasses}">To Date</th>
                        <th class="${headerClasses}">${kind}</th>
                    </thead>

                    <tbody>${data.rows.map(ptf => {
                            const trClasses = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(ptf, ":tr")`<tr>
                                <td class="${trClasses}">${Util.formatNumber(ptf.key * 100, 1)}%</td>
                                <td class="${trClasses}">${ptf.value.created_at}</td>
                                <td class="${trClasses}">${ptf.value.assets.map((asset, index) => `<b>${asset}</b>
                                    <span>(${Util.formatNumber(ptf.value.weights[index] * 100, 1)}%)</span>
                                `)}</td>
                            </tr>`;
                        })
                    }</tbody>
                </table>
            `;
            /* eslint-enable indent */
        }).catch(err => ToastsComponent.update({ message: err.message || err }));
    }
}
