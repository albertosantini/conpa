import hyperHTML from "https://cdn.skypack.dev/hyperhtml?min";

import { Util } from "./util.js";
import { RootTemplate } from "./root.template.js";

export class RootComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("root"));

        RootTemplate.update(render);
    }
}

RootComponent.bootstrap();
