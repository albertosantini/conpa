import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { OtherTemplate } from "./other.template.js";

export class OtherComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("other"));

        OtherTemplate.update(render);
    }
}
