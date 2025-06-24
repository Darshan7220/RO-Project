import { Company } from "../Models/company.model";

export const create = async (req, res) => {
    try {
        const { name, logo, description } = req.body;

        const existing = await Company.findOne({ name })
        if (existing) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const newCompany = new Company({ name, logo, description });
        await newCompany.save();

        res.status(201).json({ message: 'Company created successfully', company: newCompany });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};