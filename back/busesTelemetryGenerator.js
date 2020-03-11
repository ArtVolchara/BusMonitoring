function busesTelemetryGenerator(buses, busesTelemetries) {
  for (bus of buses) {
    if (!busesTelemetries.hasOwnProperty(bus.object_id)) {
      busesTelemetries[bus.object_id] = [];
    }
    busesTelemetries[bus.object_id].unshift(
      {
        object_id: bus.object_id,
        time: Date(),
        position: {
          type: 'Point',
          coordinates: bus.state.position.coordinates,
        },
        fuel: bus.state.fuel,
        speed: bus.state.speed,
        direction: bus.state.direction,
      },
    );
    if (busesTelemetries[bus.object_id].length > 10) {
      busesTelemetries[bus.object_id].length = 10;
    }
  }
  return busesTelemetries;
}
module.exports = busesTelemetryGenerator;
