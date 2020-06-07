const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const employeesRouter = require('./routes/employees');
import { Request, Response, NextFunction } from "express";
interface Error {status?: number}


const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:3000"],
  })
);

app.use(function (req: Request, res:Response, next:NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', employeesRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ code: "not found" });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR", req.method, req.path, err);
  if (!res.headersSent) {
    const statusError = err.status || 500;
    res.status(statusError).json(err);
  }
});

module.exports = app;