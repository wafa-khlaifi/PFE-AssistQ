import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchLabTransByWorkOrderId } from '../services/LabTransService';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LabTransScreen = ({ navigation, route }) => {
  const workorderid = route?.params?.workorderid; // Récupère l'ID du Work Order

  const [labTransData, setLabTransData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les transactions de main-d'œuvre (LabTrans) associées au Work Order
  const fetchLabTrans = async () => {
    setLoading(true);
    setError(null);
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;

      if (!workorderid) {
        setError("Work Order ID not defined.");
        setLoading(false);
        return;
      }
      if (!sessionCookie) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const data = await fetchLabTransByWorkOrderId(workorderid, sessionCookie);
      if (data.success) {
        setLabTransData(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while loading the data.");
    } finally {
      setLoading(false);
    }
  };

  // Actualise les données lorsque l'écran est en focus
  useFocusEffect(
    useCallback(() => {
      fetchLabTrans();
    }, [workorderid])
  );

  // Affichage de chaque carte de LabTrans
  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Ligne du haut : Labor Code à gauche + cercle icône à droite */}
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-circle-outline" size={20} color="#555" style={styles.icon} />
            <Text style={styles.cardLabel}>Labor Code:</Text>
            <Text style={styles.cardValue}>{item.laborcode || "N/A"}</Text>
          </View>

          {/* Petit cercle à droite avec icône check ou close */}
          <View style={[
            styles.smallCircle,
            item.approved ? styles.circleApproved : styles.circleRejected
          ]}>
            <Ionicons
              name={item.approved ? "checkmark" : "close"}
              size={16}
              color="#fff"
            />
          </View>
        </View>

        {/* Regular Hours */}
        <View style={styles.cardRow}>
          <Ionicons name="briefcase-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.cardLabel}>Regular Hours:</Text>
          <Text style={styles.cardValue}>
            {item.regularhrs !== undefined ? item.regularhrs : "N/A"}
          </Text>
        </View>

        {/* Rate */}
        <View style={styles.cardRow}>
          <Ionicons name="cash-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.cardLabel}>Rate:</Text>
          <Text style={styles.cardValue}>
            {item.payrate !== undefined ? `${item.payrate} €` : "N/A"}
          </Text>
        </View>

        {/* Entry Date */}
        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.cardLabel}>Entry Date:</Text>
          <Text style={styles.cardValue}>
            {item.enterdate ? item.enterdate.split('T')[0] : "N/A"}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.cardLabel}>Location:</Text>
          <Text style={styles.cardValue}>{item.location || "N/A"}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Labor Transaction" navigation={navigation} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading labor transactions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : labTransData.length > 0 ? (
        <FlatList
          data={labTransData}
          keyExtractor={(item, index) =>
            item.labtransid ? item.labtransid.toString() : index.toString()
          }
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No labor transactions found.</Text>
        </View>
      )}

      {/* Floating Action Button (FAB) pour ajouter un nouveau LabTrans */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddLabTransScreen', { workorderid })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default LabTransScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  cardLabel: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#333',
  },
  cardValue: {
    marginLeft: 4,
    color: '#555',
  },
  icon: {
    marginRight: 6,
  },
  smallCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleApproved: {
    backgroundColor: 'green',
  },
  circleRejected: {
    backgroundColor: '#FF6666',
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
