function Reports(container_chart)
{
  this.container_chart = container_chart;

  this.getWeather = function () {
    var parent = this;

    $.ajax({
      method: 'POST',
      type: 'POST',
      data: {
        'q': 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="nome, ak")',
        'env': 'store://datatables.org/alltableswithkeys',
        'format': 'json'
      },
      url: 'https://query.yahooapis.com/v1/public/yql',
      success: function (data) {
        if(
          data.hasOwnProperty('query')
          && data['query'].hasOwnProperty('results')
          && data['query']['results'].hasOwnProperty('channel')
          && data['query']['results']['channel'].hasOwnProperty('item')
          && data['query']['results']['channel']['item'].hasOwnProperty('forecast')
        ){
          var forecast = parent.prepData(data['query']['results']['channel']['item']['forecast']);

          buildChart(parent.container_chart, {
              'title': 'Прогноз погоды',
              'subtitle': '',
              'x_title': 'Дата',
              'y_title': 'Показатель'
            },
            forecast
          );

        }
      }
    });
  };
  this.prepData = function(data){

    var maxTemp = {
      'name': 'Максимальная температура',
      'data': []
    };
    var minTemp = {
      'name': 'Минимальная температура',
      'data': []
    };
    var cloudyImg = {
      'name': 'Облачность',
      'data': [],
      'color': 'rgba(248,161,63,0)',
      'marker': {
        'symbol': 'square'
      },
      dataLabels: {
        useHTML: true,
        enabled: true,
        x: -40,
        y: -90,
        formatter: function () {
          return '<img class="weather_'+this.y+'" src="web/img/transparent.png">';
          //return '<img class="weather_'+45+'" src="web/img/transparent.png">';
        }
      }

    };

    for(var row in data){
      if(data.hasOwnProperty(row)) {
        var date = this.parseDate(data[row]['date']);

        minTemp['data'].push([date, data[row]['low']*1]);
        maxTemp['data'].push([date, data[row]['high']*1]);
        cloudyImg['data'].push([date, data[row]['code']*1]);
      }
    }
    return [
      minTemp,
      maxTemp,
      cloudyImg
    ];
  };
  this.parseDate = function(date){
    if(date){
      return Date.UTC(this.getYear(date), this.getMonth(date), this.getDay(date));
    }
  };
  /**
   * Форматирование года из выборки.
   *
   * @param time
   * @returns {Number}
   * @private
   */
  this.getYear = function (time) {
    if (time) {
      return parseInt(time.toString().substr(7, 4));
    }
  };
  /**
   * Форматирование времени из выборки.
   *
   * @param time
   * @returns {Number}
   * @private
   */
  this.getMonth = function (time) {
    if (time) {
      var month = time.toString().substr(3, 3);
      var num_month = 1;
      switch(month){
        case 'Jan':
          num_month = 1;
          break;
        case 'Feb':
          num_month = 2;
          break;
        case 'Mar':
          num_month = 3;
          break;
        case 'Apr':
          num_month = 4;
          break;
        case 'May':
          num_month = 5;
          break;
        case 'Jun':
          num_month = 6;
          break;
        case 'Jul':
          num_month = 7;
          break;
        case 'Aug':
          num_month = 8;
          break;
        case 'Sep':
          num_month = 9;
          break;
        case 'Oct':
          num_month = 10;
          break;
        case 'Nov':
          num_month = 11;
          break;
        case 'Dec':
          num_month = 12;
          break;
      }

      return num_month;
    }
  };
  /**
   * Форматирование дня из выборки.
   *
   * @param time
   * @returns {Number}
   * @private
   */
  this.getDay = function (time) {
    if (time) {
      return parseInt(time.toString().substr(0, 2));
    }
  };
}

function yandexChange(container_contant_yandex){
  this.container_contant_yandex = container_contant_yandex;
  this.yandexContentIframe = document.getElementById(this.container_contant_yandex) || null;
  this.yandexContent = this.yandexContentIframe.contentWindow.document || null;

  /**
   * Подгружает страницу яндекса
   */
  this.getContentYandex = function(){
    var parent = this;

    $.ajax({
      method: 'POST',
      type: 'POST',
      data: {
        'lr': 11453,
        'msid': '1504260009.5147.22884.4182',
        'test': 'Привет мир'
      },
      url: 'load_content.php',
      success: function (data) {
        if(parent.yandexContent === null){return false;}

        parent.yandexContent.innerHTML = data;
      }
    });
  };

  /**
   * Убирает некоторые бросающиеся в глаза элементы со страницы яндекса
   */
  this.clearfixContentYandex = function(){

  };

  this.translateContent = function(){
    if(this.yandexContent === null){return false;}

    var findText = this.yandexContent.getElementById('text') || null;
    if(!findText){return false;}

    findText.value = 'qwerty';
  };

}
