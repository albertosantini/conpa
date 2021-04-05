"use strict";

const supabase = require("./_supabase");

exports.handler = async event => {
    console.log("Function `post-saveportfolio` invoked"); // eslint-disable-line

    const ptfParams = JSON.parse(event.body);

    const symbols = ptfParams.symbols;
    const weights = ptfParams.weights;
    const ref = ptfParams.ref;
    const refDate = new Date(ref);
    const ret = ptfParams.ret;
    const retFloat = parseFloat(ret);
    const risk = ptfParams.risk;
    const riskFloat = parseFloat(risk);
    const perf = ptfParams.perf;
    const highs = ptfParams.highs;
    const lows = ptfParams.lows;

    const now = new Date();
    const ddNow = now.getDate().toString().padStart(2, "0");
    const mmNow = (now.getMonth() + 1).toString().padStart(2, "0");
    const yyyyNow = now.getFullYear();
    const HHNow = now.getHours().toString().padStart(2, "0");
    const MMNow = now.getMinutes().toString().padStart(2, "0");
    const SSNow = now.getSeconds().toString().padStart(2, "0");
    const ddRef = refDate.getDate().toString().padStart(2, "0");
    const mmRef = (refDate.getMonth() + 1).toString().padStart(2, "0");
    const yyyyRef = refDate.getFullYear().toString().padStart(2, "0");

    const ptf = {
        created_at: `${yyyyNow}/${mmNow}/${ddNow} ${HHNow}:${MMNow}:${SSNow}`, // eslint-disable-line
        assets: symbols,
        weights,
        ref: `${yyyyRef}/${mmRef}/${ddRef}`,
        ret: Math.pow(1 + retFloat, 52) - 1, // annualized: ret weekly
        risk: riskFloat * Math.sqrt(52), // annualized: risk weekly
        perf: perf.length > 0 ? perf[perf.length - 1] : 0,
        lows,
        highs
    };

    const { data, error } = await supabase
        .from("portfolios")
        .insert([ptf]);

    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
