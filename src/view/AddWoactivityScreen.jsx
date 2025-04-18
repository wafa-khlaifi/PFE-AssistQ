import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import Header from '../components/Header';
import { createWoactivity } from '../services/woactivity'; // Assure-toi d'importer correctement ton service

const AddWoactivityScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  
  // États pour les champs
  const [description, setDescription] = useState('');
  const [assetnum, setAssetnum] = useState('');
  const [location, setLocation] = useState('BR300');
  const [status, setStatus] = useState('WAPPR');
  const [loading, setLoading] = useState(false);

  const handleAddWoactivity = async () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description.');
      return;
    }

    setLoading(true);
    try {
      // Construire la structure correcte du body
      const woactivityData = [{
        description: description.trim(),  // Description dynamique
        woactivity: [
          {
            assetnum: assetnum,
            location: location,
            status: status,
          }
        ]
      }];

      const response = await createWoactivity(workorderid, woactivityData );

      if (response.success) {
        Alert.alert('Succès', 'Woactivity ajouté avec succès.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', response.error || "Une erreur s'est produite.");
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ajouter Woactivity" navigation={navigation} />
      <View style={styles.form}>
        <Text style={styles.label}>Description :</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Entrez la description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Asset :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le asset..."
          value={assetnum}
          onChangeText={setAssetnum}
        />
        <Text style={styles.label}>Location :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez la Location..."
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Status :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le Status..."
          value={status}
          onChangeText={setStatus}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddWoactivity}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddWoactivityScreen;
