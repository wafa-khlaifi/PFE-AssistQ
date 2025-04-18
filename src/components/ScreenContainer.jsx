import React from 'react';
import { View, StyleSheet } from 'react-native';

const ScreenContainer = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',  // ✅ Ajouté pour centrer verticalement
    alignSelf: 'center',    
  },
});

export default ScreenContainer;
