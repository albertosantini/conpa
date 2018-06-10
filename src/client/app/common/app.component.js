import { Util } from "../util.js";
import { AppTemplate } from "./app.template.js";

export class AppComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("app"));

        AppTemplate.update(render);
    }
}

AppComponent.bootstrap();
