export class HeaderTemplate {
    static update(render) {
        render`
            <nav class="flex flex-row border-b-2 border-solid border-black mx-16 shadow">

                <div class="flex flex-wrap flex-row justify-around items-center min-w-70 font-bold logo">
                    <img class="h-16" src="/img/bleeding-edge.png" alt="ConPA">
                    <a class="underline" href="https://github.com/albertosantini/node-conpa">ConPA 7</a>
                    <span>Asset Allocation App</span>
                </div>

                <div class="flex flex-wrap flex-row justify-end items-center min-w-30 text-xs">
                    <div>
                        <toasts></toasts>
                    </div>
                </div>

            </nav>
        `;
    }
}
