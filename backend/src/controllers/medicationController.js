const Medication = require('../models/Medication');

// Get all medications for user
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.userId }).sort({ createdAt: -1 });

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

// Add new medication
exports.addMedication = async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate } = req.body;

    // Validation
    if (!name || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, dosage, frequency, and start date'
      });
    }

    const medication = new Medication({
      userId: req.userId,
      name,
      dosage,
      frequency,
      startDate,
      endDate: endDate || null
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

// Update medication
exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, startDate, endDate } = req.body;

    const medication = await Medication.findOne({ _id: id, userId: req.userId });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Update fields
    if (name) medication.name = name;
    if (dosage) medication.dosage = dosage;
    if (frequency) medication.frequency = frequency;
    if (startDate) medication.startDate = startDate;
    if (endDate !== undefined) medication.endDate = endDate;

    await medication.save();

    res.json({
      success: true,
      message: 'Medication updated successfully',
      medication
    });

  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating medication'
    });
  }
};

// Delete medication
exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findOneAndDelete({ _id: id, userId: req.userId });

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