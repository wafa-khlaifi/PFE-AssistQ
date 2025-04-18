// services/apiConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE_URL = 'http://maxgps.smartech-tn.com:9876/maximo/oslc';

export const getBaseUrl = async () => {
  const storedBaseUrl = await AsyncStorage.getItem('baseUrl');
  return storedBaseUrl || DEFAULT_BASE_URL;
};

export const getLoginUrl = async () => {
  const baseUrl = await getBaseUrl();
  return `${baseUrl}/login`;
};


// Construit l'URL de base pour les WorkOrders (API)
export const getApiBase = async () => {
  const baseUrl = await getBaseUrl();
  // Ici, vous pouvez définir l'endpoint selon votre logique. Par exemple :
  return `${baseUrl}/os/AQWO`;
};

// Construit l'URL pour un workorder spécifique
export const getWorkOrderUrl = async (workorderid) => {
  const apiBase = await getApiBase();
  return `${apiBase}/${workorderid}`;
};
