const Session = require('../models/Session');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token'];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    const session = await Session.findOne({ sessionToken: token });
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired session' 
      });
    }

    req.doctorId = session.doctorId;
    next();
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

module.exports = authMiddleware;