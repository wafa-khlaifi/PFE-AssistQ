import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { List, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAttachmentsByWorkorderId } from '../services/Attachment';
import { useFocusEffect } from '@react-navigation/native';

const AttachmentsScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttachments = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      if (!sessionCookie) {
        throw new Error("Missing session cookie");
      }
      const data = await fetchAttachmentsByWorkorderId(workorderid, sessionCookie);
      setAttachments(data);
    } catch (error) {
      console.error("Error loading attachments:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAttachments();
    }, [workorderid])
  );

  const renderAttachmentItem = ({ item }) => (
    <Card style={styles.card}>
      <List.Accordion
        title={<Text style={styles.cardTitle}>{item.fileName}</Text>}
        left={props => <MaterialCommunityIcons name="file-document-outline" size={24} color="#007BFF" />}>
        <Card.Content>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="file-document" size={20} color="#555" />
            <Text style={styles.detail}> Description: {item.description || 'No description'}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account" size={20} color="#555" />
            <Text style={styles.detail}> Created By: {item.createby || 'Unknown'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.detail}> Entry Date: {item.created ? item.created.split('T')[0] : "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="file-cabinet" size={20} color="#555" />
            <Text style={styles.detail}> Doc Type: {item.docType || 'N/A'}</Text>
          </View>
        </Card.Content>
      </List.Accordion>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Attachments" navigation={navigation} />
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.indicator} />
      ) : attachments.length > 0 ? (
        <FlatList
          data={attachments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAttachmentItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noDataText}>No attachments found.</Text>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddAttachmentScreen", { workorderid })}>
        <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 10,
  },
  indicator: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFF',
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AttachmentsScreen;
