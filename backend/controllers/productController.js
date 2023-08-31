const asyncHandler = require("express-async-handler");
const prisma = require("../prismaClient");

// @desc    Get all products
// @route   GET /api/marketplace
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
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

// @desc    Get user's own products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      user_id: req.user.user_id,
    },
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

// @desc    A user creates a product.
// @route   POST /api/products
// @access  Private
const setProduct = asyncHandler(async (req, res) => {
  try {
    const { categories, ...productData } = req.body;

    const createdProduct = await prisma.product.create({
      data: { ...productData, user_id: req.user.user_id },
    });

    // Retrieve category IDs based on provided category names and associate the product with categories
    const foundCategories = await prisma.category.findMany({
      where: {
        name: { in: categories },
      },
    });

    const createdCategories = [];
    for (const category of foundCategories) {
      await prisma.product_categories.create({
        data: {
          product_id: createdProduct.product_id,
          category_id: category.category_id,
        },
      });
      createdCategories.push(category);
    }

    // Extract names from createdCategories
    const createdCategoryNames = createdCategories.map(
      (category) => category.name
    );

    const finalCreatedProduct = {
      ...createdProduct,
      createdCategoryNames,
    };

    res.status(200).json(finalCreatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Please add a product!" });
  }
});

// @desc    A user update's their product.
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(req.params.id) },
    });
    if (!product) {
      res.status(400);
      throw new Error("Product not found");
    }

    const user = req.user.user_id;
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }
    if (product.user_id != user) {
      res.status(401);
      throw new Error("User not authorized.");
    }

    const { categories, ...productData } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { product_id: parseInt(req.params.id) },
      data: productData,
    });

    const foundCategories = await prisma.category.findMany({
      where: {
        name: { in: categories },
      },
    });

    // Delete existing associations between the product and its categories
    await prisma.product_categories.deleteMany({
      where: {
        product_id: updatedProduct.product_id,
      },
    });

    // Create new associations between the product and the updated categories
    for (const category of foundCategories) {
      await prisma.product_categories.create({
        data: {
          product_id: updatedProduct.product_id,
          category_id: category.category_id,
        },
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unfortunate." });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(req.params.id) },
    });

    if (!product) {
      res.status(400);
      throw new Error("Product not found");
    }

    const user = req.user.user_id;
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }
    if (product.user_id != user) {
      res.status(401);
      throw new Error("User not authorized.");
    }

    await prisma.product_categories.deleteMany({
      where: {
        product_id: parseInt(req.params.id),
      },
    });

    await prisma.product.delete({
      where: { product_id: parseInt(req.params.id) },
    });

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unfortunate." });
  }
});

module.exports = {
  getAllProducts,
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
};
