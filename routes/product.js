const express = require("express");
const router = express.Router();

const { requestSignin, isAuth, isAdmin } = require("../controller/auth");
const { userById } = require("../controller/user");
const {
  createProduct,
  productById,
  getProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getRelatedProducts,
  getProductsCategories,
  getListProductsBySearch,
  getProductPhoto
} = require("../controller/product");

router.get("/product/:productId", getProduct);
router.post(
  "/product/create/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  createProduct
);
router.delete(
  "/product/:productId/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  deleteProduct
);

// Update Product by productId
router.put(
  "/product/:productId/:userId",
  requestSignin,
  isAuth,
  isAdmin,
  updateProduct
);

// Get all Product
router.get("/products", getAllProducts);

// Get Related Products
router.get("/products/related/:productId", getRelatedProducts);

// Get a list of Categories have any Products (return array)
router.get("/products/categories", getProductsCategories);

// Get Products list by Search
router.post("/products/by/search", getListProductsBySearch);

// Get Product photo by ProductId
router.get("/product/photo/:productId", getProductPhoto)

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
