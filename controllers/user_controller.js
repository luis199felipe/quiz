var users = {
  admin: {id:1,username:"admin",password:"1234"},
  pipe:  {id:2 ,username:"pipe",password:"5678"}
};


exports.autenticar = function (login,password,callback) {
  if (users[login]) {
    if (password === users[login].password) {
      callback(null,users[login]);
    }else {
      callback(new Error("password erroneo"));
    }
  }else {
    callback(new Error('No existe el usuario'));
  }
};
