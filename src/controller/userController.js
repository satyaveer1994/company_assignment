const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Please enter Data like tile,fullname etc",
      });
    }
    const { name, email, password, phone } = data;

    if (!name) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter name" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter email" });
    }

    // checking unique
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .send({ status: false, message: "email already in use" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter password" });
    }
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter phone" });
    }

    const hash = bcrypt.hashSync(password, 6);
    data.password = hash;

    let createUser = await userModel.create(data);

    return res
      .status(201)
      .send({ status: true, message: "successful", data: createUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    Data = req.body;

    if (Object.keys(Data) == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide email id or password",
      });
    }
    const { email, password } = Data;
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }

    if (!password) {
      res.status(400).send({ status: false, message: `password is required` });
      return;
    }

    const user = await userModel.findOne({ email: email });
    if (user) {
      return res
        .status(401)
        .send({ status: false, message: " this email is alrady exist" });
    }
    const decrpted = bcrypt.compareSync(password, user.password);
    if (decrpted == true) {
      const token = jwt.sign(
        {
          UserId: user._id,
        },
        "Secret-Key-given-by-us-to-secure-our-token"
      );

      res.header("x-auth-header", token); //.send(_.pick(user, ['_id', 'name', 'email']))

      return res
        .status(200)
        .send({ status: true, message: "login Successful", token: token });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getProfile = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userIdFromToken = req.userId;
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "userid required" });
    }

    //   if (!isValidObjectId(userId)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "UserId not a valid ObjectId" });
    //   }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .send({ status: false, message: "User not present in the collection" });
    }

    if (userId != userIdFromToken) {
      return res
        .status(403)
        .send({ status: false, message: "User is not Authorized" });
    }

    let getUserDetails = await userModel.find({ _id: userId });
    return res.status(200).send({
      status: true,
      message: "User profile details",
      data: getUserDetails,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateUser = async function (req, res) {
  try {
    let user_Id = req.params.userId;
    //Validate: The userId is present in request path params or not.

    if (!user_Id)
      return res
        .status(400)
        .send({ status: false, msg: "user Id is required" });

    //Validate: The userId is valid or not.
    let user = await userModel.findById(user_Id);
    if (!user)
      return res
        .status(404)
        .send({ status: false, msg: "user does not exists" });

    //Validate: If the userId exists (must have isDeleted false)
    let is_Deleted = user.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "user is already deleted" });

    //Updates a user by changing the its name, body, adding phone,
    let name = req.body.name;
    let phone = req.body.phone;
    let updateduser = await userModel.findOneAndUpdate(
      { _id: user_Id },
      { $set: { name: name, phone: phone } },
      { new: true }
    );
    //Sending the updated response
    return res.status(200).send({ status: true, data: updateduser });
  } catch (err) {
    console.log("This is the error :", err.message);
    return res
      .status(500)
      .send({ status: false, msg: " Server Error", error: err.message });
  }
};

/////////////////////////////////////////////////
const deleteduser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }
    if (user.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "user is already deleted" });
    }
    const deluser = await userModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "success", data: deluser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = { signup, loginUser, getProfile, updateUser, deleteduser };
