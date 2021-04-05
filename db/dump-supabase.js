"use strict";

const fs = require("fs");

async function main() {
    console.log("Dump..."); // eslint-disable-line

    const { createClient } = require("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // DON'T FORGET TO CHANGE MAX ROWS IN SETTINGS API, default 1000.
    // The maximum number of rows returns from a view, table, or stored procedure.
    // Limits payload size for accidental or malicious requests.
    const { data, error } = await supabase
        .from("portfolios")
        .select("*");

    if (error) {
        console.log(error); // eslint-disable-line
        return;
    }

    console.log(`writing ${data.length} records...`); // eslint-disable-line
    fs.writeFileSync("dump-supabase.txt", JSON.stringify(data));

    console.log("done."); // eslint-disable-line
}

main();
