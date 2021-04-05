"use strict";

const supabase = require("./_supabase");

exports.handler = async () => {
    console.log("Function `get-portfoliocount` invoked"); // eslint-disable-line

    const { error, count } = await supabase
        .from("portfolios")
        .select("id", { count: "exact" });

    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(count)
    };
};
