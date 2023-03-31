const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const postController = require("../controller/postController");
const { authenticaiton } = require("../middelwear/auth");

router.post("/createUsers", userController.signup);
router.post("/login", userController.loginUser);
router.get("/getUsers", authenticaiton, userController.getProfile);
router.put("/updateUsers", authenticaiton, userController.updateUser);
router.delete("/deleteUsers", authenticaiton, userController.deleteduser);

router.post("/createPosts", authenticaiton, postController.createPost);
router.get("/getPosts", authenticaiton, postController.getPost);
router.put("/updatePosts", authenticaiton, postController.updatePost);
router.delete("/deletePosts", authenticaiton, postController.deletePost);

module.exports = router;
