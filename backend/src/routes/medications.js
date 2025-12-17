const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/auth');

router.get('/:patientId', authMiddleware, medicationController.getMedications);
router.post('/:patientId', authMiddleware, medicationController.addMedication);
router.delete('/:id', authMiddleware, medicationController.deleteMedication);

module.exports = router;