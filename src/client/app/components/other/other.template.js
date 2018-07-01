import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class OtherTemplate {
    static update(render) {
        const otherPtfs = [
            { name: "Perf", metric: "perf", kind: "Best Performance", sort: "desc" },
            { name: "Perf", metric: "perf", kind: "Worst Performance", sort: "asc" },
            { name: "Risk", metric: "risk", kind: "Low Risk Profile", sort: "asc" },
            { name: "Risk", metric: "risk", kind: "High Risk Profile", sort: "desc" },
            { name: "Ret", metric: "ret", kind: "High Return Profile", sort: "desc" },
            { name: "Ret", metric: "ret", kind: "Low Return Profile", sort: "asc" }
        ];

        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Other Portfolios Year-Over-Year</h2>

                <div class="flex">
                    <div class="flex flex-wrap">${{
                        any: otherPtfs.map(other =>
                            OtherTemplate.otherPortfolios(finance,
                                other.name, other.metric, other.kind, other.sort)),
                        placeholder: "Loading Other Portfolios..."
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
            if (!data.docs) {
                return hyperHTML.wire()`No data for ${kind}.`;
            }

            const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-black-10 tr";
            const trClasses = "pv1 pr1 bb b--black-20 tr";

            /* eslint-disable indent */
            return hyperHTML.wire()`
                <table class="f7 mw8 pa2 w-100">
                    <thead>
                        <th class=${`${headerClasses} w-10`}>${name}</th>
                        <th class=${`${headerClasses} w-10`}>To Date</th>
                        <th class="${headerClasses}">${kind}</th>
                    </thead>

                    <tbody>${data.docs.map(ptf =>
                        hyperHTML.wire(ptf, ":tr")`<tr>
                            <td class="${trClasses}">${Util.formatNumber(ptf[metric] * 100, 1)}%</td>
                            <td class="${trClasses}">${ptf.ref}</td>
                            <td class="${trClasses}">${ptf.assets.map((asset, index) => `<b>${asset}</b>
                                <span>(${Util.formatNumber(ptf.weights[index] * 100, 1)}%)</span>
                            `)}</td>
                        </tr>`)
                    }</tbody>
                </table>
            `;
            /* eslint-enable indent */
        }).catch(err => ToastsComponent.update({ message: err.message || err }));
    }
}
