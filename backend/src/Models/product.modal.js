import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
<<<<<<< Updated upstream
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },    
    brand: {
        type: String,
=======
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
>>>>>>> Stashed changes
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

productSchema.pre('save', async function (next) {
    if (!this.isModified('name')) return next();

    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let suffix = 1;

    while (await mongoose.models.Product.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${suffix++}`;
    }

    this.slug = uniqueSlug;
    next();
});

export const Product = mongoose.model('Product', productSchema);
