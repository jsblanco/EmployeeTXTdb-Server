"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const fs = require("fs");
const employeeDb = "./database/employees.txt";
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = fileToString(employeeDb);
        res.status(200).json(employees);
    }
    catch (error) {
        next(error);
    }
}));
function fileToString(filepath) {
    const employees = fs.readFileSync(filepath);
    const userDb = [];
    employees.toString().split("\n").forEach((user, index) => {
        let userData = user.split(",");
        userDb[index] = {
            _id: parseInt(userData[0]),
            firstName: userData[1],
            lastName: userData[2],
            address: userData[3],
            accountNum: userData[4],
            email: userData[5],
            birthDate: userData[6]
        };
    });
    return userDb;
}
module.exports = router;
