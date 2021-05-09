import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class LatestTemplate {
    static update(render) {
        /* eslint-disable indent */
        render`
            <h2>Latest Portfolios ${{
                any: fetch("/.netlify/functions/get-portfoliocount").then(res => res.json()).then(data => {
                    if (!data) {
                        hyperHTML.wire()`<span>(total 0)</span>`;
                    }

                    return hyperHTML.wire()`<span>(total ${data})</span>`;
                }).catch(err => ToastsComponent.update({ message: err.message || err })),
                placeholder: hyperHTML.wire()`<font size="-2">Loading count...</font>`
            }}</h2>

            ${{
                any: fetch("/.netlify/functions/get-lastcreatedportfolios").then(res => res.json()).then(data => {
                    const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-black-10 tr";
                    const trClasses = "pv1 pr1 bb b--black-20 tr";

                    return hyperHTML.wire()`
                        <table class="f7 w-100 mw8 pa2">
                            <thead>
                                <th class="${headerClasses}">To Date</th>
                                <th class="${headerClasses}">Reference Date</th>
                                <th class="${headerClasses}">Assets</th>
                                <th class="${headerClasses}">Perf</th>
                                <th class="${headerClasses}">Risk</th>
                                <th class="${headerClasses}">Ret</th>
                            </thead>

                            <tbody>${data.map(ptf =>
                                hyperHTML.wire(ptf, ":tr")`<tr>
                                    <td class="${trClasses}">${ptf.created_at.replace("T", " ")}</td>
                                    <td class="${trClasses} w-10">${ptf.ref}</td>
                                    <td class="${trClasses}">${ptf.assets.map((asset, index) => `
                                        <b>${asset}</b><span>(${Util.formatNumber(ptf.weights[index] * 100, 1)}%)</span>
                                    `)}</td>
                                    <td class="${trClasses}"><b>${Util.formatNumber(ptf.perf * 100, 1)}%</b></td>
                                    <td class="${trClasses}">${Util.formatNumber(ptf.risk * 100, 1)}%</td>
                                    <td class="${trClasses}">${Util.formatNumber(ptf.ret * 100, 1)}%</td>
                                </tr>`)
                            }</tbody>
                        </table>
                    `;
                }).catch(err => ToastsComponent.update({ message: err.message || err })),
                placeholder: "Loading..."
            }}
        `;
        /* eslint-enable indent */
    }
}
