export default function getLineFeatures(busTelemetry) {
  const features = [];
  for (let i = 0; i < busTelemetry.length - 1; i++) {
    features.push(
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            busTelemetry[i].position.coordinates.map((coordinate) => +coordinate),
            busTelemetry[i + 1].position.coordinates.map((coordinate) => +coordinate),
          ],
        },
        properties: {
          speed: ((+busTelemetry[i].speed) + (+busTelemetry[i + 1].speed)) / 2,
        },
      },
    );
  }
  return features;
}
