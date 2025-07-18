const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller');

// CRUD routes
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/low-stock', productController.getLowStockProducts);


module.exports = router;