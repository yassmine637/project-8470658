import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, default: '' },
  pays: { type: String, default: '' },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
