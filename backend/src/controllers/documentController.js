const path = require('path');
const Document = require('../models/Document');

// Get documents for a patient
exports.getDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const documents = await Document.find({ patientId }).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents'
    });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let type = 'image';
    if (fileExt === '.pdf') {
      type = 'pdf';
    }

    const document = new Document({
      patientId,
      title,
      type,
      filePath: req.file.path,
      uploadedBy: req.doctorId
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading document'
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs').promises;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    try {
      await fs.unlink(document.filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    await Document.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting document'
    });
  }
};