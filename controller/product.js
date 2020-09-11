const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandle");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((error, product) => {
    if (error || !product) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image cound not be uploaded",
      });
    }

    // Check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields must be required!",
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      //  console.log("FILE PHOTO: ", files.photo);
      if (files.photo.size >= 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((error, result) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json({ result });
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "Error while deleting product!",
      });
    }
    res.json({
      message: "Product deleted successfully",
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image cound not be uploaded",
      });
    }

    // Check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields must be required!",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      //  console.log("FILE PHOTO: ", files.photo);
      if (files.photo.size >= 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((error, result) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json({ result });
    });
  });
};

/**
 * Sell / Arrival
 * By sell = /products?sortBy=sold&order=derc&limit=4
 * By arrival = /products?sortBy=createAt&order=derc&limit=4
 * If no params are sent, then all products are returned
 */

exports.getAllProducts = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(products);
    });
};

/**
 * Get Related Products
 * It will find the products based on the required product category
 * Other Products that has the same category will be returned
 */

exports.getRelatedProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(products);
    });
};

/**
 * Get array list of categories have any Products
 */

exports.getProductsCategories = (req, res) => {
  Product.distinct("category", {}, (error, product) => {
    if (error) {
      return res.status(400).json({
        error: "Categories not found",
      });
    }
    res.json(product);
  });
};

/**
 * Products list by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.getListProductsBySearch = (req, res) => {
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

// Get Product photo by ProductId
exports.getProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
	res.set("Content-Type", req.product.photo.contentType);
	return res.send(req.product.photo.data);
  }
  next();
};
