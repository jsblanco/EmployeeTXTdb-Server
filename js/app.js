"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const employeesRouter = require('./routes/employees');
const app = express();
app.use(cors({
    credentials: true,
    origin: ["*"],
}));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/', employeesRouter);
app.use((req, res, next) => {
    res.status(404).json({ code: "not found" });
});
app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err);
    if (!res.headersSent) {
        const statusError = err.status || 500;
        res.status(statusError).json(err);
    }
});
module.exports = app;
