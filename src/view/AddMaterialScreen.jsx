import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Switch, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView
} from 'react-native';
import Header from '../components/Header';
import { createWpmaterial } from '../services/wpmaterial'; // Assurez-vous du bon chemin d'import

const AddMaterialScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  console.log("🔹 AddMaterialScreen: workorderid =", workorderid);

  // États pour les champs du matériel
  const [description, setDescription] = useState('');
  const [itemnum, setItemnum] = useState('');
  const [unitcost, setUnitcost] = useState('');
  const [linecost, setLinecost] = useState('');
  const [location, setLocation] = useState('');
  const [restype, setRestype] = useState('');
  const [directreq, setDirectreq] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddMaterial = async () => {
    if (
      !description.trim() ||
      !itemnum.trim() ||
      !unitcost ||
      !linecost ||
      !location.trim() ||
      !restype.trim() 
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Construction des données pour le matériel afin de correspondre à la structure attendue par l'API
      const materialData = {
        description: description.trim(),
        wpmaterial: [
          {
            itemnum: itemnum.trim(),
            unitcost: parseFloat(unitcost),
            linecost: parseFloat(linecost),
            location: location.trim(),
            restype: restype.trim(),
            directreq: directreq,
          }
        ]
      };

      console.log("🔹 handleAddMaterial: materialData =", materialData);

      // Remplacez "YOUR_SESSION_COOKIE" par la valeur réelle de votre cookie de session
      const response = await createWpmaterial(workorderid, materialData, "YOUR_SESSION_COOKIE");
      console.log("🔹 handleAddMaterial: response =", response);

      if (response.success) {
        Alert.alert('Success', 'Material added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error || "An error occurred.");
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Material" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Item Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item number..."
          value={itemnum}
          onChangeText={setItemnum}
        />

        <Text style={styles.label}>Unit Cost:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter unit cost..."
          keyboardType="numeric"
          value={unitcost}
          onChangeText={setUnitcost}
        />

        <Text style={styles.label}>Line Cost:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter line cost..."
          keyboardType="numeric"
          value={linecost}
          onChangeText={setLinecost}
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location..."
          value={location}
          onChangeText={setLocation}
        />

        

        <Text style={styles.label}>Response Type:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter response type..."
          value={restype}
          onChangeText={setRestype}
        />

        <Text style={styles.label}>Direct Request:</Text>
        <Switch
          value={directreq}
          onValueChange={setDirectreq}
        />

    

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddMaterial}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Add Material</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F0F2F5'
  },
  scrollContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
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
    alignItems: 'center'
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddMaterialScreen;
