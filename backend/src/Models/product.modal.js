import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
