// src/views/WorkOrdersScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import WorkOrderCard from '../components/WorkOrderCard';
import StatusPicker from '../components/StatusPicker';
// On importe le hook
import { useWorkOrdersViewModel } from '../viewModel/useWorkOrders';

const WorkOrdersScreen = ({ navigation }) => {
  // On utilise le hook pour récupérer la logique (MVVM)
  const {
    workOrders,
    loading,
    loadingMore,
    modalVisible,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleStatusPress,
    updateStatus,
    handleLogout,
    loadWorkOrders,
    setModalVisible,
    page,
    
  } = useWorkOrdersViewModel(navigation);

  return (
    <View style={styles.container}>
  <Header
        title="Work Orders"
        rightComponent={
          <Ionicons name="log-out-outline" size={28} color="#007BFF" />
        }
        onPressRight={handleLogout}
      />

      {/* Barre de recherche */}
      <View style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Entrer le WONUM..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* Liste des Work Orders */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={workOrders}
          keyExtractor={(item, index) => `wo-${item.workorderid}-${index}`}
          renderItem={({ item }) => (
            <WorkOrderCard
              workOrder={item}
              onStatusPress={() => handleStatusPress(item)}
              onPress={() =>
                // Modification ici pour naviguer vers WorkorderSubScreen
                navigation.navigate('WorkorderSubScreen', { workOrder: item })
              }
            />
          )}
          onEndReached={() => loadWorkOrders(page)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#007BFF" />
            ) : null
          }
        />
      )}

      {/* Bouton flottant pour ajouter un Work Order */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkOrder')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal de changement de statut */}
      <StatusPicker
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={updateStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#F8F9F8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: { position: 'absolute', right: 15 },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    elevation: 30,
   // shadowColor: '#000',
   // shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 5,
   // paddingHorizontal: 1,
   // marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  searchIconContainer: {
    padding: 8,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
});

export default WorkOrdersScreen;