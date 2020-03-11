function changeBusesAttributes(buses) {
  for (let bus of buses) {
    bus.state.position.coordinates[0] = (Math.random() * (37.4016 - 37.3988) + 37.3988);
    bus.state.position.coordinates[1] = (Math.random() * (55.7184 - 55.7165) + 55.7165);
    bus.state.fuel = (Math.random() * 100).toFixed(0);
    bus.state.speed = (Math.random() * 90).toFixed(0);
  }
  return buses;
}

module.exports = changeBusesAttributes;
