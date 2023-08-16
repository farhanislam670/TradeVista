const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.get("/marketplace", getAllProducts);
router.route("/").get(protect, getProducts).post(protect, setProduct);
router.route("/:id").delete(protect, deleteProduct).put(protect, updateProduct);

module.exports = router;
