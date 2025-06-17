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
        packageHistory: [
            {
                deliveredBy: { type: String, required: true }, // worker name or ID
                deliveredAt: { type: Date, default: Date.now },
                amount: { type: Number }, // how many packages were delivered at that time
                location: { type: String }, // where they were picked up from, optional
            },
          ],
    }, { timestamps: true }
);

const Apartment = mongoose.model('Apartment', apartmentSchema);

export default Apartment;    