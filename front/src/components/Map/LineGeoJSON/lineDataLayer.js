export const lineDataLayer = {
  id: 'Line-data',
  type: 'line',
  source: 'Line-data',
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    'line-color': [
      'case',
      ['boolean',[">=", ['get', 'percentile'], 40]],
      "#ff0000",
      "#1e90ff"
    ],
  },
};
// {
//   property: 'percentile',
//   stops: [
//     [0, "#1e90ff"],
//     [40, "#ff0000"],
//   ],
// },
// 'line-width': 3,
// 'line-opacity': 0.75