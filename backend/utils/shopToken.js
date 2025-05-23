//token creation and save in cookies

const user = require("../model/user");

const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  //cookies options

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;
