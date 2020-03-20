const uuid = require('uuid');

function busesGenerator(number) {
  const random3Numbers = () => Math.random() * 1000;
  const buses = [];
  for (let i = 0; i <= number; i++) {
    const id = uuid.v4();
    buses.push({
      object_id: id,
      reg_number: `A${random3Numbers().toFixed(0)}AA${random3Numbers().toFixed(0)}`,
      route: String(random3Numbers().toFixed(0)),
      state: {
        object_id: id,
        time: Date(),
        position: {
          type: 'Point',
          coordinates: [(Math.random() * (37.4016 - 37.3988) + 37.3988),
            (Math.random() * (55.7184 - 55.7165) + 55.7165)],
        },
        fuel: (Math.random() * 100).toFixed(0),
        speed: (Math.random() * 100).toFixed(0),
        direction: (Math.random() * 360).toFixed(0),
      },
    });
  }
  return buses;
}
module.exports = busesGenerator;