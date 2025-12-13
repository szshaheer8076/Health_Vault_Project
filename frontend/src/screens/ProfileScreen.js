import React, { useState, useEffect } from 'react';
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
import { getProfile, updateProfile } from '../services/api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateProfile(profile);
      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(text) => setProfile({ ...profile, fullName: text })}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={profile.dateOfBirth}
          onChangeText={(text) => setProfile({ ...profile, dateOfBirth: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                profile.gender === g && styles.genderButtonActive
              ]}
              onPress={() => setProfile({ ...profile, gender: g })}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  profile.gender === g && styles.genderButtonTextActive
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
                profile.bloodGroup === bg && styles.bloodGroupButtonActive
              ]}
              onPress={() => setProfile({ ...profile, bloodGroup: bg })}
            >
              <Text
                style={[
                  styles.bloodGroupButtonText,
                  profile.bloodGroup === bg && styles.bloodGroupButtonTextActive
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
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          value={profile.emergencyContact}
          onChangeText={(text) => setProfile({ ...profile, emergencyContact: text })}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Profile</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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