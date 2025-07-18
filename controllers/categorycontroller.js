const Category = require('../models/category');

// GET all categories /api/categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
    };

// POST all categories /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};

// GET /api/categories/name/:name
exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Invalid request', error: err.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};


// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
};
