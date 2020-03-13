function busesTelemetryGenerator(buses, busesTelemetry) {
  // console.log(busesTelemetry[0].position.coordinates, busesTelemetry[1].position.coordinates);
  for (bus of buses) {
    // console.log(bus.state.position.coordinates);
    if (!busesTelemetry.hasOwnProperty(bus.object_id)) {
      busesTelemetry[bus.object_id] = [];
    }
    busesTelemetry[bus.object_id].unshift(
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
    if (busesTelemetry[bus.object_id].length > 10) {
      busesTelemetry[bus.object_id].length = 10;
    }
  }
  return busesTelemetry;
}
module.exports = busesTelemetryGenerator;
