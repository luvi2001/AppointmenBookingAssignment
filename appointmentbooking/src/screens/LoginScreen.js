import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.message === 'Login successful') {
        const { token } = data;
        navigation.navigate('AddSlot', { token });
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require('../assets/bck.jpg')} style={styles.backgroundImage} />
      
      <Text style={styles.title}>Login</Text>
      
      {/* Ensure the error is wrapped properly */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Email Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Email Address" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
      />
      
      {/* Password Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    justifyContent: 'center', 
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, 
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
    opacity: 0.4, 
    zIndex: -1,
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30,
    color: '#4B0082', 
    zIndex: 1,
  },
  input: { 
    height: 50, 
    borderColor: '#a164cf', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingLeft: 15, 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    fontSize: 16,
    fontFamily: 'Arial',
    zIndex: 1,
  },
  error: { 
    color: '#d9534f', 
    marginBottom: 15, 
    textAlign: 'center', 
    fontSize: 14,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#a164cf', 
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: { 
    marginTop: 20, 
    textAlign: 'center', 
    color: '#007bff', 
    fontSize: 16,
    textDecorationLine: 'underline',
    zIndex: 1, 
  },
});

export default LoginScreen;
