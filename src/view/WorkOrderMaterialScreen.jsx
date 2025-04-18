import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWpmaterialByWorkOrderId } from '../services/wpmaterial';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';
// Remplacez MaterialCommunityIcons par Ionicons
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkOrderMaterialScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      if (!sessionCookie) {
        throw new Error("Missing session cookie");
      }
      console.log("Transmitted workorderid:", workorderid);

      const response = await fetchWpmaterialByWorkOrderId(workorderid, sessionCookie);
      if (response.success) {
        setMaterials(response.data);
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les données lorsque l'écran retrouve le focus
  useFocusEffect(
    useCallback(() => {
      loadMaterials();
    }, [workorderid])
  );

  // Navigation vers l'écran d'ajout d'un nouveau matériel
  const onAddMaterial = () => {
    navigation.navigate('AddMaterialScreen', { workorderid });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Materials" navigation={navigation} />
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Materials" navigation={navigation} />
      {materials.length === 0 ? (
        <Text style={styles.noDataText}>No materials found.</Text>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                {/* Entête: numéro d'item + badge du type de matériel */}
                <View style={styles.headerRow}>
                  <Text style={styles.itemNum}>
                    Item: {item.itemnum || 'N/A'}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {item.restype || 'AUTOMATIC'}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                  {item.description || 'No description'}
                </Text>
                
                {/* Emplacement et site de stockage */}
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    {/* Ionicons avec style outline */}
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {item.location || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {item.storelocsite || 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Quantité et coût */}
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="calculator-outline"
                      size={22}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.labelText}>Quantity: </Text>
                    <Text style={styles.infoText}>
                      {item.itemqty || 0}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="cash-outline"
                      size={22}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.labelText}>Cost: </Text>
                    <Text style={styles.infoText}>
                      {item.linecost || 'N/A'}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}
      
      {/* Bouton flottant pour ajouter un nouveau matériel */}
      <TouchableOpacity style={styles.fab} onPress={onAddMaterial}>
        <Ionicons name="add-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F0F2F5' 
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
    padding: 16 
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
  itemNum: {
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
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    flex: 1,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
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

export default WorkOrderMaterialScreen;
