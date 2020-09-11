const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandle");

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category does not exist!",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    } else {
      res.json({ data });
    }
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
        // error: error,
      });
    }
    res.json(data);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({
      message: "Category deleted successfully!",
    });
  });
};
exports.getAllCategories = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json(categories);
  });
};
