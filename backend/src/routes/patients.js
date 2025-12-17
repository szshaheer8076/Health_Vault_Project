const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// /api/patients
router.get('/patients', patientController.getPatients);
router.get('/patients/search', patientController.searchPatients);
router.get('/patients/:id', patientController.getPatient);
router.post('/patients', patientController.addPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

module.exports = router;