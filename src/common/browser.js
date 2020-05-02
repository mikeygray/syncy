import { mdiMicrosoftEdge, mdiGoogleChrome, mdiOpera, mdiHelpBox } from '@mdi/js';
import { braveIcon, vivaldiIcon } from './extraicons';

/**
 * @description checks url for "internal style" urls
 */
export const isUrlBrowserInternal = (url = '') => {
  return [
    'chrome:',
    'chrome-extension:',
    'brave:',
    'edge:',
    'extension:',
    'settings',
    'extensions',
  ].some((substring) => url.startsWith(substring));
};

/**
 * @description creates a random 10 char alphanumerical id
 */
export const getRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * @description tries to identify the browser type from the useragent and mostly fails in its duty
 * @todo a better way to identify other flavours of chromium
 */
export const identifyBrowser = () => {
  const useragent = navigator.userAgent;
  if (useragent.includes('Edg/')) return 'edge';
  // TODO: How can I better detect browsers?
  // doesn't exist ➡  else if (useragent.includes('Chromium/')) return 'chromium';
  // doesn't exist yet ➡  else if (useragent.includes('Brave/')) return 'brave';
  // also doesn't exist ➡  else if (useragent.includes('Vivaldi/')) return 'vivaldi';
  else if (useragent.includes('OPR/')) return 'opera';
  else if (useragent.includes('Chrome/')) return 'chrome';
  else return 'unknown';
};

/**
 * @returns the svg code for an icon representing the browser
 */
export const getBrowserIcon = (browserName = '') => {
  switch (browserName) {
    case 'edge':
      return mdiMicrosoftEdge;
    case 'brave':
      return braveIcon;
    case 'vivaldi':
      return vivaldiIcon;
    case 'opera':
      return mdiOpera;
    case 'chrome':
    case 'chromium':
      return mdiGoogleChrome;
    default:
      return mdiHelpBox;
  }
};
