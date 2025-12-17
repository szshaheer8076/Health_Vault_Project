const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Doctor = require('../models/Doctor');
const Session = require('../models/Session');

// Register new doctor
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doctor = new Doctor({
      email,
      passwordHash,
      name
    });
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login doctor
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // Create session with random token (NO JWT!)
    const sessionToken = uuidv4();
    const session = new Session({
      doctorId: doctor._id,
      sessionToken
    });
    await session.save();

    res.json({
      success: true,
      message: 'Login successful',
      sessionToken,
      doctorId: doctor._id,
      doctorName: doctor.name
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Logout doctor
exports.logout = async (req, res) => {
  try {
    const token = req.headers['x-auth-token'];
    await Session.deleteOne({ sessionToken: token });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};