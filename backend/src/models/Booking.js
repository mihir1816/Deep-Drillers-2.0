const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        pickupDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["wallet", "paypal" , "card"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "active", "completed", "cancelled"],
            default: "pending",
        },
        // Pickup details
        pickupTime: {
            type: Date,
        },
        vehicleImages: [
            {
                type: String,
                description: "URLs of vehicle images taken at pickup",
            },
        ],
        pickupNotes: {
            type: String,
            description: "Any notes about vehicle condition at pickup",
        },
        // Return details
        returnTime: {
            type: Date,
        },
        returnImages: [
            {
                type: String,
                description: "URLs of vehicle images taken at return",
            },
        ],
        damageReport: {
            hasDamages: {
                type: Boolean,
                default: false,
            },
            notes: String,
            estimatedRepairCost: Number,
        },
        // Add these new fields for charges
        overtimeCharges: {
            type: Number,
            default: 0,
            description: "Additional charges for returning after contracted duration"
        },
        totalCharges: {
            type: Number,
            default: 0,
            description: "Total charges including damage and overtime fees"
        },
        returnNotes: {
            type: String,
            description: "Any notes about vehicle condition at return",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);