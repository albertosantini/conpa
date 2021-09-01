import { Util } from "../../util.js";
import { StatsComponent } from "../stats/stats.component.js";
import { AssetsComponent } from "../assets/assets.component.js";
import { AssetsService } from "../assets/assets.service.js";

export class BasketController {
    constructor(render, template) {
        this.render = render;
        this.template = template;
        this.events = (e, payload) => Util.handleEvent(this, e, payload);
        this.state = {
            assetsSearch: []
        };

        this.update();
    }

    update() {
        this.template.update(this.render, this.state, this.events);
    }

    onAssetsSearchInput(e) {
        const query = e.target.value;
        const urlLang = "lang=en-US&region=US";
        const urlParams = `q=${query}&${urlLang}`;

        fetch(`/.netlify/functions/get-yahoo?${urlParams}`).then(res => res.json()).then(data => {
            this.state.assetsSearch = data.quotes;

            this.update();
        });
    }

    onAssetSearchClick(e, item) {
        const isNew = AssetsService.addAsset(item);

        if (isNew) {
            this.state.assetsSearch.length = 0;
            this.update();
            StatsComponent.update();
            AssetsComponent.update();
        }
    }
}
