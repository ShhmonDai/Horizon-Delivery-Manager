import Apartment from '../models/apartment.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to add an apartment'));
    }
    if (!req.body.apartmentNumber) {
        return next(errorHandler(400, 'Please provide the apartment number'));
    }

    const newApartment = new Apartment({
        ...req.body,
    });
    try {
        const savedApartment = await newApartment.save();
        res.status(201).json(savedApartment);
    } catch (error) {
        next(error);
    }
};

export const getapartments = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const apartments = await Apartment.find({
            ...(req.query.apartmentNumber && { apartmentNumber: req.query.apartmentNumber }),
            ...(req.query.packageLocation && { packageLocation: req.query.packageLocation }),
            ...(req.query.packageAmount && { packageAmount: req.query.packageAmount }),
            ...(req.query.searchTerm && {
                $or: [
                    { apartmentNumber: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex);
        {/* $options 'i' = uppercase/lowercase is not important, get both results */ }

        {/* Full number of posts in database */ }
        const totalApartments = await Apartment.countDocuments();

        res.status(200).json({
            apartments,
            totalApartments
        });
    } catch (error) {
        next(error);
    }
};

export const deleteapartment = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to delete apartments'));
    }
    try {
        await Apartment.findByIdAndDelete(req.params.apartmentNumber);
        res.status(200).json('The apartment has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updateapartment = async (req, res, next) => {
    if (!(req.user.isAdmin || req.user.isWorker)) {
        return next(errorHandler(403, 'You are not allowed to update apartments'));
    }
    try {
        const updatedApartment = await Apartment.findByIdAndUpdate(
            req.params.apartmentNumber,
            {
                $set: {
                    apartmentNumber: req.body.apartmentNumber,
                    packageLocation: req.body.packageLocation,
                    packageAmount: req.body.packageAmount
                },
            },
            { new: true }
        );
        res.status(200).json(updatedApartment);
    } catch (error) {
        next(error);
    }
};
