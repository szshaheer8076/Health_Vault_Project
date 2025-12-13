import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });

      if (result.type === 'cancel') {
        return;
      }

      Alert.prompt(
        'Document Title',
        'Enter a title for this document',
        async (title) => {
          if (!title) return;

          setUploading(true);
          try {
            await uploadDocument(title, result.uri);
            Alert.alert('Success', 'Document uploaded successfully');
            loadDocuments();
          } catch (error) {
            Alert.alert('Error', 'Failed to upload document');
          } finally {
            setUploading(false);
          }
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete ${title}?`,
      [ { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          await deleteDocument(id);
          loadDocuments();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete document');
        }
      }
    }
  ]
);
};
const renderDocument = ({ item }) => (
<View style={styles.documentCard}>
<View style={styles.documentHeader}>
<Text style={styles.documentIcon}>
{item.type === 'pdf' ? '📄' : '🖼️'}
</Text>
<View style={styles.documentInfo}>
<Text style={styles.documentTitle}>{item.title}</Text>
<Text style={styles.documentDate}>
{new Date(item.uploadedAt).toLocaleDateString()}
</Text>
</View>
<TouchableOpacity
onPress={() => handleDelete(item._id, item.title)}
>
<Text style={styles.deleteButton}>🗑️</Text>
</TouchableOpacity>
</View>
</View>
);
if (loading) {
return (
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color="#4A90E2" />
</View>
);
}
return (
<View style={styles.container}>
{documents.length === 0 ? (
<View style={styles.emptyContainer}>
<Text style={styles.emptyText}>No documents uploaded yet</Text>
<Text style={styles.emptySubtext}>
Tap the + button below to upload your first document
</Text>
</View>
) : (
<FlatList
data={documents}
renderItem={renderDocument}
keyExtractor={(item) => item._id}
contentContainerStyle={styles.listContainer}
/>
)}
  <TouchableOpacity
    style={styles.addButton}
    onPress={handleUpload}
    disabled={uploading}
  >
    {uploading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.addButtonText}>+ Upload Document</Text>
    )}
  </TouchableOpacity>
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
listContainer: {
padding: 15
},
documentCard: {
backgroundColor: '#fff',
padding: 15,
borderRadius: 12,
marginBottom: 15,
elevation: 2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4
},
documentHeader: {
flexDirection: 'row',
alignItems: 'center'
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
deleteButton: {
fontSize: 20
},
emptyContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 40
},
emptyText: {
fontSize: 18,
color: '#666',
marginBottom: 10,
textAlign: 'center'
},
emptySubtext: {
fontSize: 14,
color: '#999',
textAlign: 'center'
},
addButton: {
backgroundColor: '#4A90E2',
padding: 15,
margin: 15,
borderRadius: 8,
alignItems: 'center'
},
addButtonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold'
}
});
