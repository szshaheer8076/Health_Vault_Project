import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { addPatient } from '../services/api';

export default function AddPatientScreen({ navigation }) {
  const [patient, setPatient] = useState({
    patientId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    emergencyContact: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!patient.patientId || !patient.fullName) {
      Alert.alert('Error', 'Please provide patient ID and full name');
      return;
    }

    setSaving(true);
    try {
      const response = await addPatient(patient);
      if (response.data.success) {
        Alert.alert('Success', 'Patient added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add patient';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Patient ID *</Text>
        <TextInput
          style={styles.input}
          value={patient.patientId}
          onChangeText={(text) => setPatient({ ...patient, patientId: text })}
          placeholder="e.g., P12345"
        />

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={patient.fullName}
          onChangeText={(text) => setPatient({ ...patient, fullName: text })}
          placeholder="Patient full name"
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={patient.dateOfBirth}
          onChangeText={(text) => setPatient({ ...patient, dateOfBirth: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                patient.gender === g && styles.genderButtonActive
              ]}
              onPress={() => setPatient({ ...patient, gender: g })}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  patient.gender === g && styles.genderButtonTextActive
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.bloodGroupContainer}>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
            <TouchableOpacity
              key={bg}
              style={[
                styles.bloodGroupButton,
                patient.bloodGroup === bg && styles.bloodGroupButtonActive
              ]}
              onPress={() => setPatient({ ...patient, bloodGroup: bg })}
            >
              <Text
                style={[
                  styles.bloodGroupButtonText,
                  patient.bloodGroup === bg && styles.bloodGroupButtonTextActive
                ]}
              >
                {bg}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={patient.phone}
          onChangeText={(text) => setPatient({ ...patient, phone: text })}
          keyboardType="phone-pad"
          placeholder="Phone number"
        />

        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
                value={patient.emergencyContact}
                onChangeText={(text) => setPatient({ ...patient, emergencyContact: text })}
                keyboardType="phone-pad"
                placeholder="Emergency contact number"/><Text style={styles.label}>Address</Text>
    <TextInput
      style={[styles.input, styles.textArea]}
      value={patient.address}
      onChangeText={(text) => setPatient({ ...patient, address: text })}
      placeholder="Full address"
      multiline
      numberOfLines={3}
    />

    <TouchableOpacity
      style={styles.button}
      onPress={handleSave}
      disabled={saving}
    >
      {saving ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Save Patient</Text>
      )}
    </TouchableOpacity>
  </View>
</ScrollView>);
}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f5f5f5'
},
form: {
padding: 20
},
label: {
fontSize: 16,
fontWeight: '600',
color: '#333',
marginBottom: 8,
marginTop: 15
},
input: {
backgroundColor: '#fff',
padding: 15,
borderRadius: 8,
fontSize: 16,
borderWidth: 1,
borderColor: '#ddd'
},
textArea: {
height: 80,
textAlignVertical: 'top'
},
genderContainer: {
flexDirection: 'row',
justifyContent: 'space-between'
},
genderButton: {
flex: 1,
padding: 12,
borderRadius: 8,
borderWidth: 1,
borderColor: '#ddd',
backgroundColor: '#fff',
marginHorizontal: 5,
alignItems: 'center'
},
genderButtonActive: {
backgroundColor: '#4A90E2',
borderColor: '#4A90E2'
},
genderButtonText: {
color: '#666',
fontSize: 14
},
genderButtonTextActive: {
color: '#fff',
fontWeight: '600'
},
bloodGroupContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
marginBottom: 10
},
bloodGroupButton: {
padding: 10,
borderRadius: 8,
borderWidth: 1,
borderColor: '#ddd',
backgroundColor: '#fff',
margin: 5,
minWidth: 60,
alignItems: 'center'
},
bloodGroupButtonActive: {
backgroundColor: '#4A90E2',
borderColor: '#4A90E2'
},
bloodGroupButtonText: {
color: '#666',
fontSize: 14
},
bloodGroupButtonTextActive: {
color: '#fff',
fontWeight: '600'
},
button: {
backgroundColor: '#4A90E2',
padding: 15,
borderRadius: 8,
alignItems: 'center',
marginTop: 30,
marginBottom: 20
},
buttonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold'
}
});
