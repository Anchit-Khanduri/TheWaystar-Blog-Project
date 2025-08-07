const { validateToken } = require("../controller/userAuth");

/*
  The token is store inside cookie 
  and if the user login and get same token = token store in cookie 
  then greate
*/

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}



module.exports = {
  checkForAuthenticationCookie,
};
