const mongoose = require('mongoose');
const Category = require('./category');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
 discountPercent: {
  type: Number,
  default: 0,
  min: 0,
  max: 100,
},

discountedPrice: {type: Number, default: 0,},

discountStartDate: {type: Date,},

discountEndDate: {type: Date,},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0 // now computed
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'At least one image is required.',
    }
  },
  variants: [
    {
      color: { type: String },
      ram: { type: String },
      storage: { type: String },
      stock: { type: Number, required: true, min: 0 },
      price: { type: Number, min: 0 },
      images: {
        type: [String],
        default: []
      }
    }
  ],
  metadata: {
    type: Object,
    default: {},
  }
}, {
  timestamps: true,
});

// Auto-calculate total stock from variant stock
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
  } else {
    this.stock = 0;
  }
  next();
});

// Auto-calculate discountedPrice before saving
productSchema.pre('save', function (next) {
  const now = new Date();

  // Check if discount is active
  const isDiscountActive = (!this.discountStartDate || this.discountStartDate <= now) &&
                           (!this.discountEndDate || this.discountEndDate >= now);

  if (this.discountPercent > 0 && isDiscountActive) {
    this.discountedPrice = parseFloat(
      (this.price - (this.price * (this.discountPercent / 100))).toFixed(2)
    );
  } else {
    this.discountedPrice = this.price;
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);
