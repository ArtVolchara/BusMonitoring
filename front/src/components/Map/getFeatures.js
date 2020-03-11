export default function getFeatures(buses) {
  const features = buses.map((el) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: el.state.position.coordinates.map((coordinate) => +coordinate),
    },
    properties: {
      reg_number: el.reg_number,
      object_id: el.object_id,
      route: el.route,
      fuel: +el.state.fuel,
      speed: +el.state.speed,
    },

  }));
  return features;
}
