import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '../helpers/hrefGenerator';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  alternateLinks: false,
  localeDetection: false
});
