const express = require("express");
const router = express.Router();
const {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(setProduct);
router.route("/:id").delete(deleteProduct).put(updateProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
