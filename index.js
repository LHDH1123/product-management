const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");
require("dotenv").config();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const { default: mongoose } = require("mongoose");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(cookieParser("HWIJFSH"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
