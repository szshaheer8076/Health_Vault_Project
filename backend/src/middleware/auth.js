const Session = require('../models/Session');

// Simple session-based authentication - NO JWT!
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers['x-auth-token'];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    // Find session in database
    const session = await Session.findOne({ sessionToken: token });
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired session' 
      });
    }

    // Attach userId to request for use in controllers
    req.userId = session.userId;
    next();
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

module.exports = authMiddleware;