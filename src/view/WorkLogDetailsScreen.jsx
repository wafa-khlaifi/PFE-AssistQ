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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWorkLogsByWorkOrderId } from '../services/WorkLog';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

const WorkLogDetailsScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWorkLogs = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      if (!sessionCookie) {
        throw new Error("Missing session cookie");
      }
      console.log("Transmitted workorderid:", workorderid);

      const response = await fetchWorkLogsByWorkOrderId(workorderid, sessionCookie);
      if (response.success) {
        setWorkLogs(response.data);
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Error loading work logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir la liste des worklogs à chaque retour sur l'écran
  useFocusEffect(
    useCallback(() => {
      if (workorderid) {
        loadWorkLogs();
      }
    }, [workorderid])
  );

  const handleAddWorkLog = () => {
    navigation.navigate('AddWorkLogScreen', { workorderid });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Work Logs" navigation={navigation} />
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      </View>
    );
  }

  if (workLogs.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Work Logs" navigation={navigation} />
        <Text style={styles.noDataText}>No work logs found.</Text>
        <TouchableOpacity style={styles.fab} onPress={handleAddWorkLog}>
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Work Logs" navigation={navigation} />
      <FlatList
        data={workLogs}
        keyExtractor={(item) => item.worklogid.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={`Work Log ID: ${item.worklogid}`}
             
            />
            <Card.Content>
              <Text style={styles.description}>
                Description:{item.description || "No description"}
              </Text>
              <Text style={styles.info}>Created by: {item.createby}</Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity style={styles.fab} onPress={handleAddWorkLog}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
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
    marginBottom: 16 
  },
  description: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  info: { 
    fontSize: 14, 
    color: '#555' 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default WorkLogDetailsScreen;
