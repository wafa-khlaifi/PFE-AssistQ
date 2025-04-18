// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ImageBackground, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { loginUser } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import InputField from '../components/InputField';
import ScreenContainer from '../components/ScreenContainer';

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
    <ImageBackground 
      source={{ uri: 'https://source.unsplash.com/1600x900/?technology,abstract' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScreenContainer>
          <Text style={styles.title}>Connexion</Text>
          <InputField placeholder="Nom d'utilisateur" value={username} onChangeText={setUsername} />
          <InputField placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title="Se connecter" onPress={handleLogin} loading={loading} disabled={loading} />

          <TouchableOpacity
            style={styles.changeUrlButton}
            onPress={() => {
              console.log('Ouverture de la modal');
              setShowUrlModal(true);
            }}
          >
            <Text style={styles.changeUrlButtonText}>Changer l'environnement</Text>
          </TouchableOpacity>
        </ScreenContainer>
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
            <Text style={styles.modalTitle}>Configuration de l'URL de base</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez l'URL de base"
              value={newBaseUrl}
              onChangeText={setNewBaseUrl}
            />
            <Button title="Sauvegarder" onPress={handleSaveBaseUrl} />
            <Button title="Annuler" onPress={() => setShowUrlModal(false)} />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20
  },
  changeUrlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center'
  },
  changeUrlButtonText: {
    color: '#000000',           // Texte en noir
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline'  // Texte souligné
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 10
  }
});

export default LoginScreen;
