// screens/LoginScreen.js
import React, { useState, useEffect ,LogBox } from 'react';
import { View, Text, Alert, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { loginUser } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Feather'; // Importation de la bibliothèque d'icônes

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // États pour la configuration de l'URL de base
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [newBaseUrl, setNewBaseUrl] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        navigation.replace('WorkOrders');
      }
    };
    checkStoredCredentials();

    // Charger l'URL de base stockée pour l'afficher dans la modale
    const loadBaseUrl = async () => {
      const storedBaseUrl = await AsyncStorage.getItem('baseUrl');
      if (storedBaseUrl) {
        setNewBaseUrl(storedBaseUrl);
      }
    };
    loadBaseUrl();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const response = await loginUser(username, password);
    setLoading(false);

    if (response.success) {
      console.log("✅ Redirection vers WorkOrders");
      navigation.replace('WorkOrders');
    } else {
      if (isFocused) {
        Alert.alert("Erreur de connexion", response.error);
      } else {
        console.warn("⚠️ Tentative d'affichage d'une alerte alors que l'écran n'est pas actif.");
      }
    }
  };

  const handleSaveBaseUrl = async () => {
    if (newBaseUrl.trim()) {
      await AsyncStorage.setItem('baseUrl', newBaseUrl.trim());
      Alert.alert('Succès', "L'URL de base a été mise à jour.");
      setShowUrlModal(false);
    } else {
      Alert.alert('Erreur', 'Veuillez entrer une URL valide.');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        {/* Ajout du logo en haut de l'écran */}
        <Image 
          source={require('../constants/logoAssistQ.jpg')}  // Remplacez le chemin par l'emplacement de votre image
          style={styles.logo}
        />

        {/* Carte contenant les champs de connexion */}
        <View style={styles.card}>

          {/* Champ Username / Email avec icône */}
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Champ Password avec icône */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button title="Login" onPress={handleLogin} loading={loading} disabled={loading} />

          <TouchableOpacity
            style={styles.changeUrlButton}
            onPress={() => {
              console.log('Ouverture de la modal');
              setShowUrlModal(true);
            }}
          >
            <Text style={styles.changeUrlButtonText}>Change Environment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de configuration de l'URL de base */}
      <Modal
        visible={showUrlModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUrlModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Base URL Configuration</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Base URL"
              value={newBaseUrl}
              onChangeText={setNewBaseUrl}
            />
            <Button title="Save" onPress={handleSaveBaseUrl} />
            <Button title="Cancel" onPress={() => setShowUrlModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFF', // Fond blanc simple
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,  // Ajustez la taille du logo selon vos préférences
    height: 200,  // Ajustez la taille du logo selon vos préférences
    marginBottom: 30, // Espacement entre le logo et le titre
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    elevation: 5, // Ombre légère pour la carte
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', // Texte noir
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 25,
  },

  changeUrlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  changeUrlButtonText: {
    color: '#000000', // Texte noir
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LoginScreen;
