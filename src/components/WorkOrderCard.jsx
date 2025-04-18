import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkOrderCard = ({ workOrder, onPress, onStatusPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* En-tête : Numéro de WO et badge de statut */}
      <View style={styles.header}>
        <Text style={styles.wonum}>wonum: {workOrder.wonum}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onStatusPress();
          }}
          style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}
        >
          <Text style={styles.statusText}>{workOrder.status}</Text>
        </TouchableOpacity>
      </View>
      {/* Description */}
      <Text style={styles.description}>{workOrder.description}</Text>
      {/* Section des détails en deux colonnes */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#888" />
          <Text style={styles.detailText}>{workOrder.location || 'N/A'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="pricetag-outline" size={16} color="#888" />
          <Text style={styles.detailText}>{workOrder.assetnum || 'N/A'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="business-outline" size={16} color="#888" />
          <Text style={styles.detailText}>{workOrder.siteid || 'N/A'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="alert-circle-outline" size={16} color="#888" />
          <Text style={styles.detailText}>Priority: {workOrder.calcpriority || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'WAPPR': return '#FFB300';
    case 'APPR': return '#43A047';
    case 'WSCH': return '#1E88E5';
    case 'WMATL': return '#9C27B0';
    case 'WPCOND': return '#FB8C00';
    case 'INPRG': return '#00ACC1';
    case 'COMP': return '#00897B';
    case 'CLOSED': return '#607D8B';
    case 'CAN': return '#E53935';
    default: return '#6c757d';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 1,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wonum: {
    fontSize: 18, // Taille réduite par rapport à la version précédente
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
});

export default WorkOrderCard;
