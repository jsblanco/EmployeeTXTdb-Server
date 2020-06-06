const express = require("express");
const router = express.Router();
const fs = require("fs");
const employeeDb = "./database/employees.txt"
import { Request, Response, NextFunction } from "express";
interface employeeI {
    [index: number]: {
        _id: number;
        firstName: string;
        lastName: string;
        address: string;
        accountNum: string;
        email: string;
        birthDate: string;
    }
}



router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = fileToString(employeeDb);
        res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  });


function fileToString (filepath: string): employeeI {
    const employees = fs.readFileSync(filepath);
    const userDb: employeeI= [];
    employees.toString().split("\n").forEach((user: string, index: number)=>{
        let userData = user.split(",");
        userDb[index] = {
            _id: parseInt(userData[0]),
            firstName: userData[1],
            lastName: userData[2],
            address: userData[3],
            accountNum: userData[4],
            email: userData[5],
            birthDate: userData[6]
        }
    });
    return userDb;
}



module.exports = router;