const fs = require("fs");
const digestDbEntries= require("./digestDbEntries")
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

module.exports = (filepath: string): employeeI => {
    const employees = fs.readFileSync(filepath);
    return digestDbEntries(employees);
  }
