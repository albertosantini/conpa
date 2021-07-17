"use strict";

module.exports = {
    purge: [
        "./public/index.html",
        "./public/**/*.template.js"
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: {
                "body-texture": "url(/img/grid-18px-masked.png)"
            },
            minWidth: {
                30: "30%",
                70: "70%"
            }
        }
    },
    variants: {},
    plugins: []
};
