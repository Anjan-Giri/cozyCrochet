const sendAdminToken = (admin, statusCode, res) => {
  const token = admin.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("admin_token", token, options).json({
    success: true,
    admin,
    token,
  });
};

module.exports = sendAdminToken;
