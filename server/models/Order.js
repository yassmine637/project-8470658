import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  volume: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestName: { type: String, default: '' },
  guestEmail: { type: String, default: '' },
  guestPhone: { type: String, default: '' },
  items: [orderItemSchema],
  totalHT: { type: Number, required: true },
  tva: { type: Number, required: true },
  totalTTC: { type: Number, required: true },
  currency: { type: String, default: 'TND' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'paypal', 'stripe', 'konnect'],
    default: 'cod',
  },
  stripeSessionId: { type: String, default: '' },
  stripePaymentIntentId: { type: String, default: '' },
  shippingAddress: {
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
