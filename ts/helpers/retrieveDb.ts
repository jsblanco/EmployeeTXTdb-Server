const fs = require("fs");
const digestDbEntries= require("./digestDbEntries")
interface Employee extends Object {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
}
interface employeeArr extends Array<Object> {
[index: number]: Employee
}

module.exports = (filepath: string): employeeArr => {
    const employees = fs.readFileSync(filepath);
    return digestDbEntries(employees);
  }
