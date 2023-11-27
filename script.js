class WeatherWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.fetchWeatherData();
    }
  
    fetchWeatherData() {
      const latitude = 52.52; // Широта
      const longitude = 13.41; // Долгота
  
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`)
        .then(response => response.json())
        .then(data => {
          const currentWeather = data.current;
  
          // Обработка полученных данных для текущей погоды
          const currentTemperature = currentWeather.temperature_2m.toFixed(1);
          const currentWindSpeed = currentWeather.wind_speed_10m.toFixed(1);
  
          this.shadowRoot.querySelector('.current-temperature').textContent = `${currentTemperature} °C`;
          this.shadowRoot.querySelector('.current-wind').textContent = `${currentWindSpeed} m/s`;
  
          const hourlyWeather = data.hourly;
  
          // Обработка полученных данных для прогноза погоды по часам
          const hourlyTime = hourlyWeather.time;
          const hourlyTemperature = hourlyWeather.temperature_2m.map(temp => temp.toFixed(1));
          const hourlyHumidity = hourlyWeather.relative_humidity_2m;
          const hourlyWindSpeed = hourlyWeather.wind_speed_10m.map(speed => speed.toFixed(1));
  
          // Отображение прогноза погоды в компоненте
          const forecastContainer = this.shadowRoot.querySelector('.forecast-container');
          forecastContainer.innerHTML = '';
  
          for (let i = 0; i < hourlyTime.length; i++) {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
  
            forecastItem.innerHTML = `
              <p>Время: ${hourlyTime[i]}</p>
              <p>Температура: ${hourlyTemperature[i]} °C</p>
              <p>Влажность: ${hourlyHumidity[i]}%</p>
              <p>Скорость ветра: ${hourlyWindSpeed[i]} m/s</p>
            `;
  
            forecastContainer.appendChild(forecastItem);
          }
        })
        .catch(error => {
          console.error('Произошла ошибка при получении погоды:', error);
        });
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: Arial;
          }
  
          .widget-container {
            background-color: var(--widget-background-color);
            color: var(--widget-font-color);
            font-size: var(--widget-font-size);
            padding: 10px;
          }
  
          h2 {
            color: blue;
          }
  
          .current-temperature {
            font-weight: bold;
          }
  
          .forecast-container {
            margin-top: 10px;
          }
  
          .forecast-item {
            border-top: 1px solid gray;
            padding-top: 5px;
            margin-top: 5px;
          }
        </style>
  
        <div class="widget-container">
          <h2>Погода сегодня</h2>
          <p>Текущая температура: <span class="current-temperature">—</span></p>
          <p>Скорость ветра: <span class="current-wind">—</span></p>
          <h3>Прогноз погоды по часам</h3>
          <div class="forecast-container"></div>
        </div>
      `;
    }
  }
  
  customElements.define('weather-widget', WeatherWidget);