
export default function updatePointPercentiles(featureCollection) {
  return {
    type: 'FeatureCollection',
    features: featureCollection.map((feature) => {
      const properties = {
        ...feature.properties,
        percentile: Math.round(feature.properties.speed / 10) * 10,
      };
      return { ...feature, properties };
    }),
  };
}
