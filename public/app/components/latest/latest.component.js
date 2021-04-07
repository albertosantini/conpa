import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { LatestTemplate } from "./latest.template.js";

export class LatestComponent {
    static bootstrap() {
        this.render = hyperHTML.bind(Util.query("latest"));

        this.update();
    }

    static update() {
        LatestTemplate.update(this.render);
    }
}
