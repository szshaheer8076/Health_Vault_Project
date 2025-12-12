const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, medicationController.getMedications);
router.post('/', authMiddleware, medicationController.addMedication);
router.put('/:id', authMiddleware, medicationController.updateMedication);
router.delete('/:id', authMiddleware, medicationController.deleteMedication);

module.exports = router;