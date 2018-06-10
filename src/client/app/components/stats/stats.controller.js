import { AssetsService } from "../assets/assets.service.js";

export class StatsController {
    constructor(render, template) {
        this.render = render;
        this.template = template;
        this.state = {
            lastSymbol: ""
        };

        this.update();
    }

    update() {
        const lastAsset = AssetsService.getLastAsset();
        const symbol = lastAsset && lastAsset.symbol;

        if (this.state.lastSymbol !== symbol) {
            this.template.update(this.render, { symbol });
            this.state.lastSymbol = symbol;
        }
    }
}
