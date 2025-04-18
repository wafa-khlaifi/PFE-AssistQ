import errorMessages from '../constants/errors.json';

export const getErrorMessage = (category, key) => {
  return errorMessages[category]?.[key] || "Erreur inconnue. Veuillez contacter le support.";
};
