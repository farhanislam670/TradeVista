const asyncHandler = require("express-async-handler");

// @desc    Get Products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get products" });
});

// @desc    Create Product
// @route   POST /api/products
// @access  Private
const setProduct = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a product!");
  }

  res.status(200).json({ message: "Create product" });
});

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update product ${req.params.id}` });
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete product ${req.params.id}` });
});

module.exports = {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
};
