"use strict";

const supabase = require("./_supabase");

exports.handler = async event => {
    console.log("Function `get-otherportfolios` invoked"); // eslint-disable-line

    const metric = event.queryStringParameters.metric;
    const ascending = event.queryStringParameters.ascending;
    const startDate = event.queryStringParameters.startDate;

    const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .gte("created_at", startDate)
        .order(metric, { ascending: ascending === "true" })
        .limit(3);

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
