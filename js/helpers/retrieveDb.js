"use strict";
const fs = require("fs");
module.exports = (filepath) => {
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
};
