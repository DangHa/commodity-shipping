const driverTable = require('../models/driverTable');

module.exports = {

  async login(req, res) {
    const Phone = req.body.phone;
    const Password = req.body.password;

    result = await driverTable.findDriverByPhone(Phone)

    if (result.length !== 0){
      console.log(result)
      return result
    }else{
      return JSON.stringify("This phone doesn't have any account")
    }

    res.send(result);
  },

  async signup(req, res) {
    const Phone = req.body.phone;
    const Password = req.body.password;
    
    const result = await driverTable.signup(Phone, Password);
    res.send(result);
  },

  async getInfoDriver(req, res) {
    const Phone = req.body.phone;
    
    const result = await driverTable.getInfoUser(Phone);
    res.send(JSON.stringify(result));
  },
  
  async updateInforDriver(req, res) {
    const OldPhone = req.body.oldPhone;
    const Phone = req.body.phone;
    const Username = req.body.username;
    const Address = req.body.address;
    
    const result = await driverTable.updateInforUser(OldPhone, Phone, Username, Address);
    res.send(result);
  },
};
