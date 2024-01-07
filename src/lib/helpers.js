const bcrypt = require('bcryptjs');


const helpers = {};
//sifrar la contraseña en la base datos
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
//compara la contraseña
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

helpers.gt = function(a, b, options) {
  if (arguments.length === 2) {
    options = b;
    b = options.hash.compare;
  }

  //fn block exists: it is not a subexpression
  if( options.fn ) {
     if (a > b) {
       return options.fn(this);
     }
     return options.inverse(this);
  } else { // otherwise return the result of the comparison
     return a > b;
  }
};

module.exports = helpers;