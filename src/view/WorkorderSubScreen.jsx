import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../components/Header';
import WorkOrderCard from '../components/WorkOrderCard';
import StatusPicker from '../components/StatusPicker';
import { updateWorkOrderStatus } from '../services/updateStatus';

const subObjects = [
  { name: 'Tasks', icon: 'list-outline', key: 'woactivity' },
  { name: 'Worklog', icon: 'document-text-outline', key: 'worklog' },
  { name: 'Labor', icon: 'briefcase-outline', key: 'labor' },
  { name: 'Labor Transaction', icon: 'time-outline', key: 'labortransaction' },
  { name: 'Material', icon: 'cube-outline', key: 'material' },
  { name: 'Material Transaction', icon: 'analytics-outline', key: 'matusetransation' },
  { name: 'Attachments', icon: 'link-outline', key: 'doclinks' },
];

// Petit composant réutilisable pour un bouton
function SubObjectButton({ item, onPress }) {
  if (!item) return null; // sécurité si jamais l'item est vide

  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item.key)}>
      <Ionicons
        name={item.icon}
        size={24}
        color="#007BFF"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const WorkorderSubScreen = ({ navigation, route }) => {
  const { workOrder } = route.params || {};
  const [currentWorkOrder, setCurrentWorkOrder] = useState(workOrder);
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);

  // -- Mise à jour du statut
  const handleStatusSelect = async (newStatus) => {
    setStatusPickerVisible(false);
    const result = await updateWorkOrderStatus(currentWorkOrder, newStatus);
    if (result.success) {
      setCurrentWorkOrder({ ...currentWorkOrder, status: newStatus });
      Alert.alert("Success", `Status updated to ${newStatus}`);
    } else {
      Alert.alert("Error", result.error || "Update failed.");
    }
  };

  const handleStatusPress = () => {
    setStatusPickerVisible(true);
  };

  // -- Navigation vers les sous-écrans
  const handlePress = (key) => {
    if (!currentWorkOrder?.workorderid) return;
    const screens = {
      worklog: 'WorkLogDetailsScreen',
      doclinks: 'AttachmentsScreen',
      material: 'WorkOrderMaterialScreen',
      labor: 'WplaborScreen',
      woactivity: 'WorkactivityScreen',
      matusetransation: 'MatusetransScreen',
      labortransaction: 'labtransScreen',
    };
    if (screens[key]) {
      navigation.navigate(screens[key], { workorderid: currentWorkOrder.workorderid });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Work Order Details" navigation={navigation} />

      <WorkOrderCard
        workOrder={currentWorkOrder}
        onPress={() => console.log('Card pressed')}
        onStatusPress={handleStatusPress}
      />

      {/* 
        4 lignes manuelles :
         - Lignes 1,2,3 => 2 boutons chacune
         - Ligne 4 => 1 bouton centré
      */}

      {/* Ligne 1 */}
      <View style={styles.row}>
        <SubObjectButton item={subObjects[0]} onPress={handlePress} />
        <SubObjectButton item={subObjects[1]} onPress={handlePress} />
      </View>

      {/* Ligne 2 */}
      <View style={styles.row}>
        <SubObjectButton item={subObjects[2]} onPress={handlePress} />
        <SubObjectButton item={subObjects[3]} onPress={handlePress} />
      </View>

      {/* Ligne 3 */}
      <View style={styles.row}>
        <SubObjectButton item={subObjects[4]} onPress={handlePress} />
        <SubObjectButton item={subObjects[5]} onPress={handlePress} />
      </View>

      {/* Ligne 4 (7ᵉ bouton centré) */}
      <View style={[styles.row, { justifyContent: 'center' }]}>
        <SubObjectButton item={subObjects[6]} onPress={handlePress} />
      </View>

      <StatusPicker
        visible={statusPickerVisible}
        onClose={() => setStatusPickerVisible(false)}
        onSelect={handleStatusSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 20,
    padding:10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // ou 'space-between'
    alignItems: 'center',
    marginVertical: 5,
  },
  item: {
    width: '45%',          // Chaque bouton occupe ~ la moitié de la ligne
    height: 90,           // Hauteur identique pour tous
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, // ✅ Ajout d'un padding horizontal pour éviter la coupure du texte
  },
  icon: {
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',  // ✅ Ajout pour centrer le texte sur plusieurs lignes
  },
});

// ✅ Pour le bouton unique (Ligne 4 - Material Transaction)
<View style={[styles.row, { justifyContent: 'center' }]}>
  <TouchableOpacity style={[styles.item, { width: '80%' }]} onPress={() => handlePress('matusetransation')}>
    <Ionicons name="analytics-outline" size={24} color="#007BFF" style={styles.icon} />
    <Text style={styles.buttonText}>Material Transaction</Text> {/* ✅ Centré */}
  </TouchableOpacity>
</View>

export default WorkorderSubScreen;
