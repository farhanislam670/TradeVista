const asyncHandler = require("express-async-handler");
const prisma = require("../prisma");

// @desc    Get Products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      product_categories: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const productData = products.map((product) => {
    const categories = product.product_categories.map((pc) => pc.category.name);
    return { ...product, product_categories: categories };
  });

  res.status(200).json(productData);
});

// @desc    Create Product
// @route   POST /api/products
// @access  Private
const setProduct = asyncHandler(async (req, res) => {
  try {
    const product = await prisma.product.create({ data: { ...req.body } });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Please add a product!" });
  }
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
      price: true,
      rent_price: true,
      rent_duration_unit: true,
      user_id: true,
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
