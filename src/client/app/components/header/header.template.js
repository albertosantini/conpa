export class HeaderTemplate {
    static update(render) {
        /* eslint-disable indent */
        render`
            <nav class="flex flex-row bt bb mh5 shadow-2">

                <div class="flex flex-wrap flex-row justify-around items-center min-w-70 b logo">
                    <img class="logo" src="/img/bleeding-edge.png">
                    <a href="https://github.com/albertosantini/node-conpa">ConPA 6</a>
                    <span>Asset Allocation App</span>
                </div>

                <div class="flex flex-wrap flex-row justify-end items-center min-w-30 f7">
                    <div>
                        <toasts></toasts>
                    </div>
                </div>

            </nav>
        `;
        /* eslint-enable indent */
    }
}
