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
import { addWorkLog } from '../services/WorkLog';

const AddWorkLogScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  
  // État pour la description
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddWorkLog = async () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description.');
      return;
    }
  
    setLoading(true);
    try {
      // Construire la structure correcte du body
      const worklogData = [{
        description: description.trim(),  // Description dynamique
        worklog: [
          {
            clientviewable: 1
          }
        ]
      }];
  
      const response = await addWorkLog(workorderid, worklogData);
  
      if (response.success) {
        Alert.alert('Succès', 'Worklog ajouté avec succès.');
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
      <Header title="Ajouter Worklog" navigation={navigation} />
      <View style={styles.form}>
        <Text style={styles.label}>Description :</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Entrez la description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddWorkLog}
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

export default AddWorkLogScreen;
