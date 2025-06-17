import { Product } from '../Models/product.modal.js';


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            type,
            capacity,
            price,
            features,
            description,
        } = req.body;

        // Media added by middleware
        const media = req.body.media || [];

        const images = media
            .filter(file => file.type === 'image')
            .map(file => file.url);

        const product = new Product({
            name,
            brand,
            type,
            capacity,
            price,
            features: Array.isArray(features) ? features : (features ? [features] : []),
            description,
            image: images[0] || '',
            inStock: true,
            isActive: true,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            product: product,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error while creating product',
        });
    }
};
