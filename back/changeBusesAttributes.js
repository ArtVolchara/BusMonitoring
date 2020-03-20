function changeBusesAttributes(buses) {
// Псевдослучайное изменение координат в интервале области видимости карты, а также количества топлива и скорости
  for (let bus of buses) {
    bus.state.position.coordinates = [(Math.random() * (37.41404771804809 - 37.39647388458252) + 37.39647388458252),(Math.random() * (55.72331566016952 - 55.714480713939565) + 55.714480713939565)]
    bus.state.fuel = (Math.random() * 100).toFixed(0);
    bus.state.speed = (Math.random() * 90).toFixed(0);
  }
  return buses;
}

module.exports = changeBusesAttributes;
