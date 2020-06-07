const express = require("express");
const router = express.Router();
const fs = require("fs");
const employeeDb = "./database/employees.txt";
const retrieveDb = require("./../helpers/retrieveDb");
const originalDbData = require("./../helpers/originalDbData");
const digestDbEntries = require("./../helpers/digestDbEntries");
import { Request, Response, NextFunction } from "express";

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
      console.log(req.body)
      const firstName = req.body.data.firstName ? req.body.data.firstName.trim() : "";
      const lastName = req.body.data.lastName ? req.body.data.lastName.trim() : "";
      const address = req.body.data.address ? req.body.data.address.trim() : "";
      const phoneNumber = req.body.data.phoneNumber
        ? req.body.data.phoneNumber.trim()
        : "";
      const email = req.body.data.email ? req.body.data.email.trim() : "";
      const birthDate = req.body.data.birthDate ? `${req.body.data.birthDate.trim().substring(8,10)}/${req.body.data.birthDate.trim().substring(5,7)}/${req.body.data.birthDate.trim().substring(0,4)}` : "";
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
        return res.status(401).json(errorMessage);
      }

      const employees = retrieveDb(employeeDb);
      fs.appendFile(
        employeeDb,
        `${
          1 + employees[employees.length - 1].id
        },${firstName},${lastName},${address},${phoneNumber},${email},${birthDate}\n`,
        function (err: any) {
          if (err) {
           return res.status(400).json("Error adding employee data to user Db.");
          }
        }
      );
      res.status(200).json([...employees, {
        id: 1 + employees[employees.length - 1].id,
        firstName,
        lastName,
        address,
        phoneNumber,
        email,
        birthDate,
      }]);
    } catch (error) {
      next(error);
    }
  }
);

router.put("/reset", (req: Request, res: Response, next: NextFunction) => {
  try {
    fs.writeFile(employeeDb, originalDbData, "utf-8", function (err: Error) {
      if (err) throw err;
    });
    const employees = digestDbEntries(originalDbData);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete-employee/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = +req.params.userId;
      const employees = retrieveDb(employeeDb);
      const deletedEmployeeIndex = employees.findIndex(
        (employee: Employee) => employee.id == userId
      );
      if (deletedEmployeeIndex == -1) {
        res
          .status(401)
          .json(`There is no employee with ID ${userId} on the database`);
      }
      employees.splice(deletedEmployeeIndex, 1);
      let databaseWithoutDeletedEmployee: string = "";
      employees.forEach((employee: Employee) => {
        let userData = `${employee.id},${employee.firstName},${employee.lastName},${employee.address},${employee.phoneNumber},${employee.email},${employee.birthDate}\n`;
        databaseWithoutDeletedEmployee += userData;
      });
      fs.writeFile(
        employeeDb,
        databaseWithoutDeletedEmployee,
        "utf-8",
        function (err: Error) {
          if (err) throw err;
        }
      );
      res
        .status(200)
        .json(employees);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
