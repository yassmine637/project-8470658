import mongoose from 'mongoose';

const configuratorOrderSchema = new mongoose.Schema({
  devisNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  country: { type: String, default: '' },
  currency: { type: String, default: 'TND' },
  configuration: {
    model: { id: String, name: String, basePrice: Number },
    size: { id: String, label: String, volume: String, priceAdd: Number },
    label: { id: String, name: String, priceAdd: Number },
    customText: { type: String, default: '' },
  },
  quantity: { type: Number, default: 1, min: 1 },
  totalHT: { type: Number, required: true },
  totalTTC: { type: Number, required: true },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'quoted', 'accepted', 'rejected'],
    default: 'new',
  },
}, { timestamps: true });

export default mongoose.model('ConfiguratorOrder', configuratorOrderSchema);
