import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/index";
import ta from "./ta/index";

const resources = {
  // list of languages
  en,
  ta,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: "ta", // default language to use.
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
