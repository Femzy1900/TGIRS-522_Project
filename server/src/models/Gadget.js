import mongoose from 'mongoose';

const gadgetSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    operatingSystem: { type: String },
    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
    screenSize: { type: String },
    displayType: { type: String },
    battery: { type: String },
    price: { type: Number, required: true },
    releaseYear: { type: Number },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
    rating: { type: Number },
    availability: { type: String, enum: ['In Stock', 'Out of Stock', 'Pre-order'], default: 'In Stock' },
  },
  { timestamps: true }
);

// Create a text index for searching
gadgetSchema.index({
  productName: 'text',
  brand: 'text',
  category: 'text',
  keywords: 'text',
  description: 'text'
}, {
  weights: {
    productName: 10,
    keywords: 5,
    brand: 3,
    category: 3,
    description: 1
  },
  name: "GadgetTextIndex"
});

const Gadget = mongoose.model('Gadget', gadgetSchema);

export default Gadget;
