import { Util } from "../../util.js";
import { AssetsService } from "./assets.service.js";
import { BasketComponent } from "../basket/basket.component.js";
import { StatsComponent } from "../stats/stats.component.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class AssetsController {
    constructor(render, template) {
        this.render = render;
        this.template = template;
        this.events = (e, payload) => Util.handleEvent(this, e, payload);
        this.state = {
            assets: AssetsService.getAssets(),
            weightsTD: [],
            weightsYOY: []
        };

        this.update();
    }

    update() {
        this.resetWeights();

        if (this.state.assets.length >= 3) {
            AssetsService.calcOptimalPortfolio().then(res => {
                this.state.weightsTD = res.optim.solution;
                this.template.update(this.render, this.state, this.events);
                AssetsService.saveAssets();
                ToastsComponent.update({ message: "Optimization TD done" });
            }).catch(err => ToastsComponent.update({ message: err.message || err }));

            AssetsService.calcOptimalPortfolioYearToDate().then(res => {
                this.state.weightsYOY = res.optim.solution;
                this.template.update(this.render, this.state, this.events);
                AssetsService.saveAssets();
                ToastsComponent.update({ message: "Optimization YOY done" });
            }).catch(err => ToastsComponent.update({ message: err.message || err }));
        }

        this.template.update(this.render, this.state, this.events);
        AssetsService.saveAssets();
    }

    onAssetClick(e, item) {
        const isRemoved = AssetsService.removeAsset(item);

        if (isRemoved) {
            BasketComponent.update();
            StatsComponent.update();
            this.update();
        }
    }

    resetWeights() {
        this.state.assets.forEach((asset, index) => {
            this.state.weightsTD[index] = 0;
            this.state.weightsYOY[index] = 0;
        });
    }
}
