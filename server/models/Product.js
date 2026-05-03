import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  volume: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'TND' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  details: [{ type: String }],
  badge: { type: String, default: '' },
  accentColor: { type: String, default: '#c9a84c' },
  imageScale: { type: Number, default: 1 },
  stock: { type: Number, default: 100 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
