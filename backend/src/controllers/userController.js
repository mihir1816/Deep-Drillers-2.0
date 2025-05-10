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
            data: user // Send the entire user object
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