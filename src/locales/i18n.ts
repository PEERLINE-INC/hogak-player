import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../assets/locales/en.json";
import translationKO from "../assets/locales/ko.json";
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: translationEN
  },
  ko: {
    translation: translationKO
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ['cookie'],
      lookupCookie: 'locale',
      caches: ['cookie'],
    },
    debug: true,
    resources,
    fallbackLng: "ko", // 번역 파일에 없는 언어일 경우 fallback
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;