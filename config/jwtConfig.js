const jwt = require("jsonwebtoken");

const jwtConfig = (
  userId,
  fullName,
  email,
  password,
) => {
  const payload = {
    userId:userId,
    fullName: fullName,
    email: email,
    password: password,
  };
  const secretKey = "shhhhh";
  const options = {
    expiresIn: "10m",
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = jwtConfig;