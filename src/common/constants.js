export const emptyTabArray = [
  {
    id: -1,
    index: -1 /* if the tabs have an order */,
    title: '',
    url: '',
    imageurl: '',
    pinned: false,
  },
];

export const emptyRecentsArray = emptyTabArray;

export const emptyPanelsArray = [
  {
    id: -1,
    name: '',
    title: '',
    tabs: emptyTabArray,
  },
];

export const emptyWindowsArray = emptyPanelsArray;

export const emptyDevicesArray = emptyPanelsArray;
