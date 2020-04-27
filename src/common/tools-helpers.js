import { mdiMicrosoftEdge, mdiGoogleChrome, mdiOpera, mdiSafeSquare, mdiHelpBox } from '@mdi/js';

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
 * @description hashes a string into an int
 */
export const hashStringToInt = (input = '') => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    let chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * @description tries to identify the browser type from the useragent and mostly fails in this duty
 */
export const identifyBrowser = (useragent = '') => {
  if (useragent.includes('Edg/')) return 'edge';
  /** doesn't exist ➡ */ else if (useragent.includes('Chromium/')) return 'chromium';
  /** doesn't exist (yet) ➡ */ else if (useragent.includes('Brave/')) return 'brave';
  /** doesn't exist ➡ */ else if (useragent.includes('Vivaldi/')) return 'vivaldi';
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
      /** doesn't exist (yet) */
      return mdiSafeSquare;
    case 'opera':
      return mdiOpera;
    case 'chrome':
    case 'chromium':
      return mdiGoogleChrome;
    default:
      return mdiHelpBox;
  }
};
