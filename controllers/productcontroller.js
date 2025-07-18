const Product = require('../models/product');

// GET all products /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      discounted
    } = req.query;

    const query = {};

    // Text search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by category name
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        query.category = cat._id;
      } else {
        return res.status(404).json({ message: `Category '${category}' not found` });
      }
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.discountedPrice.$lte = parseFloat(maxPrice);
    }

    // Show only discounted products
    if (discounted === 'true') {
      query.$expr = { $lt: ["$discountedPrice", "$price"] };
    }

    const products = await Product.find(query).populate('category');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// POST new product /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      discountPercent,
      discountedPrice,
      discountStartDate,
      discountEndDate,
      categoryName,
      images,
      variants,
      metadata
    } = req.body;

    // Look up category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: `Category '${categoryName}' not found.` });
    }

    const product = new Product({
      name,
      description,
      brand,
      price,
      discountPercent,
      discountedPrice,
      discountStartDate,
      discountEndDate,
      category: category._id,
      images,
      variants,
      metadata
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
};

// PUT update product
// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { categoryName, variants, ...rest } = req.body;
    const updateFields = { ...rest };

    // Handle categoryName if provided
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(400).json({ message: `Category '${categoryName}' not found.` });
      }
      updateFields.category = category._id;
    }

    // If variants are included, recalculate total stock
    if (variants) {
      updateFields.variants = variants;
      updateFields.stock = variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
};


// GET low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const lowStockProducts = await Product.find({ stock: { $lt: threshold } });

    res.status(200).json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};