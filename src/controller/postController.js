const postModel = require("../model/postModel");
const userModel = require("../model/userModel");

//API endpoint to create a post

const createPost = async (req, res) => {
  try {
    const data = req.body;
    const { createdBy, comments, message } = data;
    if (!createdBy) {
      return res.status(400).send({
        status: false,
        message: "Please enter createdBy",
      });
    }
    if (!comments) {
      return res.status(400).send({
        status: false,
        message: "Please enter comments",
      });
    }
    if (!message) {
      return res.status(400).send({
        status: false,
        message: "Please enter message",
      });
    }
    const post = await postModel.create(data);
    res.status(201).send({ status: true, msg: "ok", data: post });
    res.status(201).send({ status: true, msg: "ok", data: post });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("createdBy", "name email")
      .populate("comments.sentBy", "name email");
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { message } = req.body;
  try {
    const post = await postModel.findOne({
      _id: postId,
      createdBy: req.user.userId,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    let is_Deleted = post.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "user is already deleted" });

    //Updates a user by changing the its name, body, adding phone,
    let message = req.body.message;

    let updateduser = await userModel.findOneAndUpdate(
      { _id: user_Id },
      { $set: { message: message } },
      { new: true }
    );
    //Sending the updated response
    return res.status(200).send({ status: true, data: updateduser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postModel.findOne({
      _id: postId,
      createdBy: req.user.userId,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const deluser = await postModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "success", data: deluser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPost, getPost, updatePost, deletePost };
