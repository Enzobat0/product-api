const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorycontroller');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST new category
router.post('/', categoryController.createCategory);

// GET single category
router.get('/name/:name', categoryController.getCategoryByName);

// PUT update category
router.put('/:id', categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
