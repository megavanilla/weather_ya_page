<?php
// создание нового cURL ресурса
$ch = curl_init();

// установка URL и других необходимых параметров
curl_setopt($ch, CURLOPT_URL, "https://www.yandex.ru/");
curl_setopt($ch, CURLOPT_HEADER, 0);

// загрузка страницы и выдача её браузеру
curl_exec($ch);

// завершение сеанса и освобождение ресурсов
curl_close($ch);

?>
<script>
  /**
   *
   * @param parent - название предка
   * @returns {boolean}
   */
  function parsePage(parent) {
    this.parent = parent;
    this.findText = document.getElementById('text') || null;
    if (!this.findText) {
      return false;
    }
    this.buttonFind = this.findText.parentNode.parentNode.parentNode.nextSibling.querySelector('button') || null;
    this.formFind = this.findText.parentNode.parentNode.parentNode.parentNode || null;

    this.initHack = function () {
      this.buttonFind.setAttribute('type', 'button');
      this.buttonFind.setAttribute('onclick', this.parent + '.changeFindText();' + this.parent + '.formFind.submit();');
    };
    this.changeFindText = function () {
      //Для этой операции стоит повторно переопределить элемент, т.к. мы изменил его, переводя содержимое на английский.
      this.findText = document.getElementById('text') || null;
      if (!this.findText) {
        return false;
      }
      var randomString = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++) {
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      this.findText.value = randomString;
    };
    this.translateText = function (textTrans) {
      $.ajax({
        method: 'POST',
        type: 'POST',
        data: {
          key: 'trnsl.1.1.20170901T140942Z.0a198e8eb3436479.b07ff9ef976baf43330df3ce03b914b161f1a33f',
          text: textTrans.innerHTML,
          lang: 'ru-en',
          format: 'html'
        },
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
        success: function (data) {
          //console.log(data.text[0]);
          textTrans.innerHTML = data.text[0];
        }
      });

    };
  }

  var pP = new parsePage('pP');

  $(document).ready(function () {

    var btnGrp = document.createElement('div');
    btnGrp.setAttribute('class', 'btn-group');
    btnGrp.setAttribute('data-toogle', 'buttons');

    var lblWeather = document.createElement('label');
    lblWeather.setAttribute('class', 'btn btn-default');
    var inptWeather = document.createElement('input');
    inptWeather.setAttribute('type', 'radio');
    inptWeather.setAttribute('onchange', "window.location = 'index.php';");
    lblWeather.innerHTML = 'Прогноз погоды';

    lblWeather.appendChild(inptWeather);

    var lblPage = document.createElement('label');
    lblPage.setAttribute('class', 'btn btn-default active');
    var inptPage = document.createElement('input');
    inptPage.setAttribute('type', 'radio');
    inptPage.setAttribute('onchange', "window.location = 'load_content.php';");
    lblPage.innerHTML = 'Замена страницы';

    lblPage.appendChild(inptPage);

    btnGrp.appendChild(lblWeather);
    btnGrp.appendChild(lblPage);

    //Вставим кнопки переадресации
    pP.findText.parentNode.parentNode.parentNode.insertBefore(btnGrp, pP.findText.lastChild);

    //Переведём нижнюю часть текста
    pP.translateText(pP.findText.parentNode.parentNode);
    pP.translateText(document.querySelector('.container__heap'));
    pP.translateText(document.querySelector('.rows__row_last'));


    pP.initHack();

  });

</script>
