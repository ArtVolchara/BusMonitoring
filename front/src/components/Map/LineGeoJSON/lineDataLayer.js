export const lineDataLayer = {
  id: 'Line-data',
  type: 'line',
  paint: {
    'line-color': {
      property: 'percentile',
      stops: [
        [0, "#1e90ff"],
        [40, "#ff0000"],
      ],
    },
    'line-width': 3,
  },
};
