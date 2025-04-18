// src/viewModel/useWorkOrdersViewModel.js
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { logoutUser } from '../services/auth';
import { fetchWorkOrders, fetchWorkOrderByWonum } from '../services/workOrders';
import { updateWorkOrderStatus } from '../services/updateStatus';

export const useWorkOrdersViewModel = (navigation) => {
  // --- État local (ex-"useState" de WorkOrdersScreen) ---
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Au montage, on charge la première page ---
  useEffect(() => {
    loadWorkOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Charger les Work Orders par page ---
  const loadWorkOrders = async (pageNumber) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const response = await fetchWorkOrders(pageNumber);
    if (response.success) {
      setWorkOrders((prevOrders) => [
        ...(pageNumber === 1 ? [] : prevOrders),
        ...response.workOrders.map((item, index) => ({
          ...item,
          id: `${item.wonum || index}`,
          index: prevOrders.length + index + 1,
        })),
      ]);
      setPage(pageNumber + 1);
      setHasMore(response.hasMore);
    } else {
      Alert.alert("Erreur", response.error);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  // --- Recherche par WONUM ---
  const handleSearch = async () => {
    if (!searchQuery) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de Work Order.");
      return;
    }
    setLoading(true);
    const response = await fetchWorkOrderByWonum(searchQuery);
    if (response.success) {
      setWorkOrders(response.workOrders);
    } else {
      Alert.alert("Erreur", response.error);
    }
    setLoading(false);
  };

  // --- Sélection d’un Work Order pour changer son statut ---
  const handleStatusPress = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setModalVisible(true);
  };

  const updateStatus = async (newStatus) => {
    if (!selectedWorkOrder) return;
    const response = await updateWorkOrderStatus(selectedWorkOrder, newStatus);
    if (response.success) {
      // Met à jour la liste localement
      setWorkOrders((prevOrders) =>
        prevOrders.map((wo) =>
          wo.workorderid === selectedWorkOrder.workorderid
            ? { ...wo, status: newStatus }
            : wo
        )
      );
      Alert.alert("Succès", `Statut mis à jour en ${newStatus}`);
    } else {
      Alert.alert("Erreur", response.error);
    }
    setModalVisible(false);
  };

  // --- Déconnexion ---
  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      navigation.replace('Login');
    } else {
      Alert.alert("Erreur", response.error);
    }
  };

  // --- On renvoie tout ce qui est utile à la View ---
  return {
    workOrders,
    loading,
    loadingMore,
    page,
    hasMore,
    modalVisible,
    selectedWorkOrder,
    searchQuery,
    setSearchQuery,
    loadWorkOrders,
    handleSearch,
    handleStatusPress,
    updateStatus,
    handleLogout,
    setModalVisible,
  };
};
