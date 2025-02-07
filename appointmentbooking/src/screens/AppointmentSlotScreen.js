import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, DatePickerIOS, TimePickerAndroid } from 'react-native';

const AppointmentSlotScreen = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleCreateSlot = async () => {
    if (!date || !startTime || !endTime) {
      setError('All fields are required');
      return;
    }

    const slotData = {
      date,
      start_time: startTime,
      end_time: endTime
    };

    try {
      const response = await fetch('http://localhost:3000/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });

      const data = await response.json();
      if (data.message === 'Appointment slot created successfully') {
        alert('Appointment slot created successfully!');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Appointment Slot</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput 
        style={styles.input} 
        placeholder="Date (YYYY-MM-DD)" 
        value={date} 
        onChangeText={setDate} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Start Time (HH:MM)" 
        value={startTime} 
        onChangeText={setStartTime} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="End Time (HH:MM)" 
        value={endTime} 
        onChangeText={setEndTime} 
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSlot}>
        <Text style={styles.buttonText}>Create Slot</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: { 
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingLeft: 15, 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    fontSize: 16,
  },
  error: { 
    color: '#d9534f', 
    marginBottom: 15, 
    textAlign: 'center', 
    fontSize: 14 
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppointmentSlotScreen;
