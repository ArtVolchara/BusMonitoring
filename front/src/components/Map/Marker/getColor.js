export default function getColor(bus) {
  const fuel = String(Math.round(bus.state.fuel / 10) * 10);
  switch (fuel) {
    case '10':
      return '#ff0000';
    case '20':
      return '#ff3300';
    case '30':
      return '#ff6600';
    case '40':
      return '#ff9100';
    case '50':
      return '#ffd000';
    case '60':
      return '#bbff00';
    case '70':
      return '#b3ff00';
    case '80':
      return '#91ff00';
    case '90':
      return '#7bff00';
    case '100':
      return '#1eff00';
    default:
      return '#ff0000';
  }
}