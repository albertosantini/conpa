/*jslint node:true, sloppy:true, nomen:true */

var express = require('express'),
    conpa = require('conpa');

var app = express.createServer();

app.configure(function () {
    app.use(express.favicon(__dirname + '/favicon.ico'));
    app.use(express["static"].apply(null, [__dirname + '/public']));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.errorHandler());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "no more secrets",
        cookie: {
            maxAge: 60000
        }
    }));
});

app.listen(process.env.PORT || 8001);

conpa.configure(app, express, {
    crm: {
        liveDomain: "x.y.z",
        liveUrl: "http://user1:pass1" +
            "@a.b.c",
        liveDb: "conpa",
        testingUrl: "http://user2:pass2" +
            "@a.b.c",
        testingDb: "staging",
        design: "ConPA"
    }
});

