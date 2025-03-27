// Next.js API route for license verification
export default async function handler(req, res) {
  const { licenseNumber } = req.query;

  try {
    // In a real implementation, you would query your database here
    // This is a mock implementation for demonstration purposes
    
    // Simulate a database lookup delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - replace with actual database query
    const mockUsers = {
      "DL12345678": {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        licenseNumber: "DL12345678",
        address: "123 Main Street, Anytown, CA 12345"
      },
      "DL87654321": {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1 (555) 987-6543",
        licenseNumber: "DL87654321",
        address: "456 Oak Avenue, Somewhere, NY 67890"
      }
    };
    
    const user = mockUsers[licenseNumber];
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this driving license number"
      });
    }
    
    // Return the user data
    return res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('License verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during license verification'
    });
  }
} 