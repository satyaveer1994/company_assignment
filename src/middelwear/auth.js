const jwt = require("jsonwebtoken");

const authenticaiton = async function (req, res, next) {
  try {
    // validating token --
    const token = req.header["x-auth-token"];
    if (!token)
      return res.status(401).send({
        stauts: false,
        message: "please login first ",
      });

    jwt.verify(
      token,
      "Secret-Key-given-by-us-to-secure-our-token",
      (error, token) => {
        if (error)
          return res
            .status(401)
            .send({ status: false, message: error.message });
        req.id = token.userId;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.authenticaiton = authenticaiton;
