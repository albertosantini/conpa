import { Util } from "../../util.js";
import { HeaderTemplate } from "./header.template.js";

export class HeaderComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("header"));

        HeaderTemplate.update(render);
    }
}
