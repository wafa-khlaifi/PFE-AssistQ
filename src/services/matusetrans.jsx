// services/matusetransService.js
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
 * Récupère tous les détails des MATUSTRANS pour un work order donné via son workorderid.
 * @param {string|number} workorderid - L'identifiant du work order.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet { success, data } ou { success, error }.
 */
export const fetchMatusetransByWorkOrderId = async (workorderid, sessionCookie) => {
  try {
    // Récupération de l'URL de base (ex: 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/AQWO')
    const apiBase = await getApiBase();
    // Construction de l'URL de la collection MATUSTRANS pour le workorder
    const collectionUrl = `${apiBase}/${workorderid}/matusetrans?lean=1`;
    console.log("fetchMatusetransByWorkOrderId: URL de la collection =", collectionUrl);
    console.log("fetchMatusetransByWorkOrderId: sessionCookie =", sessionCookie);

    // Récupérer la collection de références
    const collectionResponse = await fetch(collectionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      },
    });
    console.log("fetchMatusetransByWorkOrderId: Réponse de la collection, status =", collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error(`Erreur lors de la récupération de la collection de MATUSTRANS : ${collectionResponse.status}`);
    }

    const collectionData = await collectionResponse.json();
    console.log("fetchMatusetransByWorkOrderId: Données de la collection =", collectionData);
    
    const localRefs = collectionData.member || [];
    console.log("fetchMatusetransByWorkOrderId: Nombre de MATUSTRANS trouvés =", localRefs.length);

    // Pour chaque localref, récupérer les détails du MATUSTRANS
    const materials = await Promise.all(
      localRefs.map(async (refObj, index) => {
        let detailUrl = adjustLocalRef(refObj.localref);
        console.log(`fetchMatusetransByWorkOrderId: Traitement du MATUSTRANS ${index + 1} avec detailUrl =`, detailUrl);
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': `JSESSIONID=${sessionCookie}`,
          },
        });
        console.log(`fetchMatusetransByWorkOrderId: Réponse du détail pour MATUSTRANS ${index + 1}, status =`, detailResponse.status);
        if (!detailResponse.ok) {
          throw new Error(`Erreur lors de la récupération du MATUSTRANS à ${detailUrl} : ${detailResponse.status}`);
        }
        const detailData = await detailResponse.json();
        console.log(`fetchMatusetransByWorkOrderId: Données du MATUSTRANS ${index + 1} =`, detailData);
        return detailData;
      })
    );

    console.log("fetchMatusetransByWorkOrderId: Tous les MATUSTRANS récupérés =", materials);
    return {
      success: true,
      data: materials,
    };
  } catch (error) {
    console.error("Erreur dans fetchMatusetransByWorkOrderId :", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
