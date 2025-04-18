import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class ErrorBoundary extends Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  // Cette méthode permet de détecter une erreur dans les composants enfants
  static getDerivedStateFromError(error: Error) {
    // Met à jour l'état pour afficher l'UI d'erreur
    return { hasError: true };
  }

  // Si une erreur se produit, cette méthode est appelée
  componentDidCatch(error: Error, info: any) {
    // Tu peux logguer l'erreur ici pour la suivre si nécessaire
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Retourner une UI d'erreur lorsque l'erreur est capturée
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Une erreur est survenue.</Text>
          <Button title="Réessayer" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }

    // Si aucune erreur, afficher les enfants normalement
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
});

export default ErrorBoundary;
