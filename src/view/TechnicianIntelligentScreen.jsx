import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';

export default function TechnicianIntelligentScreen({ navigation, route }) {
  // Récupère le workorderid passé depuis l'écran précédent
  const { workorderid } = route.params || {};

  const features = [
    { key: 'correctiveActions',   label: 'Corrective Actions',         icon: 'build',            screen: 'CorrectiveActionsScreen' },
    { key: 'spareParts',          label: 'Spare Parts',                icon: 'inventory',        screen: 'SparePartsScreen' },
    { key: 'technicalChatbot',    label: 'Technical Chatbot',          icon: 'chat',             screen: 'TechnicalChatbotScreen' },
    { key: 'visualDetection',     label: 'Visual Detection',           icon: 'camera-alt',       screen: 'VisualDetectionScreen' },
    { key: 'equipmentScan',       label: 'Equipment Identification',   icon: 'qr-code-scanner',  screen: 'EquipmentScanScreen' },
    { key: 'translation',         label: 'Translation',                icon: 'translate',        screen: 'TranslationScreen' },
  ];

  const renderFeatureCard = (item) => (
    <TouchableOpacity
      key={item.key}
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.screen, { workorderid })
      }
    >
      <MaterialIcons name={item.icon} size={32} color="#007BFF" />
      <Text style={styles.cardText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Technical Assistant" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.grid}>
        {features.map(renderFeatureCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});
