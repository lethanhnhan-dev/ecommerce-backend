const express = require("express");
const router = express.Router();

const { requestSignin, isAuth, isAdmin } = require("../controller/auth");
const { userById } = require("../controller/user");
const { createCategory, categoryById, getCategory, updateCategory, deleteCategory, getAllCategories } = require("../controller/category");


router.get('/category/:categoryId', getCategory);
router.post(
  "/category/create/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  createCategory
);

// Update category
router.put(
  "/category/:categoryId/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  updateCategory
);

// Delete category
router.delete(
  "/category/:categoryId/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  deleteCategory
);

// Get all categories
router.get('/categories', getAllCategories)

router.param('categoryId', categoryById);
router.param("userId", userById);

module.exports = router;
