// Short LOCALE list based on most sales
export const LOCALES = [
  "en", // United States, UK, CA, AU, etc.
  "de", // Germany, Austria, Switzerland
  "fr", // France, Belgium, Switzerland, Canada
  "es", // Spain, LATAM
  "it", // Italy
  "pt", // Brazil, Portugal
  "nl", // Netherlands, Belgium
  "sv", // Sweden
  "no", // Norway
  "da", // Denmark
  "fi", // Finland
  "pl", // Poland
  "ro", // Romania
  "tr", // Turkey
  "ru", // Russia, parts of Eastern Europe
  "ja", // Japan
  "ko", // South Korea
  "zh-TW", // Taiwan, Hong Kong (Traditional Chinese)
  "hi", // India (Hindi)
  "id", // Indonesia
  "vi", // Vietnam
  "th", // Thailand
  "ar" // UAE, general MENA presence
];

export function generateHrefLinks(currentPath) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://divmagic.com";

  const defaultLink = <link key="x-default" rel="alternate" href={`${baseUrl}/${currentPath}`} hrefLang="x-default" />;
  const canonicalLink = <link key="canonical" rel="canonical" href={`${baseUrl}/${currentPath}`} />;
  const alternateLinks = LOCALES.map((lang) => (
    <link key={lang} rel="alternate" href={`${baseUrl}/${lang}/${currentPath}`} hrefLang={lang} />
  ));

  return [defaultLink, canonicalLink, ...alternateLinks];
}
