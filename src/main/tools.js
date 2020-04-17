export const parseTabObject = (tabDataIn = {}) => {
  return {
    id: tabDataIn.id,
    title: tabDataIn.title,
    url: tabDataIn.url,
    imageurl: tabDataIn.favIconUrl,
    pinned: tabDataIn.pinned,
  };
};

export const emptyBrowserData = {
  id: '',
  name: 'unknown',
  windows: [
    {
      id: -1,
      tabs: [
        {
          id: -1,
          title: '',
          url: '',
          imageurl: '',
          pinned: false,
        },
      ],
    },
  ],
};

export const emptyTabList = [
  {
    id: -1,
    title: '',
    url: '',
    imageurl: '',
    pinned: false,
  },
];

export const parseWindowData = (idIn = '', nameIn = '', windowDataIn = []) => {
  let returnData = {
    id: idIn,
    name: nameIn,
    windows: [],
  };
  for (const window of windowDataIn) {
    let windowEntry = {
      id: window.id,
      title: 'Window ' + window.id,
      tabs: [],
    };
    for (const tab of window.tabs) {
      windowEntry.tabs.push(parseTabObject(tab));
    }
    returnData.windows.push(windowEntry);
  }
  return returnData;
};

/** Parse depending on windows entry or tab entry, flatten regardless */
export const parseRecentData = (recentDataIn = []) => {
  let returnData = [];
  for (const recent of recentDataIn) {
    if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
      for (const tab of recent.window.tabs) {
        returnData.push(parseTabObject(tab));
      }
    } else {
      returnData.push(parseTabObject(recent.tab));
    }
  }
  return returnData;
};

export const identifyBrowser = (useragent = '') => {
  if (useragent.includes('Edg/')) return 'edge';
  else if (useragent.includes('Chromium/')) return 'chromium';
  else if (useragent.includes('Chrome/')) return 'chrome';
  else return 'unknown';
};
