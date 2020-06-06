const express = require("express");
const router = express.Router();
const fs = require("fs");
const employeeDb = "./database/employees.txt";
const retrieveDb = require("./../helpers/retrieveDb");
const originalDbData = require("./../helpers/originalDbData")
import { Request, Response, NextFunction } from "express";
interface employeeI extends Array<Object> {
  [index: number]: {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
  };
}

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = retrieveDb(employeeDb);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/add-employee",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const firstName = req.body.firstName ? req.body.firstName.trim() : "";
      const lastName = req.body.lastName ? req.body.lastName.trim() : "";
      const address = req.body.address ? req.body.address.trim() : "";
      const phoneNumber = req.body.phoneNumber
        ? req.body.phoneNumber.trim()
        : "";
      const email = req.body.email ? req.body.email.trim() : "";
      const birthDate = req.body.birthDate ? req.body.birthDate.trim() : "";
      const missingFields: string[] = [];

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
        let errorMessage: string =
          "Incomplete data: please include the following fields: ";
        missingFields.forEach((error, index) => {
          if (index == errorMessage.length - 1) {
            errorMessage += error + ".";
          } else {
            errorMessage += error + ", ";
          }
        });
        res.status(401).json(errorMessage);
      }

      const employees = retrieveDb(employeeDb);
      fs.appendFile(
        employeeDb,
        `${
          1 + employees[employees.length - 2].id
        },${firstName},${lastName},${address},${phoneNumber},${email},${birthDate}\n`,
        function (err: any) {
          if (err) {
            res.status(400).json("Error adding employee data to user Db.");
          }
        }
      );
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/reset", (req: Request, res: Response, next: NextFunction) => {
    try {
      fs.writeFile(employeeDb, originalDbData, 'utf-8', function(err) {
            if (err) throw err;
        })
      const employees = retrieveDb(employeeDb);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
