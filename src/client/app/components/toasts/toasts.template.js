import { Util } from "../../util.js";

export class ToastsTemplate {
    static update(render, { message = "" } = {}) {
        if (!message) {
            return;
        }

        const toasts = ToastsTemplate.toasts;

        toasts.push(message);

        if (ToastsTemplate.isRunnning) {
            return;
        }

        ToastsTemplate.run(render, toasts, () => {
            ToastsTemplate.isRunnning = false;

            ToastsTemplate.renderReady(render);
        });
    }

    static run(render, toasts, callback) {
        ToastsTemplate.isRunnning = true;

        if (toasts.length > 0) {
            ToastsTemplate.renderToast(render, toasts.shift());
            setTimeout(() => {
                ToastsTemplate.run(render, toasts, callback);
            }, 2000);
        } else {
            return callback();
        }

        return true;
    }

    static renderReady(render) {
        const now = Util.formatDate(new Date());

        console.warn("Ready");
        render`<span>${now} Ready.</span>`;
    }

    static renderToast(render, message) {
        const now = Util.formatDate(new Date());

        console.warn(message);
        render`<span class="bg-yellow">${now} ${message}.</span>`;

    }
}

ToastsTemplate.toasts = [];
ToastsTemplate.isRunnning = false;
