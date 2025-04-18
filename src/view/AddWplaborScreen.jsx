import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Switch
} from 'react-native';
import Header from '../components/Header';
import { createWplabor } from '../services/wplabor'; // Importez correctement votre service

const AddWplaborScreen = ({ route, navigation }) => {
  const { workorderid } = route.params; // Récupération de workorderid
  console.log("🔹 AddWplaborScreen: workorderid =", workorderid);

  // États pour les champs
  const [apptrequired, setApptrequired] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [ratehaschanged, setRatehaschanged] = useState(false);
  const [rate, setRate] = useState('');
  const [laborhrs, setLaborhrs] = useState('');
  const [orgid, setOrgid] = useState('');
  const [laborcode, setLaborcode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddWplabor = async () => {
    if (!orgid.trim() || !laborcode.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir les champs Org ID et Labor Code.');
      return;
    }

    // Construction du body pour le WPLabor
    const laborData = {
      apptrequired,
      quantity: parseFloat(quantity),
      ratehaschanged,
      rate: parseFloat(rate),
      laborhrs: parseFloat(laborhrs),
      orgid: orgid.trim(),
      laborcode: laborcode.trim()
    };

    console.log("🔹 handleAddWplabor: laborData =", laborData);

    setLoading(true);
    try {
      // Remplacez "YOUR_SESSION_COOKIE" par la valeur réelle de votre session.
      // Notez bien l'ordre des paramètres : workorderid, laborData, sessionCookie
      const response = await createWplabor(workorderid, laborData, "YOUR_SESSION_COOKIE");
      console.log("🔹 handleAddWplabor: response =", response);

      if (response.success) {
        Alert.alert('Succès', 'WPLabor ajouté avec succès.');
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
      <Header title="Ajouter WPLabor" navigation={navigation} />
      <View style={styles.form}>
      <Text style={styles.label}>Labor Code :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le Labor Code..."
          value={laborcode}
          onChangeText={setLaborcode}
        />

        <Text style={styles.label}>Quantity :</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Entrez la quantité..."
          value={quantity}
          onChangeText={setQuantity}
        />

       
        <Text style={styles.label}>Rate :</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Entrez le taux..."
          value={rate}
          onChangeText={setRate}
        />

        <Text style={styles.label}>Labor Hours :</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Entrez le nombre d'heures..."
          value={laborhrs}
          onChangeText={setLaborhrs}
        />

        <Text style={styles.label}>Org ID :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'Org ID..."
          value={orgid}
          onChangeText={setOrgid}
        />

       

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddWplabor}
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

export default AddWplaborScreen;
