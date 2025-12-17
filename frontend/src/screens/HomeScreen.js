import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../services/api';

export default function HomeScreen({ navigation, onLogout }) {
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    loadDoctorName();
  }, []);

  const loadDoctorName = async () => {
    const name = await AsyncStorage.getItem('doctorName');
    setDoctorName(name || 'Doctor');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('sessionToken');
      await AsyncStorage.removeItem('doctorId');
      await AsyncStorage.removeItem('doctorName');
      
      if (onLogout) {
        onLogout();
      }
    }
  };

  const menuItems = [
    {
      title: 'View All Patients',
      subtitle: 'See list of all patients',
      icon: '👥',
      onPress: () => navigation.navigate('PatientsList')
    },
    {
      title: 'Add New Patient',
      subtitle: 'Register a new patient',
      icon: '➕',
      onPress: () => navigation.navigate('AddPatient')
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Dr. {doctorName}</Text>
        <Text style={styles.subtitleText}>Hospital HealthVault System</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 30,
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitleText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9
  },
  menuContainer: {
    padding: 15
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 15
  },
  menuTextContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  arrow: {
    fontSize: 24,
    color: '#4A90E2'
  },
  logoutButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600'
  }
});