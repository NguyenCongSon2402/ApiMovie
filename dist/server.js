"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
const port = 3100;
const apiVersion = "1";
const apiRoutes = `/api/v${apiVersion}`;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));
// parse application/json
app.use(bodyParser.json({
    extended: true,
    limit: "50mb",
}));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Real Film!.");
});
app.use(apiRoutes, routes_1.UserRoutes);
app.use(apiRoutes, routes_1.CountryRoutes);
app.use(apiRoutes, routes_1.GenreRoutes);
app.use(apiRoutes, routes_1.MovieRoutes);
app.use(apiRoutes, routes_1.CommentRoutes);
app.use(apiRoutes, routes_1.FavoriteRoutes);
app.use(apiRoutes, routes_1.RatingRoutes);
app.listen(port, () => {
    console.log(`Server đang khởi chạy tại cổng ${port}`);
});
