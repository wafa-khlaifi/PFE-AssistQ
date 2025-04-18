import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, navigation }) => {
  return (
    <View style={styles.header}>
      {/* 🔙 Bouton Retour si possible */}
      {navigation?.canGoBack() ? (
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={28} color="#000" />
  </TouchableOpacity>
) : (
  <View style={styles.placeholder} /> 
)}


      {/* 🏷️ Titre de l'écran */}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', // Alignement horizontal
    alignItems: 'center', // Centrer verticalement
    backgroundColor: '#FFF', // Fond blanc
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40, // Largeur fixe pour éviter le déplacement du titre
    alignItems: 'center', // Centrer l'icône
  },
  placeholder: {
    width: 40, // Réserve l'espace du bouton retour si absent
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // ✅ Titre en noir
    textAlign: 'center', // Centre le texte dans l'espace disponible
    flex: 1, // Permet de bien centrer le texte même avec la flèche
  },
});

export default Header;
