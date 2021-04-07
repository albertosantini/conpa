import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { StatsTemplate } from "./stats.template.js";
import { StatsController } from "./stats.controller.js";

export class StatsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("stats"));

        this.statsController = new StatsController(render, StatsTemplate);
    }

    static update() {
        this.statsController.update();
    }
}
