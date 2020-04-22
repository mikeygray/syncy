import { mdiMicrosoftEdge, mdiGoogleChrome, mdiOpera, mdiSafeSquare, mdiHelpBox } from '@mdi/js';

export const emptyTabList = [
  {
    id: -1,
    title: '',
    url: '',
    imageurl: '',
    pinned: false,
  },
];

export const emptyBrowserData = {
  id: '',
  name: 'unknown',
  windows: [
    {
      id: -1,
      tabs: emptyTabList,
    },
  ],
};

const isUrlBrowserInternal = (url = '') => {
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

export const parseTabObject = (tabData = {}) => {
  return {
    id: tabData.id,
    title: tabData.title,
    url: tabData.url,
    imageurl: tabData.favIconUrl,
    pinned: tabData.pinned,
  };
};

export const parseWindowsData = (browserId = '', browserName = '', windowData = []) => {
  let returnData = {
    id: browserId,
    name: browserName,
    windows: [],
  };
  for (const window of windowData) {
    let windowEntry = {
      id: window.id,
      title: 'Window ' + window.id,
      tabs: [],
    };
    for (const tab of window.tabs) {
      if (!isUrlBrowserInternal(tab.url)) windowEntry.tabs.push(parseTabObject(tab));
    }
    returnData.windows.push(windowEntry);
  }
  return returnData;
};

export const parseRecentsData = (recentData = []) => {
  let returnData = [];
  for (const recent of recentData) {
    if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
      for (const tab of recent.window.tabs) {
        if (!isUrlBrowserInternal(tab.url)) returnData.push(parseTabObject(tab));
      }
    } else {
      if (!isUrlBrowserInternal(recent.tab.url)) returnData.push(parseTabObject(recent.tab));
    }
  }
  return returnData;
};

export const identifyBrowser = (useragent = '') => {
  if (useragent.includes('Edg/')) return 'edge';
  /** doesn't exist ➡ */ else if (useragent.includes('Chromium/')) return 'chromium';
  /** doesn't exist (yet) ➡ */ else if (useragent.includes('Brave/')) return 'brave';
  else if (useragent.includes('OPR/')) return 'opera';
  else if (useragent.includes('Chrome/')) return 'chrome';
  else return 'unknown';
};

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
