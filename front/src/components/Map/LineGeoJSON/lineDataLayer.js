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
      ['boolean', [">=", ['get', 'percentile'], 40]],
      "#ff0000",
      "#1e90ff"
    ],
    'line-width': 3,
    'line-opacity': 0.75
  },
};