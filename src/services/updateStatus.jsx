import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBase } from './apiConfig';

export const updateWorkOrderStatus = async (selectedWorkOrder, newStatus) => {
  try {
    // 1) Vérifications de base
    if (!selectedWorkOrder) {
      throw new Error("❌ Erreur : Aucune donnée de Work Order reçue.");
    }

    const workorderid = selectedWorkOrder.workorderid;
    const currentStatus = selectedWorkOrder.status;

    if (!workorderid) {
      throw new Error("❌ Erreur : Impossible de récupérer `workorderid`.");
    }
    if (!currentStatus) {
      throw new Error("❌ Erreur : Impossible de récupérer le statut actuel.");
    }
    if (!newStatus) {
      throw new Error("❌ Erreur : Nouveau statut manquant.");
    }

    // 2) Construction de l’URL d’update (à adapter selon votre configuration)
    const apiBase = await getApiBase();

    const updateUrl = `${apiBase}/${workorderid}?properties=status&lean=1`;

    // 3) Récupération du sessionCookie stocké (si nécessaire pour l’authentification Maximo)
    const storedData = await AsyncStorage.getItem('userData');
    const { sessionCookie } = JSON.parse(storedData) || {};

    // 4) Appel à l’API Maximo
    const response = await fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-method-override': 'PATCH',  // Pour patcher le Work Order
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}` // Authentification par cookie
      },
      body: JSON.stringify({ status: newStatus })
    });

    // 5) Gestion des erreurs de réponse
    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // La réponse est peut-être vide ou non-JSON
      }

      // On essaie de récupérer un message d'erreur lisible
      let errorMessage = "Erreur inconnue lors de la mise à jour";
      if (errorData?.Error?.message) {
        errorMessage = errorData.Error.message;
      } else if (errorData?.errorText) {
        errorMessage = errorData.errorText;
      }
      throw new Error(`⛔ Maximo : ${errorMessage}`);
    }

    // 6) Tenter de parser la réponse JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    console.log("✅ Réponse API Maximo reçue :", data);

    // 7) Retour d’une réponse personnalisée
    return {
      success: true,
      message: `✅ Statut mis à jour en ${newStatus}`,
      data
    };

  } catch (error) {
    console.error("🚨 Une erreur est survenue:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};
