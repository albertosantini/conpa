import { ToastsComponent } from "../toasts/toasts.component.js";
import { LatestComponent } from "../latest/latest.component.js";

const CONPA_ASSETS = "conpa.assets";

export class AssetsService {
    static getAssets() {
        return AssetsService.assets;
    }

    static addAsset(item) {
        const assets = AssetsService.assets;
        const isNew = assets
            .filter(asset => item.symbol === asset.symbol)
            .length === 0;

        if (isNew) {
            assets.push(item);
        }

        return isNew;
    }

    static removeAsset(item) {
        const assets = AssetsService.assets;
        let isRemoved = false;

        assets.forEach((asset, index) => {
            if (item.symbol === asset.symbol) {
                assets.splice(index, 1);
                isRemoved = true;
            }
        });

        return isRemoved;
    }

    static getLastAsset() {
        return AssetsService.assets.slice(-1)[0];
    }

    static saveAssets() {
        localStorage.setItem(CONPA_ASSETS, JSON.stringify(AssetsService.assets));
    }

    static calcOptimalPortfolioYearToDate() {
        const refDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365));

        return AssetsService.calcOptimalPortfolio({
            referenceDate: refDate.toString()
        });
    }

    static calcOptimalPortfolio({ referenceDate = new Date().toString() } = {}) {
        return workway("node://finance.js").then(async({ namespace: finance }) => {
            const lows = [];
            const highs = [];

            const prods = AssetsService.assets.map((asset, index) => {
                lows[index] = 0;
                highs[index] = -1;

                return asset.symbol;
            });

            const ptfParams = {
                prods,
                referenceDate,
                targetReturn: null,
                lows,
                highs
            };

            return finance.getOptimalPortfolio(ptfParams).then(res => {
                if (res.message) {
                    ToastsComponent.update({ message: res.message });
                } else {
                    ToastsComponent.update({ message: "Optimization done" });
                }

                finance.savePortfolio({
                    symbols: prods,
                    weights: res.optim.solution,
                    ref: referenceDate,
                    ret: res.optim.pm,
                    risk: res.optim.ps,
                    perf: res.perf,
                    highs,
                    lows
                }).then(() => {
                    LatestComponent.update();
                });

                return res;
            });
        });
    }
}

AssetsService.assets = JSON.parse(localStorage.getItem(CONPA_ASSETS)) || [];
