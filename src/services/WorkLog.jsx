// WorkLogService.js
import { getApiBase } from './apiConfig';

/**
 * Ajuste l'URL pour remplacer "localhost" par le domaine réel.
 * @param {string} url - L'URL retournée par l'API.
 * @returns {string} - L'URL corrigée.
 */
const adjustLocalRef = (url) => {
  // Remplace "http://localhost" par "http://maxgps.smartech-tn.com:9876"
  return url.replace('http://localhost', 'http://maxgps.smartech-tn.com:9876');
};

/**
 * Récupère tous les détails des work logs pour un work order donné via son workorderid.
 * @param {string|number} workorderid - L'identifiant du work order.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet avec { success, data } ou { success, error }.
 */
export const fetchWorkLogsByWorkOrderId = async (workorderid, sessionCookie) => {
  try {
    console.log("fetchWorkLogsByWorkOrderId: workorderid =", workorderid);

    // Construction de l'URL de la collection des work logs
    const apiBase = await getApiBase();
    const collectionUrl = `${apiBase}/${workorderid}/worklog?lean=1`;
    console.log("fetchWorkLogsByWorkOrderId: URL de la collection =", collectionUrl);
    console.log("fetchWorkLogsByWorkOrderId: sessionCookie =", sessionCookie);

    // Récupérer la collection de références (localref)
    const collectionResponse = await fetch(collectionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      },
    });
    console.log("fetchWorkLogsByWorkOrderId: Réponse de la collection, status =", collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error(`Erreur lors de la récupération de la collection de work logs : ${collectionResponse.status}`);
    }

    const collectionData = await collectionResponse.json();
    console.log("fetchWorkLogsByWorkOrderId: Données de la collection =", collectionData);
    
    const localRefs = collectionData.member || [];
    console.log("fetchWorkLogsByWorkOrderId: Nombre de work logs trouvés =", localRefs.length);

    // Pour chaque localref, récupérer les détails du work log
    const workLogs = await Promise.all(
      localRefs.map(async (refObj, index) => {
        let detailUrl = adjustLocalRef(refObj.localref);
        console.log(`fetchWorkLogsByWorkOrderId: Traitement du work log ${index + 1} avec detailUrl =`, detailUrl);
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': `JSESSIONID=${sessionCookie}`,
          },
        });
        console.log(`fetchWorkLogsByWorkOrderId: Réponse du détail pour work log ${index + 1}, status =`, detailResponse.status);
        if (!detailResponse.ok) {
          throw new Error(`Erreur lors de la récupération du work log à ${detailUrl} : ${detailResponse.status}`);
        }
        const detailData = await detailResponse.json();
        console.log(`fetchWorkLogsByWorkOrderId: Données du work log ${index + 1} =`, detailData);
        return detailData;
      })
    );

    console.log("fetchWorkLogsByWorkOrderId: Tous les work logs récupérés =", workLogs);
    return {
      success: true,
      data: workLogs,
    };
  } catch (error) {
    console.error("Erreur dans fetchWorkLogsByWorkOrderId :", error);
    return {
      success: false,
      error: error.message,
    };
  }
};


/**
 * Ajoute un worklog à un work order donné.
 * @param {string|number} workorderid - L'ID du work order auquel ajouter le worklog.
 * @param {Object} worklogData - Les données du worklog ({ logtype, description, logtype_description, langcode, clientviewable }).
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet avec { success, data } ou { success, error }.
 */
export const addWorkLog = async (workorderid, worklogData, sessionCookie) => {
  try {
    console.log("🔹 addWorkLog: workorderid =", workorderid);

    const apiBase = await getApiBase();
    const worklogUrl = `${apiBase}/${workorderid}/worklog?lean=1`;
    console.log("🔹 addWorkLog: URL d'ajout =", worklogUrl);

    const requestBody = JSON.stringify(worklogData); // Utilisation directe des données passées
    console.log("📤 addWorkLog: Données envoyées =", requestBody);

    const response = await fetch(worklogUrl, {
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
      console.log("✅ Worklog ajouté avec succès.");
      return { success: true, message: "Worklog ajouté avec succès." };
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
    console.error("❌ addWorkLog: Erreur brute =", error.message);
  
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
