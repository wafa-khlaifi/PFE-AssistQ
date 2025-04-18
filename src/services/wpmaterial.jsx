// services/WpmaterialService.js
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
 * Récupère tous les détails des WPMaterial pour un work order donné via son workorderid.
 * @param {string|number} workorderid - L'identifiant du work order.
 * @param {string} sessionCookie - Le cookie de session (JSESSIONID) pour l'authentification.
 * @returns {Promise<Object>} - Un objet avec { success, data } ou { success, error }.
 */
export const fetchWpmaterialByWorkOrderId = async (workorderid, sessionCookie) => {
  try {
    // Construction de l'URL de la collection des WPMaterial
    const apiBase = await getApiBase(); // par exemple : 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/AQWO'
    const collectionUrl = `${apiBase}/${workorderid}/wpmaterial?lean=1`;
    console.log("fetchWpmaterialByWorkOrderId: URL de la collection =", collectionUrl);
    console.log("fetchWpmaterialByWorkOrderId: sessionCookie =", sessionCookie);

    const collectionResponse = await fetch(collectionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      },
    });
    console.log("fetchWpmaterialByWorkOrderId: Réponse de la collection, status =", collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error(`Erreur lors de la récupération de la collection de WPMaterial : ${collectionResponse.status}`);
    }

    const collectionData = await collectionResponse.json();
    console.log("fetchWpmaterialByWorkOrderId: Données de la collection =", collectionData);
    
    const localRefs = collectionData.member || [];
    console.log("fetchWpmaterialByWorkOrderId: Nombre de WPMaterial trouvés =", localRefs.length);

    // Pour chaque localref, récupérer les détails
    const materials = await Promise.all(
      localRefs.map(async (refObj, index) => {
        let detailUrl = adjustLocalRef(refObj.localref);
        console.log(`fetchWpmaterialByWorkOrderId: Traitement du matériel ${index + 1} avec detailUrl =`, detailUrl);
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': `JSESSIONID=${sessionCookie}`,
          },
        });
        console.log(`fetchWpmaterialByWorkOrderId: Réponse du détail pour matériel ${index + 1}, status =`, detailResponse.status);
        if (!detailResponse.ok) {
          throw new Error(`Erreur lors de la récupération du matériel à ${detailUrl} : ${detailResponse.status}`);
        }
        const detailData = await detailResponse.json();
        console.log(`fetchWpmaterialByWorkOrderId: Données du matériel ${index + 1} =`, detailData);
        return detailData;
      })
    );

    console.log("fetchWpmaterialByWorkOrderId: Tous les WPMaterial récupérés =", materials);
    return {
      success: true,
      data: materials,
    };
  } catch (error) {
    console.error("Erreur dans fetchWpmaterialByWorkOrderId :", error);
    return {
      success: false,
      error: error.message,
    };
  }
};




/**
 * Creates a new Material.
 * @param {string|number} workorderid - The workorder ID.
 * @param {Object} materialData - The material data to create.
 *   Expected structure:
 *   {
 *     description: "Tubing",
 *     wpmaterial: [
 *       { 
 *         itemnum: "0-0514",
 *         unitcost: 2.08,
 *         linecost: 11.9,
 *         location: "CENTRAL",
 *         storelocsite: "BEDFORD",
 *         restype: "AUTOMATIC",
 *         directreq: true,
 *         requestby: "MAXADMIN"
 *       }
 *     ]
 *   }
 * @param {string} sessionCookie - The session cookie (JSESSIONID) for authentication.
 * @returns {Promise<Object>} - An object with { success, message } or { success, error }.
 */
export const createWpmaterial = async (workorderid, materialData, sessionCookie) => {
    try {
      console.log("🔹 createWpmaterial: workorderid =", workorderid);
      console.log("🔹 createWpmaterial: materialData =", materialData);
      console.log("🔹 createWpmaterial: sessionCookie =", sessionCookie);
  
      const apiBase = await getApiBase();
      const url = `${apiBase}/${workorderid}?lean=1`;
      console.log("🔵 Sending request to:", url);
  
      // Build the payload using the provided materialData
      const requestPayload = {
        description: materialData.description,
        wpmaterial: materialData.wpmaterial
      };
  
      const requestBody = JSON.stringify(requestPayload);
      console.log("📤 createWpmaterial: Request body =", requestBody);
  
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
  
      console.log("📩 createWpmaterial: API response status =", response.status);
  
      if (response.status === 204) {
        console.log("✅ Material added successfully.");
        return { success: true, message: "Material added successfully." };
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API error:", response.status, errorText);
        throw new Error(errorText);
      }
  
      const responseData = await response.json();
      console.log("✅ API response:", responseData);
      return { success: true, data: responseData };
  
    } catch (error) {
      console.error("❌ createWpmaterial: Error =", error.message);
      let errorMessage = "An unknown error occurred.";
  
      try {
        const errorJson = JSON.parse(error.message);
        if (errorJson.Error && errorJson.Error.message) {
          errorMessage = errorJson.Error.message;
        }
      } catch (e) {
        console.error("❌ Unable to parse error:", e);
        errorMessage = error.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };
  