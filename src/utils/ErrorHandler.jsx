import { Alert } from 'react-native';

// ✅ Gestionnaire Global d'Erreurs
export const handleError = (error) => {
  if (!error || !error.message) return;

  console.error("🚨 Erreur capturée :", error.message);

  // 🔥 Vérifier si l'erreur est déjà affichée via Alert
  if (error.message.includes("Maximo") || error.message.includes("Work Order")) {
    Alert.alert("⛔ Maximo", error.message);
  } else {
    Alert.alert("❌ Erreur", "Une erreur est survenue. Vérifiez votre connexion et réessayez.");
  }
};
