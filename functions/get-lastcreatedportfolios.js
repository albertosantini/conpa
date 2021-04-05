"use strict";

const supabase = require("./_supabase");

exports.handler = async () => {
    console.log("Function `get-latestcreatedportfolios` invoked"); // eslint-disable-line

    const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

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
