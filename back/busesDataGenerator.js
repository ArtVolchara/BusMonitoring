const changeBusesAttributes = require('./changeBusesAttributes');
const busesTelemetryGenerator = require('./busesTelemetryGenerator');
const busesGenerator = require('./busesGenerator');
// Генерация автобусов и новых координат для автобусов( собираются в 10 пакетов телеметрии, обновляющихся при поступлении новых данных)

function busesDataGenerator() {
  const buses = busesGenerator(50);
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
