export const emptyTabArray = [
  {
    id: -1,
    title: '',
    url: '',
    imageurl: '',
    pinned: false,
  },
];

export const emptyPanelsArray = [
  {
    id: 0,
    title: '',
    tabs: emptyTabArray,
  },
];

/** Legacy */
export const emptyBrowserData = {
  id: '',
  name: 'unknown',
  windows: [
    {
      id: -1,
      tabs: emptyTabArray,
    },
  ],
};
