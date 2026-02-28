import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  brand:       { type: String, required: true, trim: true },
  category:    { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image:       { type: String, required: true },
  website:     { type: String, required: true },
  concerns:    { type: [String], default: [] },
  skinTypes:   { type: [String], default: [] }
});

export default mongoose.model('Product', productSchema);