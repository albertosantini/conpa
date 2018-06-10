import { Util } from "../../util.js";
import { BasketTemplate } from "./basket.template.js";
import { BasketController } from "./basket.controller.js";

export class BasketComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("basket"));

        this.basketController = new BasketController(render, BasketTemplate);
    }

    static update() {
        this.basketController.update();
    }
}
