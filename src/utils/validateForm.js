let usernameReg = /^\d{9}$/;
let passwordReg = /^[A-Za-z0-9]{6,12}$/;
let qqReg = /^[1-9][0-9]{4,14}$/
function validateLogin(username, password) {
  if (usernameReg.test(username) && passwordReg.test(password)) {
    return true;
  }
  return false;
}

function validateRegester(stunum, password, qq, name) {
  if (
    usernameReg.test(stunum) &&
    passwordReg.test(password) &&
    qqReg.test(qq) &&
    name.trim() !== ""
  ) {
    return true;
  }
  return false;
}

export { validateLogin, validateRegester };
