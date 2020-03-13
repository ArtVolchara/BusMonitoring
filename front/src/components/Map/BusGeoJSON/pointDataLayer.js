export const pointDataLayer = {
  id: 'data',
  type: 'circle',
  paint: {
    'circle-color': {
      property: 'percentile',
      stops: [
        [10, "#ff0000"],
        [20, '#ff3300'],
        [30, "#ff6600"],
        [40, "#ff9100"],
        [50, '#ffd000'],
        [60, '#bbff00'],
        [70, '#b3ff00'],
        [80, '#91ff00'],
        [90, '#7bff00'],
        [100, '#1eff00']
      ],
    },
  },
};
