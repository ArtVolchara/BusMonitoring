const changeBusesAttributes = require('./changeBusesAttributes');
const busesTelemetryGenerator = require('./busesTelemetryGenerator');

const buses = [{
  object_id: 'cb2f2a34-2702-4352-b04f-6242794fbf51',
  reg_number: 'A777AA777',
  route: '144к',
  state: {
    object_id: 'cb2f2a34-2702-4352-b04f-6242794fbf51',
    time: '2020-01-25T12.02.03.000+03:00',
    position: {
      type: 'Point',
      coordinates: [52.34534543, 32.34546546],
    },
    fuel: 72,
    speed: 45,
    direction: 127,
  },
},
{
  object_id: 'cb2f2a34-2702-4352-b04f-6242794fbf52',
  reg_number: 'A777AA777',
  route: '157к',
  state: {
    object_id: 'cb2f2a34-2702-4352-b04f-6242794fbf51',
    time: '2020-01-25T12.02.03.000+03:00',
    position: {
      type: 'Point',
      coordinates: [52.34534543, 32.34546546],
    },
    fuel: 72,
    speed: 45,
    direction: 127,
  },
}];


function busesDataGenerator() {
  let busesTelemetry = {};
  try {
    const io = require('socket.io')();
    const port = 8000;
    // socket connection //
    io.of('/buses').on('connection', (socket) => {
      console.log('connection of /buses established');
      const busesInterval = setInterval(() => {
        changeBusesAttributes(buses);
        busesTelemetryGenerator(buses, busesTelemetry);
        socket.emit('buses', buses);
      }, 5000);
      socket.on('disconnect', () => {
        clearInterval(busesInterval);
        console.log('connection  of /buses/telemetry destroyed');
      });
    });
    io.of('/buses/telemetry').on('connection', (socket) => {
      console.log('connection of /buses/telemetry established');
      const telemetryInterval = setInterval((busesTelemetry) => {
        if (socket.handshake.query.object_id) {
          const { object_id } = socket.handshake.query;
          const busTelemetry = busesTelemetry[object_id];
          if (busTelemetry) {
            socket.emit('busTelemetry', busTelemetry);
          }
        }
      }, 1000, busesTelemetry);
      socket.on('disconnect', () => {
        clearInterval(telemetryInterval);
        console.log('connection  of /buses/telemetry destroyed');
      });
    });


    io.listen(port);
    console.log('busesDataGenerator listening on port ', port);
  } catch (error) {
    console.log('error in busesDataGenerator function:', error.message);
  }
}

module.exports = busesDataGenerator;
