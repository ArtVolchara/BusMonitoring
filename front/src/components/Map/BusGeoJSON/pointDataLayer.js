export const pointDataLayer = {
  id: 'Point-data',
  type: 'circle',
  source: 'Point-data',
  paint: {
    'circle-color': {
      property: 'percentile',
      stops: [
        [10, '#ff0000'],
        [20, '#ff3300'],
        [30, '#ff6600'],
        [40, '#ff9100'],
        [50, '#ffd000'],
        [60, '#bbff00'],
        [70, '#b3ff00'],
        [80, '#91ff00'],
        [90, '#7bff00'],
        [100, '#1eff00'],
      ],
    },
    'circle-radius': 7,
    'circle-stroke-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      5,
      0
    ],
    'circle-stroke-color': '#556577'
  },
};

// export const pointDataLayer = {
//   id: 'Point-data',
//   type: 'symbol',
//   layout: {
//     'icon-image': "bus",
//     'icon-size': 1,
//     'icon-allow-overlap': true,
//   },
//   paint: {
//     'icon-color': {
//       property: 'percentile',
//       stops: [
//         [10, "#ff0000"],
//         [20, '#ff3300'],
//         [30, "#ff6600"],
//         [40, "#ff9100"],
//         [50, '#ffd000'],
//         [60, '#bbff00'],
//         [70, '#b3ff00'],
//         [80, '#91ff00'],
//         [90, '#7bff00'],
//         [100, '#1eff00']
//       ],
//     },
//   },
// };
