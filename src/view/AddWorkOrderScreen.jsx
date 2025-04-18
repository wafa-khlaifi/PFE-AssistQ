import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { createWorkOrder } from '../services/workOrders';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { getErrorMessage } from '../constants/errors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Header from '../components/Header';

const AddWorkOrderScreen = () => {
  const [wonum, setWonum] = useState('');
  const [description, setDescription] = useState('');
  const [siteid, setSiteid] = useState('BEDFORD');
  const [location, setLocation] = useState('BR300');
  const [status, setStatus] = useState('WAPPR');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleSubmit = async () => {
    if (!wonum.trim() || !description.trim()) {
      if (isFocused) {
        Alert.alert("Error", getErrorMessage("work_orders", "missing_fields") || "Please fill in all required fields.");
      }
      return;
    }

    setLoading(true);
    const response = await createWorkOrder({ wonum, description, siteid, location, status });
    setLoading(false);

    if (isFocused) {
      setTimeout(() => {
        if (response.success) {
          Alert.alert("Success", "Work Order added successfully!");
        } else {
          Alert.alert("Error", response.error || getErrorMessage("work_orders", "fetch_error"));
        }
      }, 100);
    } else {
      console.warn("⚠️ Alert ignored because the screen was no longer active.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Work Order" navigation={navigation} />

      <InputField placeholder="Work Order Number (wonum)" value={wonum} onChangeText={setWonum} />
      <InputField placeholder="Description" value={description} onChangeText={setDescription} />
      <InputField placeholder="Site ID" value={siteid} onChangeText={setSiteid} />
      <InputField placeholder="Location" value={location} onChangeText={setLocation} />
      <InputField placeholder="Status" value={status} onChangeText={setStatus} />

      <Button title={loading ? "Adding..." : "Add"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
});

export default AddWorkOrderScreen;
