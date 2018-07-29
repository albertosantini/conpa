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

    static calcOptimalPortfolioYOY() {
        const refDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365));

        return AssetsService.calcOptimalPortfolio({
            referenceDate: refDate.toString()
        });
    }

    static calcOptimalPortfolio({ referenceDate = new Date().toString() } = {}) {
        const assets = AssetsService.assets;
        const assetsLength = assets.length;
        const lows = Array(assetsLength).fill(0);
        const highs = Array(assetsLength).fill(-1);
        const prods = assets.map(asset => asset.symbol);
        const ptfParams = {
            prods,
            referenceDate,
            targetReturn: null,
            lows,
            highs
        };

        return workway("node://finance.js").then(async({ namespace: finance }) =>
            finance.getOptimalPortfolio(ptfParams).then(res => {
                if (res.message) {
                    throw new Error(res.message);
                }

                if (assets.length !== res.optim.solution.length) {
                    throw new Error("Basket changed during optimization");
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
            }).catch(err => {
                throw new Error(err);
            }));
    }
}

AssetsService.assets = JSON.parse(localStorage.getItem(CONPA_ASSETS)) || [];
