module.exports = (employeeData: string): employeeI => {
    const userDb: employeeI = [];
    employeeData
      .toString()
      .split("\n")
      .forEach((user: string, index: number) => {
        if (user.length>0){
        let userData = user.split(",");
        userDb[index] = {
          id: parseInt(userData[0]),
          firstName: userData[1],
          lastName: userData[2],
          address: userData[3],
          phoneNumber: userData[4],
          email: userData[5],
          birthDate: userData[6],}
        };
      });
    return userDb;
  }
