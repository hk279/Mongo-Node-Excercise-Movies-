const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("./modules/mongo.js");
var session = require("client-sessions");
const app = express();
const dotenv = require("dotenv");

const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(
    session({
        cookieName: "mySession",
        secret: "h2r8idkj38ofm438",
        duration: 30 * 60 * 100,
        activeDuration: 5 * 60 * 1000,
    })
);

app.get("/", (req, res) => {
    if (req.mySession.id) {
        console.log(req.mySession.id);
        res.render("pages/index", { user: req.mySession.username });
    } else {
        console.log(req.mySession.id);
        res.redirect("/login");
    }
});
app.post("/", async (req, res) => {
    var keyword = req.body.search;
    /* console.log("Keyword " + keyword + " received by the server."); */
    var table = await mongo.getMovies(keyword);
    res.render("pages/movies", { resultsTable: table });
});
app.get("/login", (req, res) => {
    res.render("pages/login", { alert: "" });
});
app.post("/login", async (req, res) => {
    var user = req.body.username;
    var pw = req.body.password;

    var login = await mongo.getUser(user, pw).then((result) => {
        return result;
    });

    if (login == null) {
        res.render("pages/login", {
            alert: "Incorrect username or password",
        });
    } else {
        req.mySession.id = login._id;
        console.log(req.mySession.id);
        req.mySession.username = login.username;
        console.log(req.mySession.username);
        res.redirect("/");
    }
});
app.get("/register", (req, res) => {
    res.render("pages/register");
});
app.post("/register", (req, res) => {
    var user = req.body.user;
    var pw = req.body.pw;

    mongo.saveUser(user, pw);
    res.render("pages/login", { alert: "Registration successful!" });
});
app.get("/logout", (req, res) => {
    req.mySession.reset();
    res.redirect("/");
});
app.get("*", function (req, res) {
    res.status(404).send("Can't find the requested page");
});
app.listen(PORT, function () {
    console.log("App listening on port 5000");
});
