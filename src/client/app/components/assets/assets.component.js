import { Util } from "../../util.js";
import { AssetsTemplate } from "./assets.template.js";
import { AssetsController } from "./assets.controller.js";

export class AssetsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("assets"));

        this.assetsController = new AssetsController(render, AssetsTemplate);
    }

    static update() {
        this.assetsController.update();
    }
}
