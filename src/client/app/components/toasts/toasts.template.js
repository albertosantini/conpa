import { Util } from "../../util.js";

export class ToastsTemplate {
    static update(render, { message = "" } = {}) {
        const now = Util.formatDate(new Date());

        if (message) {
            render`<span class="bg-yellow">${now} ${message}.</span>`;
        }
        setTimeout(() => {
            render`<span>${now} Ready.</span>`;
        }, 10000);
    }
}
