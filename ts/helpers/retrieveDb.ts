const fs = require("fs");
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
