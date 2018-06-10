import { Util } from "../../util.js";
import { StatsComponent } from "../stats/stats.component.js";
import { AssetsComponent } from "../assets/assets.component.js";
import { AssetsService } from "../assets/assets.service.js";

window.YAHOO = { Finance: { SymbolSuggest: {} } };

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

        window.YAHOO.Finance.SymbolSuggest.ssCallback = data => {
            this.state.assetsSearch = data.ResultSet.Result;

            this.update();
            this.state.assetsSearch.length = 0;
        };

        const callbackName = "YAHOO.Finance.SymbolSuggest.ssCallback";
        const urlLang = "region=US&lang=en-US";
        const urlParams = `${urlLang}&query=${query}&callback=${callbackName}`;
        const url = `https://autoc.finance.yahoo.com/autoc?${urlParams}`;

        Util.jsonp(url);
    }

    onAssetSearchClick(e) {
        const item = JSON.parse(e.target.dataset.value);
        const isNew = AssetsService.addAsset(item);

        if (isNew) {
            this.update();
            StatsComponent.update();
            AssetsComponent.update();
        }
    }
}
