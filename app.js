const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const app = express();
const static = express.static(__dirname + '/public');
const flash = require('connect-flash');
const config = require("./routes");
const exphbs = require('express-handlebars');
const favicon=require("serve-favicon");
const handlebars = require('handlebars');
const expressValidator = require('express-validator');
const path=require("path");

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir:["views/partials"]
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

config.configPassport(passport);
app.use(flash());
app.use("/public", static);
app.use(require('morgan')('dev'));
app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({secret: 'keyboard cat'}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
config.configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});