// services/woactivityService.js
import { getApiBase } from './apiConfig';

/**
 * Ajuste l'URL pour remplacer "http://localhost" par votre domaine réel.
 * @param {string} url - L'URL retournée par l'API.
 * @returns {string} - L'URL corrigée.
 */
const adjustLocalRef = (url) => {
  return url.replace('http://localhost', 'http://maxgps.smartech-tn.com:9876');
};

/**
 * Récupère tous les détails des WOActivity pour un workorder donné via son workorderid.
 * @param {string|number} workorderid - L'identifiant du work order.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success, data } ou { success, error }.
 */
export const fetchWoactivityByWorkOrderId = async (workorderid, sessionCookie) => {
  try {
    // Récupération de l'URL de base (par exemple, 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/AQWO')
    const apiBase = await getApiBase();
    // Construction de l'URL de la collection des WOActivity pour ce workorder
    const collectionUrl = `${apiBase}/${workorderid}/woactivity?lean=1`;
    console.log("fetchWoactivityByWorkOrderId: URL de la collection =", collectionUrl);
    console.log("fetchWoactivityByWorkOrderId: sessionCookie =", sessionCookie);

    // Récupération de la collection de références (localref)
    const collectionResponse = await fetch(collectionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      },
    });
    console.log("fetchWoactivityByWorkOrderId: Réponse de la collection, status =", collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error(`Erreur lors de la récupération de la collection de WOActivity : ${collectionResponse.status}`);
    }

    const collectionData = await collectionResponse.json();
    console.log("fetchWoactivityByWorkOrderId: Données de la collection =", collectionData);
    
    const localRefs = collectionData.member || [];
    console.log("fetchWoactivityByWorkOrderId: Nombre de WOActivity trouvés =", localRefs.length);

    // Pour chaque localref, récupération des détails du WOActivity
    const woactivities = await Promise.all(
      localRefs.map(async (refObj, index) => {
        let detailUrl = adjustLocalRef(refObj.localref);
        console.log(`fetchWoactivityByWorkOrderId: Traitement du WOActivity ${index + 1} avec detailUrl =`, detailUrl);
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': `JSESSIONID=${sessionCookie}`,
          },
        });
        console.log(`fetchWoactivityByWorkOrderId: Réponse du détail pour WOActivity ${index + 1}, status =`, detailResponse.status);
        if (!detailResponse.ok) {
          throw new Error(`Erreur lors de la récupération du WOActivity à ${detailUrl} : ${detailResponse.status}`);
        }
        const detailData = await detailResponse.json();
        console.log(`fetchWoactivityByWorkOrderId: Données du WOActivity ${index + 1} =`, detailData);
        return detailData;
      })
    );

    console.log("fetchWoactivityByWorkOrderId: Tous les WOActivity récupérés =", woactivities);
    return {
      success: true,
      data: woactivities,
    };
  } catch (error) {
    console.error("Erreur dans fetchWoactivityByWorkOrderId :", error);
    return {
      success: false,
      error: error.message,
    };
  }
};



/**
 * Crée un nouveau WOActivity pour un workorder donné.
 * @param {string|number} workorderid - L'identifiant du work order.
 * @param {Object} activityData - Les données du WOActivity à créer.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success, message } ou { success, error }.
 */
export const createWoactivity = async (workorderid, activityData, sessionCookie) => {
    try {
      // Récupération de l'URL de base
      const apiBase = await getApiBase();
      const url = `${apiBase}/${workorderid}/woactivity`;
  
      console.log("🔵 Envoi de la requête vers:", url);
  
      // Construction du body au format demandé
      const requestBody = JSON.stringify(activityData); // Utilisation directe des données passées
      console.log("📤 addWorkLog: Données envoyées =", requestBody);
  
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
  
    console.log("📩 addWorkLog: Réponse de l'API, status =", response.status);

    if (response.status === 204) {
      console.log("✅ tache ajouté avec succès.");
      return { success: true, message: "tache ajouté avec succès." };
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
    console.error("❌ addtache: Erreur brute =", error.message);
  
    let errorMessage = "Une erreur inconnue s'est produite.";
  
    try {
      // Parser l'erreur en JSON si possible
      const errorJson = JSON.parse(error.message);
      if (errorJson.Error && errorJson.Error.message) {
        errorMessage = errorJson.Error.message;
      }
    } catch (e) {
      console.error("❌ Impossible de parser l'erreur :", e);
    }
  
    return { success: false, error: errorMessage };
  }
  
  
};
