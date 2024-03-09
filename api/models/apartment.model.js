import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema(
    {
        apartmentNumber: {
            type: String,
            required: true,
            unique: true,
        },
        packageLocation: {
            type: String,
            default: '',
        }, 
        packageAmount: {
            type: String,
            default: '',
        },
    }, { timestamps: true }
);

const Apartment = mongoose.model('Apartment', apartmentSchema);

export default Apartment;    