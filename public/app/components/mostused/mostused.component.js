import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "../../util.js";
import { MostUsedTemplate } from "./mostused.template.js";

export class MostUsedComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("most-used"));

        MostUsedTemplate.update(render);
    }
}
