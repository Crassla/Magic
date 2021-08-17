// This is the code that authenticates the user by checking if the token is valid 

const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.params.token;
  // If there is no token it returns an error and renders the home page
  if (!token) return res.render('index', {
    errorMessage: 'Error: Invalid User!'
  });

  try {
    // If the token is valid the function is allowed to continue
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    // If the token is invalid or expired it returns an error and renders the home page
    res.render('index',{  errorMessage: "Error: User Invalid!" });
  }
};