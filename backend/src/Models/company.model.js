import mongoose from 'mongoose';
import slugify from 'slugify';
const { Schema } = mongoose;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    logo: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

companySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
        });
    }
    next();
});

export const Company = mongoose.model('Company', companySchema);
