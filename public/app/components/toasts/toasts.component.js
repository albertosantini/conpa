import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { ToastsTemplate } from "./toasts.template.js";
import { ToastsController } from "./toasts.controller.js";

export class ToastsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("toasts"));

        this.toastsController = new ToastsController(render, ToastsTemplate);
        this.update();
    }

    static update(state) {
        this.toastsController.update(state);
    }
}
