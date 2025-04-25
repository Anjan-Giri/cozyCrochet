//token creation and save in cookies

const user = require("../model/user");

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  //cookies options

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None", // Allows cross-site cookies
    secure: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
