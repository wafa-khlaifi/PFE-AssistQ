import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, navigation, rightComponent, onPressRight }) => {
  return (
    <View style={styles.header}>
      {/* 🔙 Bouton Retour si possible */}
      {navigation?.canGoBack() ? (
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      {/* 🏷️ Titre de l'écran */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* 💡 Composant droit (icône IA) ou placeholder */}
      {rightComponent ? (
        <TouchableOpacity style={styles.sideButton} onPress={onPressRight}>
          {rightComponent}
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  sideButton: {
    width: 40,
    alignItems: 'center',
  },
  sidePlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
});

export default Header;
