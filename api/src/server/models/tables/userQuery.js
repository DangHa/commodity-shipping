const userTable = require('./userTable')

module.exports = {

  async getAllUsers() {
    var result = await userTable.getAllUsers();
    return result
  },

  async login(Phone, Password) {

    checkingPhone = await userTable.findUserByPhone(Phone)

    if (checkingPhone === false){
      return JSON.stringify("This phone doesn't have any account")
    }else{
      var result = await userTable.findUserByPhoneAndPassword(Phone, Password);
      return result
    }
  },

  async signup(Phone, Password) {

    checkingPhone = await userTable.findUserByPhone(Phone)

    if (checkingPhone === false) {
      await userTable.insertUser(Phone, Password)
      return JSON.stringify(true)
    }else{
      return JSON.stringify(false)
    }

  }

};
