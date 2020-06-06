const express = require("express");
const router = express.Router();
const fs = require("fs");
const employeeDb = "./database/employees.txt";
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

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = fileToString(employeeDb);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/add-employee",
  async (req: Request, res: Response, next: NextFunction) => {
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


      const employees = fileToString(employeeDb);
      fs.appendFile(
        employeeDb, `${employees.length},${firstName},${lastName},${address},${phoneNumber},${email},${birthDate}\n`,
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

function fileToString(filepath: string): employeeI {
  const employees = fs.readFileSync(filepath);
  const userDb: employeeI = [];
  employees
    .toString()
    .split("\n")
    .forEach((user: string, index: number) => {
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
