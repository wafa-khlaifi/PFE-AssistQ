import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMatusetransByWorkOrderId } from '../services/matusetrans';
import Header from '../components/Header';

const MatusetransScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null); // Gérer l'expansion des cartes

  const loadMaterials = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      if (!sessionCookie) {
        throw new Error("Cookie de session manquant");
      }

      const response = await fetchMatusetransByWorkOrderId(workorderid, sessionCookie);
      if (response.success) {
        setMaterials(response.data);
      } else {
        console.error("Erreur :", response.error);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des matériaux :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workorderid) {
      loadMaterials();
    }
  }, [workorderid]);

  // Fonction pour gérer l'ouverture/fermeture des cartes accordéon
  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      {/* En-tête de la carte (clic pour déplier/replier) */}
      <TouchableOpacity onPress={() => toggleExpand(item.matusetransid)} style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Ionicons name="cube-outline" size={22} color="#007BFF" />
          <Text style={styles.itemText}>{item.itemnum || "N/A"}</Text>
        </View>
        <Ionicons 
          name={expandedCard === item.matusetransid ? "chevron-up-outline" : "chevron-down-outline"} 
          size={24} 
          color="#555" 
        />
      </TouchableOpacity>

      {/* Contenu de la carte (visible seulement si elle est ouverte) */}
      {expandedCard === item.matusetransid && (
        <Card.Content>
          <View style={styles.detailRow}>
            <Ionicons name="information-circle-outline" size={20} color="#555" />
            <Text style={styles.detailText}>{item.description || "No description"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#555" />
            <Text style={styles.detailText}>Transaction Type: {item.issuetype || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={20} color="#555" />
            <Text style={styles.detailText}>Storeroom: {item.storeloc || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="stats-chart-outline" size={20} color="#555" />
            <Text style={styles.detailText}>Quantity: {Math.abs(item.quantity) || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="grid-outline" size={20} color="#555" />
            <Text style={styles.detailText}>Bin: {item.binnum || "N/A"}</Text>
          </View>
        </Card.Content>
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Material Transactions" navigation={navigation} />
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      </View>
    );
  }

  if (materials.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Material Transactions" navigation={navigation} />
        <Text style={styles.noDataText}>No material transactions found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Material Transactions" navigation={navigation} />
      <FlatList
        data={materials}
        keyExtractor={(item) => item.matusetransid ? item.matusetransid.toString() : Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Floating Action Button (FAB) pour ajouter un nouvel enregistrement */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMatusetransScreen', { workorderid })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default MatusetransScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  indicator: {
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#007BFF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
