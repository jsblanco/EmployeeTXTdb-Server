"use strict";
const fs = require("fs");
const digestDbEntries = require("./digestDbEntries");
module.exports = (filepath) => {
    const employees = fs.readFileSync(filepath);
    return digestDbEntries(employees);
};
