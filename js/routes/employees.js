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
router.post("/add-employee", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstName = req.body.firstName
            ? req.body.firstName.trim()
            : "";
        const lastName = req.body.lastName ? req.body.lastName.trim() : "";
        const address = req.body.address ? req.body.address.trim() : "";
        const phoneNumber = req.body.phoneNumber
            ? req.body.phoneNumber.trim()
            : "";
        const email = req.body.email ? req.body.email.trim() : "";
        const birthDate = req.body.birthDate
            ? req.body.birthDate.trim()
            : "";
        const missingFields = [];
        switch ("") {
            case firstName:
                missingFields.push("first name");
            case lastName:
                missingFields.push("last name");
            case address:
                missingFields.push("address");
            case phoneNumber:
                missingFields.push("phone number");
            case email:
                missingFields.push("email");
            case birthDate:
                missingFields.push("birthdate");
            default:
                break;
        }
        if (missingFields.length > 0) {
            let errorMessage = "Incomplete data: please include the following fields: ";
            missingFields.forEach((error, index) => {
                if (index == errorMessage.length - 1) {
                    errorMessage += error + ".";
                }
                else {
                    errorMessage += error + ", ";
                }
            });
            res.status(401).json(errorMessage);
        }
        const employees = fileToString(employeeDb);
        fs.appendFile(employeeDb, `${1 + employees[employees.length - 2].id},${firstName},${lastName},${address},${phoneNumber},${email},${birthDate}\n`, function (err) {
            if (err) {
                res.status(400).json("Error adding employee data to user Db.");
            }
        });
        res.status(200).json(employees);
    }
    catch (error) {
        next(error);
    }
}));
function fileToString(filepath) {
    const employees = fs.readFileSync(filepath);
    const userDb = [];
    employees
        .toString()
        .split("\n")
        .forEach((user, index) => {
        let userData = user.split(",");
        userDb[index] = {
            id: parseInt(userData[0]),
            firstName: userData[1],
            lastName: userData[2],
            address: userData[3],
            phoneNumber: userData[4],
            email: userData[5],
            birthDate: userData[6],
        };
    });
    return userDb;
}
module.exports = router;
