const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('express-flash');
const config = require("./routes");
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const favicon=require("serve-favicon");
const session=require("express-session");
const handlebars = require('handlebars');
const path=require("path");
const app = express();
const static = express.static(__dirname + '/public');
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new handlebars.SafeString(JSON.stringify(obj));
        }
    }
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

app.use("/public", static);
app.set('view engine', 'handlebars');
app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(rewriteUnsupportedBrowserMethods);
app.use(flash());
app.engine('handlebars', handlebarsInstance.engine);


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session({}));

//Express Validator
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