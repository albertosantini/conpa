export class MostUsedTemplate {
    static update(render) {
        workway("node://finance.js").then(async({ namespace: finance }) => {
            const classes = "f6 link br-pill ba ph3 pv2 mb2 dib black ma1";

            /* eslint-disable indent */
            render`
                <h2>Most Used Assets</h2>
                ${{
                    any: finance.getMostUsedAssets().then(data => {
                        data.splice(10);

                        return hyperHTML.wire()`
                            ${data.map(asset => `<span class="${classes}"><b>${asset[0]}</b> ${asset[1]}</span>`)}
                        `;
                    }),
                    placeholder: "Loading..."
                }}
            `;
            /* eslint-enable indent */
        });
    }
}
