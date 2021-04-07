import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class OtherTemplate {
    static update(render) {
        const otherPtfs = [
            { name: "Perf", metric: "perf", kind: "Best Performance", ascending: false },
            { name: "Perf", metric: "perf", kind: "Worst Performance", ascending: true },
            { name: "Risk", metric: "risk", kind: "Low Risk Profile", ascending: true },
            { name: "Risk", metric: "risk", kind: "High Risk Profile", ascending: false },
            { name: "Ret", metric: "ret", kind: "High Return Profile", ascending: false },
            { name: "Ret", metric: "ret", kind: "Low Return Profile", ascending: true }
        ];

        /* eslint-disable indent */
        render`
            <h2>Other Portfolios YOY</h2>

            <div class="flex">
                <div class="flex flex-wrap">${{
                    any: otherPtfs.map(async other => {
                        await Util.sleep(Math.random() * 5000); // due to rate limiting

                        return OtherTemplate.otherPortfolios(
                            other.name, other.metric, other.kind, other.ascending
                        );
                    }),
                    placeholder: "Loading Other Portfolios..."
                }}</div>
            </div>
        `;
        /* eslint-enable indent */
    }

    static otherPortfolios(name, metric, kind, ascending) {
        const now = new Date();
        const endDate = Util.getYYYYMMDDfromDate(now);
        const oneYearAgo = (new Date(now.getTime() - (1000 * 86400 * 1 * 365)));
        const startDate = Util.getYYYYMMDDfromDate(oneYearAgo);
        const query = `metric=${metric}&ascending=${ascending}&startDate="${startDate}"&endDate="${endDate}"`;

        return fetch(`/.netlify/functions/get-otherportfolios?${query}`).then(res => res.json()).then(data => {
            if (!data) {
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

                    <tbody>${data.map(ptf =>
                        hyperHTML.wire(ptf, ":tr")`<tr>
                            <td class="${trClasses}">${Util.formatNumber(ptf[metric] * 100, 1)}%</td>
                            <td class="${trClasses}">${ptf.ref}</td>
                            <td class="${trClasses}">${ptf.assets.map((asset, index) => `
                                <b>${asset}</b><span>(${Util.formatNumber(ptf.weights[index] * 100, 1)}%)</span>
                            `)}</td>
                        </tr>`)
                    }</tbody>
                </table>
            `;
            /* eslint-enable indent */
        }).catch(err => ToastsComponent.update({ message: err.message || err }));
    }
}
