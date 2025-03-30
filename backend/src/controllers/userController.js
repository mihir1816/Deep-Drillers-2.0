const User = require('../models/User');

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                drivingLicense: {
                    number: user.drivingLicense.number,
                    image: user.drivingLicense.image,
                    verified: user.drivingLicense.verified
                },
                role: user.role,
                _id: user._id
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message
        });
    }
}; 