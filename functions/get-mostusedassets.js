"use strict";

const supabase = require("./_supabase");

exports.handler = async () => {
    console.log("Function `get-mostusedassets` invoked"); // eslint-disable-line

    const { data, error } = await supabase
        .rpc("getmostusedassets")
        .limit(10);

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
