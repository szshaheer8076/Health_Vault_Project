import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import PatientsListScreen from './src/screens/PatientsListScreen';
import AddPatientScreen from './src/screens/AddPatientScreen';
import PatientDetailsScreen from './src/screens/PatientDetailsScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import AddDocumentScreen from './src/screens/AddDocumentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {props => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Register Doctor' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              options={{ title: 'Hospital HealthVault', headerLeft: null }}
            >
              {props => <HomeScreen {...props} onLogout={() => setIsLoggedIn(false)} />}
            </Stack.Screen>
            <Stack.Screen 
              name="PatientsList" 
              component={PatientsListScreen}
              options={{ title: 'All Patients' }}
            />
            <Stack.Screen 
              name="AddPatient" 
              component={AddPatientScreen}
              options={{ title: 'Add New Patient' }}
            />
            <Stack.Screen 
              name="PatientDetails" 
              component={PatientDetailsScreen}
              options={{ title: 'Patient Details' }}
            />
            <Stack.Screen 
              name="AddMedication" 
              component={AddMedicationScreen}
              options={{ title: 'Add Medication' }}
            />
            <Stack.Screen 
              name="AddDocument" 
              component={AddDocumentScreen}
              options={{ title: 'Upload Document' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }
});