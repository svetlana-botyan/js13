const key = '35e29af10aabdc2629da69803a5346af'
const urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWeatherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`

// header

class Header {
  direction = ''
  hours = ''
  minutes = ''

  constructor(data) {
    this.data = data
    this.render()
  }

  render() {
    document.body.innerHTML += this.createTemplate(this.data)
  }

  createTemplate() {
    if (this.data.date.getHours() < 10) {
      this.hours = '0' + this.data.date.getHours()
    } else {
      this.hours = this.data.date.getHours()
    }

    if (this.data.date.getMinutes() < 10) {
      this.minutes = '0' + this.data.date.getMinutes()
    } else {
      this.minutes = this.data.date.getMinutes()
    }

    switch (true) {
      case this.data.windDeg == 0:
        this.direction = 'North'
      case this.data.windDeg > 0 && this.data.windDeg < 90:
        this.direction = 'North-East'
      case this.data.windDeg == 90:
        this.direction = 'East'
      case this.data.windDeg > 90 && this.data.windDeg < 180:
        this.direction = 'South-East'
      case this.data.windDeg == 180:
        this.direction = 'South'
      case this.data.windDeg > 180 && this.data.windDeg < 270:
        this.direction = 'South-West'
      case this.data.windDeg == 270:
        this.direction = 'West'
      case this.data.windDeg > 270:
        this.direction = 'North-West'
    }

    return `
    <div class="widget container">
        <div class="widget-header d-flex flex-column">
            <div class="d-flex  justify-content-between">
                <div>${this.data.city},${this.data.countryCode}</div>
                <div> <svg class="clock " width="12" height="12">
                        <use href="#clock" />
                    </svg> ${this.hours}:${this.minutes}
                </div>
            </div>
            <div class="py-3 d-flex flex-column align-items-center">
                <img src="${
                  this.data.iconSrc
                }" class="icon-header" alt="icon ">    
                <strong class="description">${this.data.description}</strong>
                <h1 class="mt-2">${Math.round(this.data.temp)}&#8451;</h1>
                <p class="temp-like">
                  Feels like: ${Math.round(this.data.tempFeelsLike)}&#8451;
                </p>
            </div> 
            <div class="d-flex justify-content-around align-items-center">
                <span> <svg class="compas" width="12" height="12" >
                        <use  href="#compas" />
                    </svg>${this.direction}</span>
                <span> <svg class="compas" width="12" height="12" >
                        <use  href="#droplet" />
                </svg>${this.data.humidity}%</span>
                <span> <svg class="wind" width="14" height="14">
                        <use href="#wind"/>
                    </svg>${this.data.windSpeed} m/s</span>
            </div>
        </div>
    </div> 
        `
  }
}

fetch(urlWeatherCurrent)
  .then((response) => response.json())
  .then((data) => {
    const weatherCurrent = {
      city: data.name,
      windDeg: data.wind.deg,
      windSpeed: data.wind.speed,
      date: new Date(data.dt * 1000),
      temp: data.main.temp - 273.15,
      tempFeelsLike: data.main.feels_like - 273.15,
      countryCode: data.sys.country,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      iconSrc: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    }

    const headerWidget = new Header(weatherCurrent)
  })

// weather for 5 days

class ItemBody {
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  hours = ''
  minutes = ''

  constructor(array) {
    this.array = array
    this.render()
  }

  render() {
    const items = this.array.map((item) => {
      const [date, iconId, temp] = [
        new Date(item.dt * 1000),
        item.weather[0].icon,
        item.main.temp,
      ]

      const iconSrc = `http://openweathermap.org/img/wn/${iconId}@2x.png`

      return this.createItemTemplate({ date, iconSrc, temp })
    })

    const itemsHTML = items.join('')

    document.body.innerHTML += itemsHTML
  }

  createItemTemplate({ date, iconSrc, temp }) {

    if (date.getHours() < 10) {
      this.hours = '0' + date.getHours()
    } else {
      this.hours = date.getHours()
    }

    if (date.getMinutes() < 10) {
      this.minutes = '0' + date.getMinutes()
    } else {
      this.minutes = date.getMinutes()
    }

    return `
  <div class="container item-widget d-flex justify-content-between align-items-center">
      <div>
          <div>
          ${date.getDate()}
          ${this.monthNames[date.getMonth()]}
          ${date.getFullYear()}
          </div>
          <div>${this.hours}:${this.minutes}</div>
      </div>
      <img src="${iconSrc}" class="icon-header" alt="icon ">
      <p class="mt-2">${Math.round(temp - 273)}&#8451;</p>
  </div>
  `
  }
}


fetch(urlWeatherByDays)
  .then((response) => response.json())
  .then((data) => {
    const weatherDays = data.list.filter((item, index) => index % 8 == 0)
    console.log(weatherDays)

    const bodyWidget = new ItemBody(weatherDays)
  })
