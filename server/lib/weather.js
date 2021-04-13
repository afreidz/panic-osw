function codeToIcon(code) {
  switch (code) {
    case 4201:
      return { icon: '󰖖', text: 'Heavy Rain' };
      break;	//Heavy Rain
    case 4001:
      return { icon: '󰖗', text: 'Rain' };
      break;	//Rain
    case 4200:
      return { icon: '󰼳', text: 'Light Rain' };
      break;	//Light Rain
    case 6201:
      return { icon: '󰙿', text: 'Heavy Freezing Rain' };
      break;	//Heavy Freezing Rain
    case 6001:
      return { icon: '󰙿', text: 'Freezing Rain' };
      break;	//Freezing Rain
    case 6200:
      return { icon: '󰙿', text: 'Light Freezing Rain' };
      break;	//Light Freezing Rain
    case 6000:
      return { icon: '󰙿', text: 'Freezing Drizzle' };
      break;	//Freezing Drizzle
    case 4000:
      return { icon: '󰖗', text: 'Drizzle' };
      break;	//Drizzle
    case 7101:
      return { icon: '󰖒', text: 'Heavy Ice' };
      break;	//Heavy Ice
    case 7000:
      return { icon: '󰖒', text: 'Ice Pellets' };
      break;	//Ice Pellets
    case 7102:
      return { icon: '󰖒', text: 'Light Ice Pellets' };
      break;	//Light Ice Pellets
    case 5101:
      return { icon: '󰼶', text: 'Heavy Snow' };
      break;	//Heavy Snow
    case 5000:
      return { icon: '󰖘', text: 'Snow' };
      break;	//Snow
    case 5100:
      return { icon: '󰖘', text: 'Light Snow' };
      break;	//Light Snow
    case 5001:
      return { icon: '󰖘', text: 'Flurries' };
      break;	//Flurries
    case 8000:
      return { icon: '󰖓', text: 'Thunderstorm' };
      break;	//Thunderstorm
    case 2100:
      return { icon: '󰼰', text: 'Light Fog' };
      break;	//Light Fog
    case 2000:
      return { icon: '󰖑', text: 'Fog' };
      break;	//Fog
    case 1001:
      return { icon: '󰖐', text: 'Cloudy' };
      break;	//Cloudy
    case 1102:
      return { icon: '󰖐', text: 'Mostly Cloudy' };
      break;	//Mostly Cloudy
    case 1101:
      return { icon: '󰖕', text: 'Partly Cloudy' };
      break;	//Partly Cloudy
    case 1100:
      return { icon: '󰖙', text: 'Mostly Clear' };
      break; //Mostly Clear
    case 1000:
      return { icon: '󰖙', text: 'Sunny' };
      break; //Sunny
  }
}

module.exports = codeToIcon;

