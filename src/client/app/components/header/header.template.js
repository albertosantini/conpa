import { HeaderService } from "./header.service.js";

export class HeaderTemplate {
    static update(render) {
        const start = Date.now();

        /* eslint-disable indent */
        render`
            <nav class="flex flex-row bt bb tc mw9 center shadow-2">

                <div class="flex flex-wrap flex-row justify-around items-center min-w-70 logo">
                    <span class="b">
                        <a href="https://github.com/albertosantini/node-conpa">ConPA 5</a>
                        Asset Allocation App
                    </span>
                </div>

                <div class="flex flex-wrap flex-row items-center min-w-30>
                    <span class="f7">
                        <toasts></toasts>
                        <div>${{
                            any: HeaderService.getStatus().then(({ namespace: status }) => {
                                const end = Date.now();

                                return `${status.message} (${end - start}ms)`;
                            }),
                            placeholder: "Loading..."
                        }}</div>
                    </span>
                </div>

            </nav>
        `;
        /* eslint-enable indent */
    }
}
