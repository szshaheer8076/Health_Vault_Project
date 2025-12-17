import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadDocument } from '../services/api';

export default function AddDocumentScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });

      if (result.type === 'cancel') {
        return;
      }

      setSelectedFile(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(patientId, title, selectedFile.uri);
      Alert.alert('Success', 'Document uploaded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Document Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., X-Ray Report"
        />

        <Text style={styles.label}>Select File *</Text>
        <TouchableOpacity
          style={styles.filePicker}
          onPress={handlePickDocument}
        >
          <Text style={styles.filePickerText}>
            {selectedFile ? selectedFile.name : '📎 Choose File (Image or PDF)'}
          </Text>
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoText}>✓ File selected</Text>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload Document</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  filePicker: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center'
  },
  filePickerText: {
    fontSize: 16,
    color: '#666'
  },
  fileInfo: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginTop: 15
  },
  fileInfoText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 5
  },
  fileName: {
    fontSize: 14,
    color: '#666'
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});