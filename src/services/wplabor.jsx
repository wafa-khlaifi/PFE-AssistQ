// services/wplaborService.js
import { getApiBase } from './apiConfig';

export const fetchWplaborByWorkorder = async (workorderid) => {
  try {
    // Récupère l'URL de base pour les WorkOrders (AQWO)
    const apiBase = await getApiBase(); // par exemple : 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/AQWO'
    // Construit l'URL finale pour récupérer les WPLabor du workorder spécifié
    const url = `${apiBase}/${workorderid}/wplabor?lean=1&oslc.select=*`;
    console.log("📡 Envoi de la requête GET vers :", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des WPLabor :", error);
    throw error;
  }
};


/**
 * Crée un nouveau WPLabor.
 * @param {string|number} workorderid - L'identifiant du workorder.
 * @param {Object} laborData - Les données du WPLabor à créer (sans wplaborid).
 *     Exemples de propriétés attendues :
 *       - apptrequired: boolean
 *       - quantity: number
 *       - ratehaschanged: boolean
 *       - rate: number
 *       - laborhrs: number
 *       - orgid: string
 *       - laborcode: string
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success, message } ou { success, error }.
 */
export const createWplabor = async (workorderid, laborData,sessionCookie) => {
    try {
        console.log("🔹 addlabor: workorderid =", workorderid);

      const apiBase = await getApiBase();
      const url = `${apiBase}/${workorderid}?lean=1`;
      console.log("🔵 Envoi de la requête vers:", url);
  
      // Génération d'un identifiant unique pour le WPLabor
      const wplaborid = Math.round(new Date().getTime() / 1000).toString();
  
      // Construction du body avec la structure attendue par l'API
      const requestPayload = {
        wplabor: [
          {
            wplaborid,
            ...laborData
          }
        ]
      };
  
      const requestBody = JSON.stringify(requestPayload);
      console.log("📤 createWplabor: Données envoyées =", requestBody);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'maxauth': 'bWF4YWRtaW46bWF4YWRtaW4xMjM="',
          'x-method-override': 'PATCH',
          'patchtype': 'MERGE',
          'Cookie': `JSESSIONID=${sessionCookie}`
        },
        body: requestBody
      });
  
      console.log("📩 createWplabor: Réponse de l'API, status =", response.status);
  
      if (response.status === 204) {
        console.log("✅ WPLabor ajouté avec succès.");
        return { success: true, message: "WPLabor ajouté avec succès." };
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur API :", response.status, errorText);
        throw new Error(errorText);
      }
  
      const responseData = await response.json();
      console.log("✅ API Response:", responseData);
      return { success: true, data: responseData };
  
    } catch (error) {
      console.error("❌ createWplabor: Erreur =", error.message);
      let errorMessage = "Une erreur inconnue s'est produite.";
  
      // On vérifie si le message d'erreur est au format JSON avant de tenter de le parser
      try {
        const errorJson = JSON.parse(error.message);
        if (errorJson.Error && errorJson.Error.message) {
          errorMessage = errorJson.Error.message;
        }
      } catch (e) {
        console.error("❌ Impossible de parser l'erreur :", e);
        // Si le parsing échoue, on utilise directement le message d'erreur
        errorMessage = error.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };
  