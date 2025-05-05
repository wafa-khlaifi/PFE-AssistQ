// screens/CorrectiveActionsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchWorkOrderObject, buildModelInput } from '../services/workOrders';

// Base URL de votre backend
const BASE_URL = 'http://192.168.43.71:3000';

const CorrectiveActionsScreen = ({ route, navigation }) => {
  // 1) Récupère workorderid depuis la navigation
  console.log('[Screen] route.params:', route.params);
  const { workorderid } = route.params || {};
  console.log('[Screen] workorderid:', workorderid);

  // états locaux
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  // 2) Fonction de chargement et prédiction
  const loadAndPredict = async () => {
    console.log('[Predict] Debut loadAndPredict');
    setError(null);
    setRecommendation(null);
    setLoading(true);

    try {
      // 2.1) Récupère le sessionCookie stocké
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('[Predict] userDataString:', userDataString);
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const sessionCookie = userData.sessionCookie;
      console.log('[Predict] sessionCookie:', sessionCookie);
      if (!sessionCookie) {
        throw new Error("Session cookie manquant");
      }

      // 2.2) GET Maximo OSLC
      console.log('[Predict] Fetching WorkOrder via OSLC, id =', workorderid);
      const woObj = await fetchWorkOrderObject(workorderid, sessionCookie);
      console.log('[Predict] woObj reçu:', woObj);

      // 2.3) Prépare le payload IA (fréquence = 2)
      const payload = buildModelInput(woObj);
      console.log('[Predict] Payload IA construit:', payload);

      // 2.4) POST vers le backend
      const url = `${BASE_URL}/predict`;
      console.log('[Predict] Envoi POST vers:', url);
      console.log('[Predict] body POST:', JSON.stringify(payload));
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[Predict] Response status:', response.status);
      const text = await response.text();
      console.log('[Predict] Response raw text:', text);

      let data;
      try {
        data = JSON.parse(text);
        console.log('[Predict] Response JSON parse:', data);
      } catch (parseErr) {
        console.error('[Predict] JSON parse error:', parseErr);
        throw new Error('Réponse JSON invalide du serveur');
      }

      if (!response.ok) {
        const msg = data.error || `Erreur serveur (${response.status})`;
        throw new Error(msg);
      }

      console.log('[Predict] Recommendation reçue:', data.action);
      setRecommendation(data.action ?? JSON.stringify(data));

    } catch (err) {
      console.error('[Predict] Erreur attrapée:', err);
      setError(err.message);
    } finally {
      console.log('[Predict] Fin loadAndPredict');
      setLoading(false);
    }
  };

  // 3) Chargement initial et à chaque focus de l'écran
  useEffect(() => {
    console.log('[useEffect] workorderid changed:', workorderid);
    loadAndPredict();
  }, [workorderid]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('[useEffect] Screen focus, reload');
      loadAndPredict();
    });
    return unsubscribe;
  }, [navigation, workorderid]);

  // 4) Rendu
  return (
    <View style={styles.container}>
      <Header title="Corrective Actions" navigation={navigation} />

      {loading ? (
        <ActivityIndicator size="large" color="#00CFFF" style={styles.indicator} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={20} color="red" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {recommendation && (
            <View style={styles.resultBox}>
              <Ionicons name="bulb-outline" size={24} color="#00CFFF" />
              <Text style={styles.resultTitle}>Action recommandée :</Text>
              <Text style={styles.resultText}>{recommendation}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log('[UI] Bouton recalcule prédiction');
              loadAndPredict();
            }}
          >
            <Text style={styles.buttonText}>Recalculer la recommandation</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  indicator: { flex: 1, justifyContent: 'center' },
  content: { padding: 16, alignItems: 'center' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
    fontSize: 14
  },
  resultBox: {
    alignItems: 'center',
    backgroundColor: '#e8f7ff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%'
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#00CFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CorrectiveActionsScreen;
