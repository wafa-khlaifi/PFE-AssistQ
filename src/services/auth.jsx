// services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { Buffer } from 'buffer';
import { getErrorMessage } from '../utils/getErrorMessage';
import { getLoginUrl } from './apiConfig';

export const loginUser = async (username, password) => {
  try {
    // Vérification des champs vides
    if (!username || !password) {
      console.log("❌ Username ou mot de passe manquant");
      return { success: false, error: getErrorMessage("auth", "missing_credentials") };
    }

    // Nettoyage des anciennes données
    console.log("🔄 Nettoyage des anciennes données...");
    await AsyncStorage.removeItem('userData');
    await CookieManager.clearAll();

    // Appeler la fonction pour récupérer l'URL de login
    const loginUrl = await getLoginUrl();
    console.log("🌐 URL de login construite:", loginUrl);

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    console.log("🔑 Tentative de connexion avec Basic Auth...");
    console.log("🔑 Credentials (base64):", credentials);

    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'maxauth': credentials,
        'Accept': 'application/json',
      }
    });
    console.log("📥 Réponse reçue, status:", loginResponse.status);

    const responseText = await loginResponse.text();
    console.log("📄 Texte de la réponse:", responseText);

    let errorMessage = getErrorMessage("auth", "server_error");

    if (loginResponse.status === 200) {
      console.log("✅ Connexion réussie !");
      const cookies = await CookieManager.get(loginUrl);
      console.log("🍪 Cookies récupérés:", cookies);
      const sessionCookie = cookies.JSESSIONID?.value;
      console.log("🔍 Session cookie:", sessionCookie);

      if (!sessionCookie) {
        console.log("❌ Session cookie manquant");
        return { success: false, error: getErrorMessage("auth", "session_expired") };
      }

      // Sauvegarder les informations de session
      const userData = JSON.stringify({ username, password, sessionCookie });
      await AsyncStorage.setItem('userData', userData);
      console.log("💾 Identifiants sauvegardés:", { username, sessionCookie });

      return { success: true, sessionCookie };
    }

    // Gestion des erreurs renvoyées par l'API
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log("⚠️ Réponse JSON d'erreur:", jsonResponse);
      if (jsonResponse["oslc:Error"] && jsonResponse["oslc:Error"]["oslc:message"]) {
        errorMessage = jsonResponse["oslc:Error"]["oslc:message"];
        console.log("🔍 Message d'erreur spécifique:", errorMessage);
      }
    } catch (parseError) {
      console.error("❌ Impossible de parser l'erreur API:", parseError);
    }

    console.error(`❌ Erreur API (${loginResponse.status}):`, errorMessage);
    return { success: false, error: errorMessage };

  } catch (error) {
    console.error("❌ Erreur inattendue :", error);

    if (error.message.includes("Network request failed")) {
      return { success: false, error: getErrorMessage("api", "network_error") };
    } else if (error.message.includes("timeout")) {
      return { success: false, error: getErrorMessage("api", "timeout") };
    } else if (error.message.includes("unauthorized")) {
      return { success: false, error: getErrorMessage("api", "unauthorized") };
    } else {
      return { success: false, error: "Une erreur inattendue est survenue. Veuillez réessayer." };
    }
  }
};




// 📌 Fonction pour déconnecter l'utilisateur
export const logoutUser = async () => {
    try {
      console.log("🚪 Déconnexion en cours...");
      await AsyncStorage.removeItem('userData'); // Supprimer les données de connexion
      await CookieManager.clearAll(); // Supprimer les cookies
      console.log("✅ Déconnexion réussie !");
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
      return { success: false, error: error.message };
    }
  };
 
 