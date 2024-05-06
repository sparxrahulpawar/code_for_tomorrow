import connection from "../index.js";

// Add category
export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(401).json({ error: "Name field is required.." });
    }

    const checkQuery = "SELECT * FROM category WHERE categoryName = ?";
    const [existingCategory] = await connection.query(checkQuery, [
      categoryName,
    ]);

    if (existingCategory.length > 0) {
      return res.status(400).json({ error: "Category already exist" });
    }

    const insertQuery = "INSERT INTO category (categoryName) VALUES (?)";
    const values = [categoryName];

    const [results] = await connection.query(insertQuery, values);

    const newCategory = { id: results.insertId, categoryName };
    res
      .status(201)
      .json({ message: "Category created successfully", newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Get category
export const viewCategory = async (req, res) => {
  try {
    const query = "SELECT * FROM category";
    const [results] = await connection.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).json({ error: "Failed to retrieve category" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    const checkQuery = "SELECT * FROM category WHERE id = ?";
    const [checkResults] = await connection.query(checkQuery, [categoryId]);

    if (checkResults.length === 0) {
      return res.status(404).json({ error: "category not found" });
    }

    const updateQuery = "UPDATE category SET categoryName = ? WHERE id = ?";
    await connection.query(updateQuery, [categoryName, categoryId]);

    res.status(200).json({ message: "category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const checkQuery = "SELECT * FROM category WHERE id = ?";
    const [checkResults] = await connection.query(checkQuery, [categoryId]);

    if (checkResults.length === 0) {
      return res.status(404).json({ error: "category not found" });
    }

    const deleteQuery = "DELETE FROM category WHERE id = ?";
    await connection.query(deleteQuery, [categoryId]);

    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// SERVICE ================================================================================================

export const addService = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { serviceName, type, priceOption } = req.body;

    if (!serviceName || !type || !priceOption) {
      return res.status(401).json({ error: "All fields are required." });
    }

    // Check if the categoryId exists in the database
    const categoryCheckQuery = "SELECT * FROM category WHERE id = ?";
    const [categoryData] = await connection.query(categoryCheckQuery, [
      categoryId,
    ]);

    if (categoryData.length === 0) {
      return res.status(400).json({ error: "Category does not exist." });
    }

    // Check if the service name already exists
    const serviceCheckQuery =
      "SELECT * FROM service WHERE serviceName = ? AND categoryId = ?";
    const [existingServiceData] = await connection.query(serviceCheckQuery, [
      serviceName,
      categoryId,
    ]);

    if (existingServiceData.length > 0) {
      return res
        .status(400)
        .json({ error: "Service name already exists for this category." });
    }

    const insertQuery =
      "INSERT INTO service (serviceName, type, priceOption, categoryId) VALUES (?, ?, ?, ?)";
    const values = [serviceName, type, priceOption, categoryId];
    await connection.query(insertQuery, values);

    res.status(201).json({ message: "Service created successfully." });
  } catch (error) {
    console.log("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getService = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = "SELECT * FROM service WHERE categoryId = ?";
    const [service] = await connection.query(query, [categoryId]);

    if (service.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service[0]);
  } catch (error) {
    console.log("internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId, categoryId } = req.params;
    const { serviceName, type, priceOption } = req.body;

    const updateQuery =
      "UPDATE service SET serviceName=?, type=?, priceOption=? WHERE id=? AND categoryId = ?";
    const values = [serviceName, type, priceOption, serviceId, categoryId];
    await connection.query(updateQuery, values);

    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.log("internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId, categoryId } = req.params;

    const deleteQuery = "DELETE FROM service WHERE id=? AND categoryId=?";
    await connection.query(deleteQuery, [serviceId, categoryId]);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.log("internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// addPriceOption===========================================================================================

export const addPriceOption = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { duration, price, type } = req.body;

    // Validate request body
    if (!duration || !price || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Insert the price option into the database
    const insertQuery =
      "INSERT INTO price_option (serviceId, duration, price, type) VALUES (?, ?, ?, ?)";
    const values = [serviceId, duration, price, type];
    await connection.query(insertQuery, values);

    res.status(201).json({ message: "Price option added successfully." });
  } catch (error) {
    console.log("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getPriceOption = async (req, res) => {
  try {
    const query = "SELECT * FROM price_option";
    const [results] = await connection.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving price option:", error);
    res.status(500).json({ error: "Failed to retrieve price\ option" });
  }
};

export const updatePriceOption = async (req, res) => {
  try {
    const { serviceId, priceOptionId } = req.params;
    const { duration, price, type } = req.body;

    // Validate request body
    if (!duration || !price || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Update the price option in the database
    const updateQuery =
      "UPDATE price_option SET duration=?, price=?, type=? WHERE serviceId=? AND id=?";
    const values = [duration, price, type, serviceId, priceOptionId];
    await connection.query(updateQuery, values);

    res.status(200).json({ message: "Price option updated successfully." });
  } catch (error) {
    console.log("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deletePriceOption = async (req, res) => {
  try {
    const { serviceId, priceOptionId } = req.params;

    // Delete the price option from the database
    const deleteQuery = "DELETE FROM price_option WHERE serviceId=? AND priceOptionId=?";
    await connection.query(deleteQuery, [serviceId, priceOptionId]);

    res.status(200).json({ message: "Price option deleted successfully." });
  } catch (error) {
    console.log("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
