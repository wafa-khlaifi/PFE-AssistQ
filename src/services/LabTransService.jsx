import { getApiBase } from './apiConfig';

/**
 * Ajuste l'URL pour remplacer "http://localhost" par le domaine réel.
 * @param {string} url - L'URL retournée par l'API.
 * @returns {string} - L'URL corrigée.
 */
const adjustLocalRef = (url) => {
  return url.replace('http://localhost', 'http://maxgps.smartech-tn.com:9876');
};

/**
 * Récupère tous les détails des LABTRANS pour un Work Order donné via son workorderid.
 * @param {string|number} workorderid - L'identifiant du Work Order.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success, data } ou { success, error }.
 */
export const fetchLabTransByWorkOrderId = async (workorderid, sessionCookie) => {
  try {
    // Récupération de l'URL de base (ex: 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/AQWO')
    const apiBase = await getApiBase();
    // Construction de l'URL de la collection LABTRANS pour le Work Order
    const collectionUrl = `${apiBase}/${workorderid}/labtrans?lean=1`;
    console.log("[fetchLabTransByWorkOrderId] URL de la collection =", collectionUrl);
    console.log("[fetchLabTransByWorkOrderId] sessionCookie =", sessionCookie);

    // Récupérer la collection de références
    const collectionResponse = await fetch(collectionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      },
    });
    console.log("[fetchLabTransByWorkOrderId] Réponse de la collection, status =", collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error(`Erreur lors de la récupération de la collection de LABTRANS : ${collectionResponse.status}`);
    }

    const collectionData = await collectionResponse.json();
    console.log("[fetchLabTransByWorkOrderId] Données de la collection =", collectionData);
    
    const localRefs = collectionData.member || [];
    console.log("[fetchLabTransByWorkOrderId] Nombre de LABTRANS trouvés =", localRefs.length);

    // Pour chaque localref, récupérer les détails du LABTRANS
    const laborTransactions = await Promise.all(
      localRefs.map(async (refObj, index) => {
        let detailUrl = adjustLocalRef(refObj.localref);
        console.log(`[fetchLabTransByWorkOrderId] Traitement du LABTRANS ${index + 1} avec detailUrl =`, detailUrl);
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': `JSESSIONID=${sessionCookie}`,
          },
        });
        console.log(`[fetchLabTransByWorkOrderId] Réponse du détail pour LABTRANS ${index + 1}, status =`, detailResponse.status);

        if (!detailResponse.ok) {
          throw new Error(`Erreur lors de la récupération du LABTRANS à ${detailUrl} : ${detailResponse.status}`);
        }

        const detailData = await detailResponse.json();
        console.log(`[fetchLabTransByWorkOrderId] Données du LABTRANS ${index + 1} =`, detailData);
        return detailData;
      })
    );

    console.log("[fetchLabTransByWorkOrderId] Tous les LABTRANS récupérés =", laborTransactions);
    return {
      success: true,
      data: laborTransactions,
    };
  } catch (error) {
    console.error("[fetchLabTransByWorkOrderId] Erreur :", error);
    return {
      success: false,
      error: error.message,
    };
  }
};




/**
 * Crée un nouveau labtrans pour un Work Order donné.
 * @param {string|number} workorderid - L'ID du Work Order.
 * @param {Object} laborData - Les données du labtrans à créer.
 *     Exemples de propriétés attendues :
 *       - apptrequired: boolean
 *       - quantity: number
 *       - ratehaschanged: boolean
 *       - rate: number
 *       - laborhrs: number
 *       - orgid: string
 *       - laborcode: string
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success: true, data } ou { success: false, error }.
 */
export const createLabTrans = async (workorderid, laborData, sessionCookie) => {
  try {
    console.log("🔹 createLabTrans: workorderid =", workorderid);

    const apiBase = await getApiBase();
    const url = `${apiBase}/${workorderid}?lean=1`; 
    console.log("🔵 Envoi de la requête vers:", url);

    // Construction du body avec la structure attendue par l'API
    const requestPayload = {
      labtrans: [
        {
          ...laborData
        }
      ]
    };

    const requestBody = JSON.stringify(requestPayload);
    console.log("📤 createLabTrans: Données envoyées =", requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'maxauth': 'bWF4YWRtaW46bWF4YWRtaW4xMjM="', // Adaptez selon votre configuration Maximo
        'x-method-override': 'PATCH',
        'patchtype': 'MERGE',
        'Cookie': `JSESSIONID=${sessionCookie}`
      },
      body: requestBody
    });

    console.log("📩 createLabTrans: Réponse de l'API, status =", response.status);

    // Certains endpoints Maximo renvoient 204 si l'opération est réussie sans body
    if (response.status === 204) {
      console.log("✅ LabTrans ajouté avec succès.");
      return { success: true, message: "LabTrans ajouté avec succès." };
    }

    // Si la réponse n'est pas OK, on tente de récupérer le message d'erreur
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API :", response.status, errorText);
      throw new Error(errorText);
    }

    // Sinon, on parse la réponse (si 200, par ex.)
    const responseData = await response.json();
    console.log("✅ API Response:", responseData);
    return { success: true, data: responseData };

  } catch (error) {
    console.error("❌ createLabTrans: Erreur =", error.message);
    let errorMessage = "Une erreur inconnue s'est produite.";

    // Tentative de parser l'erreur en JSON pour récupérer un message détaillé
    try {
      const errorJson = JSON.parse(error.message);
      if (errorJson.Error && errorJson.Error.message) {
        errorMessage = errorJson.Error.message;
      }
    } catch (e) {
      console.error("❌ Impossible de parser l'erreur JSON :", e);
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

