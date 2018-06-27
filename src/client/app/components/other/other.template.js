import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class OtherTemplate {
    static update(render) {
        const otherBestPtfs = [
            { name: "Perf", metric: "perf", kind: "Best", sort: "desc" },
            { name: "Risk", metric: "risk", kind: "Low", sort: "asc" },
            { name: "Ret", metric: "ret", kind: "High", sort: "desc" }
        ];
        const otherWorstPtfs = [
            { name: "Perf", metric: "perf", kind: "Worst", sort: "asc" },
            { name: "Risk", metric: "risk", kind: "High", sort: "desc" },
            { name: "Ret", metric: "ret", kind: "Low", sort: "asc" }
        ];

        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Other Portfolios Year-Over-Year</h2>

                <div class="flex">
                    <div class="flex flex-wrap">${{
                        any: otherBestPtfs.map(other =>
                            OtherTemplate.otherPortfolios(finance,
                                other.name, other.metric, other.kind, other.sort)),
                        placeholder: "Loading Best Portfolios..."
                    }}</div>

                    <div class="flex flex-wrap">${{
                        any: otherWorstPtfs.map(other =>
                            OtherTemplate.otherPortfolios(finance,
                                other.name, other.metric, other.kind, other.sort)),
                        placeholder: "Loading Worst Portfolios..."
                    }}</div>
                </div>
            `;
            /* eslint-enable indent */
        });
    }

    static otherPortfolios(finance, name, metric, kind, sort) {
        const now = new Date();
        const oneYearAgo = (new Date(now.getTime() - (1000 * 86400 * 1 * 365)));

        return finance.queryByDate({
            metric,
            beginRefDate: Util.getYYYYMMDDfromDate(oneYearAgo),
            endRefDate: Util.getYYYYMMDDfromDate(now),
            limit: 3,
            sort
        }).then(data => {
            const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-white tr";

            /* eslint-disable indent */
            return hyperHTML.wire()`
                <table class="f7 mw8 pa2" cellpsacing="0">
                    <thead>
                        <th class="${headerClasses}">${name}</th>
                        <th class="${headerClasses}">To Date</th>
                        <th class="${headerClasses}">${kind}</th>
                    </thead>

                    <tbody>${data.docs.map(ptf => {
                            const trClasses = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(ptf, ":tr")`<tr>
                                <td class="${trClasses}">${Util.formatNumber(ptf[metric] * 100, 1)}%</td>
                                <td class="${trClasses}">${ptf.ref}</td>
                                <td class="${trClasses}">${ptf.assets.map((asset, index) => `<b>${asset}</b>
                                    <span>(${Util.formatNumber(ptf.weights[index] * 100, 1)}%)</span>
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
