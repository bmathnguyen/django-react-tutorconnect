// src/hooks/useTranslation.js
import { useLanguage } from '../context/LanguageContext';
import viTranslations from '../translations/vi';
import enTranslations from '../translations/en';

const translations = {
  vi: viTranslations,
  en: enTranslations,
};

// SGD to VND exchange rate (approximate)
const EXCHANGE_RATE = 20000; // 1 SGD = 20,000 VND (update as needed)

export const useTranslation = () => {
  const { language, currency } = useLanguage();

  // Get translation function
  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return typeof value === 'string' ? value : defaultValue;
  };

  // Format currency
  const formatCurrency = (amount, options = {}) => {
    if (!amount || isNaN(amount)) return t('currency.contact');

    const {
      showSymbol = true,
      showUnit = true,
      precision = 0,
    } = options;

    let finalAmount = amount;
    let symbol = '';
    let unit = '';

    if (currency === 'VND') {
      // Convert SGD to VND (backend returns SGD by default)
      finalAmount = amount * EXCHANGE_RATE;
      symbol = showSymbol ? '' : '';
      unit = showUnit ? ` ${t('currency.vnd')}` : '';
    } else {
      // SGD (default, as returned by backend)
      symbol = showSymbol ? 'S$' : '';
      unit = showUnit ? ` ${t('currency.sgd')}` : '';
    }

    // Format number with commas
    const formattedAmount = finalAmount.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    return `${symbol}${formattedAmount}${unit}`;
  };

  // Format price with per unit
  const formatPrice = (amount, perUnit = 'hour', options = {}) => {
    const formattedAmount = formatCurrency(amount, options);
    const unitText = perUnit === 'hour' ? t('currency.perHour') : t('currency.perSession');
    
    if (formattedAmount === t('currency.contact')) {
      return formattedAmount;
    }
    
    return `${formattedAmount}${unitText}`;
  };

  // Get current language info
  const getCurrentLanguage = () => ({
    code: language,
    name: language === 'vi' ? 'Tiếng Việt' : 'English',
    isVietnamese: language === 'vi',
    isEnglish: language === 'en',
  });

  // Get current currency info
  const getCurrentCurrency = () => ({
    code: currency,
    symbol: currency === 'SGD' ? 'S$' : '',
    name: currency === 'SGD' ? 'Singapore Dollar' : 'Vietnamese Dong',
    isSGD: currency === 'SGD',
    isVND: currency === 'VND',
  });

  return {
    t,
    formatCurrency,
    formatPrice,
    language,
    currency,
    getCurrentLanguage,
    getCurrentCurrency,
  };
};

export default useTranslation;
