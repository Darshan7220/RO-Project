import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const { Schema } = mongoose;
// Define the user schema
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            trim: true,
        },
        lastname: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },        
        phonenumber: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: null, // URL to the avatar image
        },
        birthdate: {
            type: Date,
            default: null,
        },
        bio: {
            type: String,
            default: null,
        },
        link: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['super_admin', 'admin', 'user', 'supervisor'],
            default: 'user',
        },
        city: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        liveChatOptions: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        timezone: {
            type: String,
            default: 'UTC'
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

userSchema.index({ username: 1, email: 1, isVerified: 1, role: 1, updatedAt: 1, isActive: 1, isDeleted: 1 });

// Hash password before saving (example middleware)
userSchema.pre('save', async function (next) {
    // Hash password
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
4
    // Generate slug from username or firstname+lastname
    if (!this.slug || this.isModified('username') || this.isModified('firstname') || this.isModified('lastname')) {
        const baseSlug = slugify(this.username || `${this.firstname} ${this.lastname}`, {
            lower: true,
            strict: true,
        });

        let uniqueSlug = baseSlug;
        let suffix = 1;

        // Ensure slug uniqueness
        while (await mongoose.models.User.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${suffix++}`;
        }

        this.slug = uniqueSlug;
    }

    next();
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};


export const User = mongoose.model('User', userSchema);