export default function getLineFeatures(telemetry) {
  const features = [];
  // console.log(telemetry);
  for (let i = 0; i < telemetry.length - 1; i++) {
    // console.log(telemetry[i].position.coordinates, i);
    features.push(
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            telemetry[i].position.coordinates.map((coordinate) => +coordinate),
            telemetry[i + 1].position.coordinates.map((coordinate) => +coordinate),
          ],
        },
        properties: {
          speed: ((+telemetry[i].speed) + (+telemetry[i + 1].speed)) / 2,
        },
      },
    );
  }
  return features;
}
