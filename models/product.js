const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    },
    brand:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min: 0,
    },
    discount:{
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'At least one image is required.',
    }
    },
    variants: [{
        color: { type: String},
        ram: { type: String},
        storage: { type: String},
        stock: { type: Number, min: 1},
        price: { type: Number, },
        images: {
            type: [String],
            default: [],}
    }],
    metadata: {
        type: Object,
        default: {},
    },
}, {
  timestamps: true,
});
module.exports = mongoose.model('Product', productSchema);