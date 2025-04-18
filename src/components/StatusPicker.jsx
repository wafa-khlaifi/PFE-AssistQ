import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const statuses = [
  { label: "Pending Approval", value: "WAPPR", color: "#FFB300" },
  { label: "Approved", value: "APPR", color: "#43A047" },
  { label: "Pending Scheduling", value: "WSCH", color: "#1E88E5" },
  { label: "Waiting for Materials", value: "WMATL", color: "#9C27B0" },
  { label: "Waiting Plant Condition", value: "WPCOND", color: "#FB8C00" },
  { label: "In Progress", value: "INPRG", color: "#00ACC1" },
  { label: "Completed", value: "COMP", color: "#00897B" },
  { label: "Closed", value: "CLOSE", color: "#607D8B" },
  { label: "Canceled", value: "CAN", color: "#E53935" }
];

const StatusPicker = ({ visible, onClose, onSelect, currentStatus }) => {
  const [selected, setSelected] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  // ✅ Réinitialiser `selected` au `currentStatus` chaque fois que le modal s'ouvre
  useEffect(() => {
    if (visible) {
      setSelected(currentStatus);
    }
  }, [visible, currentStatus]);
  console.log("stauts actuele " ,currentStatus)

  const handleStatusPress = (value) => {
    setSelected(value);
  };

  const handleConfirm = () => {
    if (selected) {
      setLoading(true);
      setTimeout(() => {
        onSelect(selected);
        setLoading(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Select a Status</Text>
          </View>
          
          {/* Status List with Selection */}
          {statuses.map(status => (
            <TouchableOpacity 
              key={status.value} 
              style={styles.statusOption} 
              onPress={() => handleStatusPress(status.value)}
            >
              <View 
                style={[
                  styles.circle, 
                  { 
                    borderColor: status.color, 
                    backgroundColor: selected === status.value ? status.color : 'transparent' 
                  }
                ]} 
              />
              <Text style={[
                styles.statusText,
                { fontWeight: selected === status.value ? 'bold' : 'normal' }
              ]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Confirm Button with Loading Indicator */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    width: 300 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    flex: 1,
    textAlign: 'center'
  },
  statusOption: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start'
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  statusText: { 
    fontSize: 16,
    color: '#333'
  },
  confirmButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#43A047',
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default StatusPicker;
