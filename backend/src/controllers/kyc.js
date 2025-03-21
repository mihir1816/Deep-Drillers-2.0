const User = require('../models/User');

exports.submitKYC = async (req, res) => {
  try {
    const { drivingLicense } = req.body;
    const user = await User.findById(req.user.id);

    user.drivingLicense = {
      ...user.drivingLicense,
      ...drivingLicense,
      verified: false
    };
    user.kycStatus = 'PENDING';
    
    await user.save();

    res.json({
      success: true,
      message: 'KYC submitted successfully',
      kycStatus: user.kycStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyKYC = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = status;
    user.drivingLicense.verified = status === 'VERIFIED';
    await user.save();

    res.json({
      success: true,
      message: 'KYC status updated successfully',
      kycStatus: user.kycStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 