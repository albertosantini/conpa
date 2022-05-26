"use strict";

module.exports = {
    content: [
        "./public/index.html",
        "./public/**/*.template.js"
    ],
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
