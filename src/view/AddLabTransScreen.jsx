// screens/AddLabTransScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, Switch,
  ActivityIndicator, 
  Alert
} from 'react-native';
import Header from '../components/Header';
import { createLabTrans } from '../services/LabTransService'; // Le service qu'on vient de créer

const AddLabTransScreen = ({ route, navigation }) => {
  const { workorderid } = route.params; // Récupère l'ID du WO
  console.log("🔹 AddLabTransScreen: workorderid =", workorderid);

  // États pour les champs
  const [apptrequired, setApptrequired] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [ratehaschanged, setRatehaschanged] = useState(false);
  const [rate, setRate] = useState('');
  const [regularhrs, setLaborhrs] = useState('');
  const [orgid, setOrgid] = useState('');
  const [laborcode, setLaborcode] = useState('');
  const [loading, setLoading] = useState(false);

  // Appelé quand l'utilisateur valide le formulaire
  const handleAddLabTrans = async () => {
    if (!orgid.trim() || !laborcode.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir au moins Org ID et Labor Code.');
      return;
    }

    // Construction du payload pour createLabTrans
    const laborData = {
      apptrequired,
      quantity: parseFloat(quantity),
      ratehaschanged,
      rate: parseFloat(rate),
      regularhrs: parseFloat(regularhrs),
      orgid: orgid.trim(),
      laborcode: laborcode.trim()
    };

    console.log("🔹 handleAddLabTrans: laborData =", laborData);

    setLoading(true);
    try {
      // TODO: Récupérez la vraie sessionCookie (JSESSIONID) depuis AsyncStorage ou vos props
      const sessionCookie = "YOUR_SESSION_COOKIE"; 
      
      // Appel du service
      const response = await createLabTrans(workorderid, laborData, sessionCookie);
      console.log("🔹 handleAddLabTrans: response =", response);

      if (response.success) {
        Alert.alert('Succès', 'LabTrans ajouté avec succès.');
        // On revient en arrière (ou on rafraîchit la liste)
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
      <Header title="Ajouter LabTrans" navigation={navigation} />
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
          value={regularhrs}
          onChangeText={setLaborhrs}
        />

        <Text style={styles.label}>Org ID :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'Org ID..."
          value={orgid}
          onChangeText={setOrgid}
        />

  
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Appt Required: </Text>
            <Switch value={apptrequired} onValueChange={setApptrequired} />
          </View>
        

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddLabTrans}
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

export default AddLabTransScreen;

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
