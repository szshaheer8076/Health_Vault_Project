const Medication = require('../models/Medication');

// Get medications for a patient
exports.getMedications = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medications = await Medication.find({ patientId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      medications
    });

  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching medications'
    });
  }
};

// Add medication
exports.addMedication = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, dosage, frequency, startDate, endDate } = req.body;

    if (!name || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, dosage, frequency, and start date'
      });
    }

    const medication = new Medication({
      patientId,
      name,
      dosage,
      frequency,
      startDate,
      endDate: endDate || null,
      prescribedBy: req.doctorId
    });

    await medication.save();

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      medication
    });

  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding medication'
    });
  }
};

// Delete medication
exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findByIdAndDelete(id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication deleted successfully'
    });

  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting medication'
    });
  }
};