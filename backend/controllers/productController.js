const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

// @desc    Get Products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
});

// @desc    Create Product
// @route   POST /api/products
// @access  Private
const setProduct = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a product!");
  }

  const product = await prisma.product.create({ data: { ...req.body } });
  res.status(200).json(product);
});

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { product_id: parseInt(req.params.id) },
  });

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: { product_id: parseInt(req.params.id) },
    data: req.body,
    select: {
      product_id: true,
      title: true,
      description: true,
      product_categories: true, //Look into this after determining whether you need this field or not.
      price: true,
      rent_price: true,
      rent_duration_unit: true,
      user_id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(updatedProduct);
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { product_id: parseInt(req.params.id) },
  });

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: { product_id: parseInt(req.params.id) },
  });
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
};
