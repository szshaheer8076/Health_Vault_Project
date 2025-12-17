const Patient = require('../models/Patient');

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      patients
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patients'
    });
  }
};

// Get single patient
exports.getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patient'
    });
  }
};

// Add new patient
exports.addPatient = async (req, res) => {
  console.log('addPatient body:', req.body); // debug body

  try {
    const {
      patientId,
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      emergencyContact,
      address
    } = req.body;

    if (!patientId || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient ID and full name'
      });
    }

    // Check if patient ID already exists
    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID already exists'
      });
    }

    const patient = new Patient({
      patientId,
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      emergencyContact,
      address,
      createdBy: req.doctorId || null
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      patient
    });

  } catch (error) {
    console.error('Add patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding patient'
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      emergencyContact,
      address
    } = req.body;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (fullName) patient.fullName = fullName;
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (phone !== undefined) patient.phone = phone;
    if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
    if (address !== undefined) patient.address = address;

    await patient.save();

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient
    });

  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating patient'
    });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting patient'
    });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    const patients = await Patient.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { patientId: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      patients
    });

  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching patients'
    });
  }
};