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
const retrieveDb = require("./../helpers/retrieveDb");
const originalDbData = require("./../helpers/originalDbData");
const digestDbEntries = require("./../helpers/digestDbEntries");
router.get("/", (req, res, next) => {
    try {
        const employees = retrieveDb(employeeDb);
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json(employees);
    }
    catch (error) {
        next(error);
    }
});
router.post("/add-employee", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstName = req.body.firstName ? req.body.firstName.trim() : "";
        const lastName = req.body.lastName ? req.body.lastName.trim() : "";
        const address = req.body.address ? req.body.address.trim() : "";
        const phoneNumber = req.body.phoneNumber
            ? req.body.phoneNumber.trim()
            : "";
        const email = req.body.email ? req.body.email.trim() : "";
        const birthDate = req.body.birthDate ? req.body.birthDate.trim() : "";
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
        const employees = retrieveDb(employeeDb);
        fs.appendFile(employeeDb, `${1 + employees[employees.length - 1].id},${firstName},${lastName},${address},${phoneNumber},${email},${birthDate}\n`, function (err) {
            if (err) {
                res.status(400).json("Error adding employee data to user Db.");
            }
        });
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json([...employees, {
                id: 1 + employees[employees.length - 1].id,
                firstName,
                lastName,
                address,
                phoneNumber,
                email,
                birthDate,
            }]);
    }
    catch (error) {
        next(error);
    }
}));
router.put("/reset", (req, res, next) => {
    try {
        fs.writeFile(employeeDb, originalDbData, "utf-8", function (err) {
            if (err)
                throw err;
        });
        const employees = digestDbEntries(originalDbData);
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json(employees);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/delete-employee/:userId", (req, res, next) => {
    try {
        const userId = +req.params.userId;
        const employees = retrieveDb(employeeDb);
        const deletedEmployeeIndex = employees.findIndex((employee) => employee.id == userId);
        if (deletedEmployeeIndex == -1) {
            res
                .status(401)
                .json(`There is no employee with ID ${userId} on the database`);
        }
        employees.splice(deletedEmployeeIndex, 1);
        let databaseWithoutDeletedEmployee = "";
        employees.forEach((employee) => {
            let userData = `${employee.id},${employee.firstName},${employee.lastName},${employee.address},${employee.phoneNumber},${employee.email},${employee.birthDate}\n`;
            databaseWithoutDeletedEmployee += userData;
        });
        fs.writeFile(employeeDb, databaseWithoutDeletedEmployee, "utf-8", function (err) {
            if (err)
                throw err;
        });
        res.set("Access-Control-Allow-Origin", "*");
        res
            .status(200)
            .json(employees);
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
