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
import { addMedication } from '../services/api';

export default function AddMedicationScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!medication.name || !medication.dosage || !medication.frequency || !medication.startDate) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await addMedication(patientId, medication);
      if (response.data.success) {
        Alert.alert('Success', 'Medication added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add medication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Medication Name *</Text>
        <TextInput
          style={styles.input}
          value={medication.name}
          onChangeText={(text) => setMedication({ ...medication, name: text })}
          placeholder="e.g., Aspirin"
        />

        <Text style={styles.label}>Dosage *</Text>
        <TextInput
          style={styles.input}
          value={medication.dosage}
          onChangeText={(text) => setMedication({ ...medication, dosage: text })}
          placeholder="e.g., 100mg"
        />

        <Text style={styles.label}>Frequency *</Text>
        <TextInput
          style={styles.input}
          value={medication.frequency}
          onChangeText={(text) => setMedication({ ...medication, frequency: text })}
          placeholder="e.g., Twice daily"
        />

        <Text style={styles.label}>Start Date *</Text>
        <TextInput
          style={styles.input}
          value={medication.startDate}
          onChangeText={(text) => setMedication({ ...medication, startDate: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>End Date (Optional)</Text>
        <TextInput
          style={styles.input}
          value={medication.endDate}
          onChangeText={(text) => setMedication({ ...medication, endDate: text })}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Medication</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
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