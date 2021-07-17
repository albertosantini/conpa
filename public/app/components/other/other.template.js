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
            <h2 class="text-2xl font-semibold my-4">Other Portfolios YOY</h2>

            <div class="flex">
                <div class="flex flex-wrap">${{
                    any: otherPtfs.map(async other => OtherTemplate.otherPortfolios(
                        other.name, other.metric, other.kind, other.ascending
                    )),
                    placeholder: "Loading Other Portfolios..."
                }}</div>
            </div>
        `;
        /* eslint-enable indent */
    }

    static otherPortfolios(name, metric, kind, ascending) {
        const now = new Date();
        const oneYearAgo = (new Date(now.getTime() - (1000 * 86400 * 1 * 365)));
        const startDate = Util.getYYYYMMDDfromDate(oneYearAgo);
        const query = `metric=${metric}&ascending=${ascending}&startDate="${startDate}"`;

        return fetch(`/.netlify/functions/get-otherportfolios?${query}`).then(res => res.json()).then(data => {
            if (!data) {
                return hyperHTML.wire()`No data for ${kind}.`;
            }

            const headerClasses = "text-sm text-right pr-2 pb-1 border-b-2 bg-gray-200";
            const trClasses = "text-xs text-right pr-2 pb-1 pt-1 border-b-2";

            /* eslint-disable indent */
            return hyperHTML.wire()`
                <table class="max-w-5xl pt-4 w-full my-2 border-separate">
                    <thead>
                        <th class=${`${headerClasses} w-2/12`}>${name}</th>
                        <th class=${`${headerClasses} w-2/12`}>To Date</th>
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
