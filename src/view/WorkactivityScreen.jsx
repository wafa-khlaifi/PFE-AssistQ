import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWoactivityByWorkOrderId } from '../services/woactivity';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkactivityScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadActivities = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      if (!sessionCookie) {
        throw new Error("Missing session cookie");
      }

      const response = await fetchWoactivityByWorkOrderId(workorderid, sessionCookie);
      if (response.success) {
        setActivities(response.data);
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Error loading WOActivity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workorderid) {
      loadActivities();
    }
  }, [workorderid]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadActivities();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Work Activities" navigation={navigation} />
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header title="Tasks" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.list}>
        {activities.map((item) => (
          <Card key={item.taskid || Math.random().toString()} style={styles.card}>
          <Card.Content>
          <View style={styles.taskIdContainer}>
             <Text style={styles.taskId}>Task ID: {item.taskid || 'N/A'}</Text>
             </View>       
             <Text style={styles.description}>{item.description || 'No description'}</Text>
            <View style={styles.detailRow}>
              <Ionicons name="timer-outline" size={18} color="#555" />
              <Text style={styles.detail}> Estimated Duration: {item.estdur || 'N/A'} hrs</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={item.status === 'COMP' ? 'green' : 'orange'} />
              <Text style={styles.detail}> Status: {item.status_description || item.status || 'Unknown'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#555" />
              <Text style={styles.detail}> Include in Schedule: {item.inctasksinsched ? 'Yes' : 'No'}</Text>
            </View>
          </Card.Content>
        </Card>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWoactivityScreen', { workorderid })}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  indicator: { marginTop: 20 },
  list: { padding: 16 },
  card: { marginBottom: 10, elevation: 2, borderRadius: 8, backgroundColor: '#FFF' },
  icon: { marginRight: 10 },
  description: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  detail: { fontSize: 14, color: '#555', marginLeft: 8 },
  taskId: { fontSize: 16, fontWeight: 'bold', color: '#007BFF', marginBottom: 5 },
  taskIdContainer: { alignItems: 'center', marginBottom: 5 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  }
});

export default WorkactivityScreen;
