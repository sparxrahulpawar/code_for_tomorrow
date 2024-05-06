import express from "express";
import {
  addCategory,
  addPriceOption,
  addService,
  deleteCategory,
  deletePriceOption,
  deleteService,
  getPriceOption,
  getService,
  updateCategory,
  updatePriceOption,
  updateService,
  viewCategory,
} from "../controller/category.js";

// Create an Express router
const router = express.Router();

// category Add Route
router.post("/", addCategory);

// All category GET Route
router.get("/categories", viewCategory);

// category Update Route
router.put("/:categoryId", updateCategory);

// category delete
router.delete("/:categoryId", deleteCategory);

//SERVICE===================================================

// SERVICE Add Route
router.post("/:categoryId/service", addService);

// All category GET Route
router.get("/:categoryId/services", getService);

// category Update Route
router.put("/:categoryId/service/:serviceId", updateService);

// category delete
router.delete("/:categoryId/service/:serviceId", deleteService);

//SERVICE PRICE OPTION===================================================

// PriceOption Add Route
router.post("/:serviceId/priceOption", addPriceOption);

// All PriceOption GET Route
router.get("/priceOption", getPriceOption);

// PriceOption Update Route
router.put("/:serviceId/:priceOptionId", updatePriceOption);

// PriceOption delete
router.delete("/:serviceId/:priceOptionId", deletePriceOption);

// Export the router
export default router;
