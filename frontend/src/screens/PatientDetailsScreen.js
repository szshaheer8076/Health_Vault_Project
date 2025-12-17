import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { getPatient, getMedications, getDocuments } from '../services/api';

export default function PatientDetailsScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadPatientData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPatientData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPatientData = async () => {
    try {
      const [patientRes, medicationsRes, documentsRes] = await Promise.all([
        getPatient(patientId),
        getMedications(patientId),
        getDocuments(patientId)
      ]);

      if (patientRes.data.success) {
        setPatient(patientRes.data.patient);
      }
      if (medicationsRes.data.success) {
        setMedications(medicationsRes.data.medications);
      }
      if (documentsRes.data.success) {
        setDocuments(documentsRes.data.documents);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const renderProfile = () => (
    <View style={styles.section}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Patient ID:</Text>
        <Text style={styles.infoValue}>{patient.patientId}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Full Name:</Text>
        <Text style={styles.infoValue}>{patient.fullName}</Text>
      </View>
      {patient.dateOfBirth && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>
            {new Date(patient.dateOfBirth).toLocaleDateString()}
          </Text>
        </View>
      )}
      {patient.gender && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{patient.gender}</Text>
        </View>
      )}
      {patient.bloodGroup && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Blood Group:</Text>
          <Text style={styles.infoValue}>{patient.bloodGroup}</Text>
        </View>
      )}
      {patient.phone && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{patient.phone}</Text>
        </View>
      )}
      {patient.emergencyContact && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Emergency Contact:</Text>
          <Text style={styles.infoValue}>{patient.emergencyContact}</Text>
        </View>
      )}
      {patient.address && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{patient.address}</Text>
        </View>
      )}
    </View>
  );

  const renderMedications = () => (
    <View style={styles.section}>
      {medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications added yet</Text>
      ) : (
        medications.map((med) => (
          <View key={med._id} style={styles.medicationCard}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetail}>Dosage: {med.dosage}</Text>
            <Text style={styles.medicationDetail}>Frequency: {med.frequency}</Text>
            <Text style={styles.medicationDetail}>
              Start: {new Date(med.startDate).toLocaleDateString()}
            </Text>
            {med.endDate && (
              <Text style={styles.medicationDetail}>
                End: {new Date(med.endDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication', { patientId })}
      >
        <Text style={styles.addButtonText}>+ Add Medication</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.section}>
      {documents.length === 0 ? (
        <Text style={styles.emptyText}>No documents uploaded yet</Text>
      ) : (
        documents.map((doc) => (
          <View key={doc._id} style={styles.documentCard}>
            <Text style={styles.documentIcon}>
              {doc.type === 'pdf' ? '📄' : '🖼️'}
            </Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{doc.title}</Text>
              <Text style={styles.documentDate}>
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDocument', { patientId })}
      >
        <Text style={styles.addButtonText}>+ Upload Document</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{patient.fullName}</Text>
        <Text style={styles.headerSubtitle}>ID: {patient.patientId}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'medications' && styles.activeTab]}
          onPress={() => setActiveTab('medications')}
        >
          <Text style={[styles.tabText, activeTab === 'medications' && styles.activeTabText]}>
            Medications ({medications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
          onPress={() => setActiveTab('documents')}
        >
          <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
            Documents ({documents.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'medications' && renderMedications()}
        {activeTab === 'documents' && renderDocuments()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    color: '#666'
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#4A90E2'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600'
  },
  content: {
    flex: 1
  },
  section: {
    padding: 15
  },
  infoRow: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right'
  },
  medicationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  medicationDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  documentIcon: {
    fontSize: 32,
    marginRight: 15
  },
  documentInfo: {
    flex: 1
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  documentDate: {
    fontSize: 12,
    color: '#999'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});