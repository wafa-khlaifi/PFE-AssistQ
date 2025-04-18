import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchWplaborByWorkorder } from '../services/wplabor';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

const WplaborScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [wplaborData, setWplaborData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWplabor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWplaborByWorkorder(workorderid);
      // On s'attend à recevoir un tableau dans data.member
      setWplaborData(data.member || []);
    } catch (error) {
      console.error("Error loading labor data:", error);
    } finally {
      setLoading(false);
    }
  }, [workorderid]);

  useFocusEffect(
    useCallback(() => {
      loadWplabor();
    }, [loadWplabor])
  );

  const renderItem = ({ item }) => {
    const task = item.task || 'N/A';
    const laborCode = item.laborcode || 'N/A';
    const crew = item.crew || 'N/A';

    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* En-tête : Task et badge Labor Code */}
          <View style={styles.headerRow}>
            <Text style={styles.taskText}>Task: {task}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{laborCode}</Text>
            </View>
          </View>

          {/* Première rangée : Quantity (gauche) + Crew (droite) */}
          <View style={styles.infoRow}>
            <View style={styles.infoItemLeft}>
              <Ionicons
                name="calculator-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.labelText}>Quantity: </Text>
              <Text style={styles.infoText}>{item.quantity ?? 'N/A'}</Text>
            </View>

            <View style={styles.infoItemRight}>
              <Ionicons
                name="people-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.labelText}>Crew: </Text>
              <Text style={styles.infoText}>{crew}</Text>
            </View>
          </View>

          {/* Deuxième rangée : Regular Hours (gauche) + Rate (droite) */}
          <View style={styles.infoRow}>
            <View style={styles.infoItemLeft}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.labelText}>Regular Hours: </Text>
              <Text style={styles.infoText}>{item.laborhrs ?? 'N/A'}</Text>
            </View>

            <View style={styles.infoItemRight}>
              <Ionicons
                name="cash-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.labelText}>Rate: </Text>
              <Text style={styles.infoText}>{item.rate ?? 'N/A'}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const onAddWplabor = () => {
    navigation.navigate('AddWplaborScreen', { workorderid });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Labor" navigation={navigation} />
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Labor" navigation={navigation} />
      {wplaborData.length === 0 ? (
        <Text style={styles.noDataText}>No labor data available.</Text>
      ) : (
        <FlatList
          data={wplaborData}
          keyExtractor={(item) => item.wplaborid.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={onAddWplabor}>
        <Ionicons name="add-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

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
    paddingBottom: 100,
  },
  card: { 
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#E0F7FA',
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Chaque rangée
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  // Bloc de gauche
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,     // petit espace à droite
    flexShrink: 1,       // autorise le texte à se réduire au besoin
  },
  // Bloc de droite
  infoItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,       // autorise le texte à se réduire au besoin
  },
  icon: {
    marginRight: 6,
  },
  labelText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default WplaborScreen;
