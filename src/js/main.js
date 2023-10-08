document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons = document.getElementsByClassName("accordeon__button");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons.length; i++) {
    var accordeonButton = accordeonButtons[i];

    accordeonButton.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons.length; i++) {
      accordeonButtons[i].className = "accordeon__button closed";
    }

    // закрываем все открытые панели с текстом
    var pannels = document.getElementsByClassName("accordeon__panel");
    for (var z = 0; z < pannels.length; z++) {
      pannels[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass == "accordeon__button closed") {
      this.className = "accordeon__button active";
      var panel = this.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

  }
});
window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup1
  let popupBg = document.querySelector('.popup__bg');
  let popup = document.querySelector('.popup');
  let openPopupButtons = document.querySelectorAll('.a1');
  let closePopupButton = document.querySelector('.close-popup');

  openPopupButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg.classList.add('active');
      popup.classList.add('active');
    })
  });

  closePopupButton.addEventListener('click', () => {
    popupBg.classList.remove('active');
    popup.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg) {
      popupBg.classList.remove('active');
      popup.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg.classList.remove('active');
      popup.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup2
  let popupBg2 = document.querySelector('.popup__bg2');
  let popup2 = document.querySelector('.popup2');
  let openPopupButtons2 = document.querySelectorAll('.a2');
  let closePopupButton2 = document.querySelector('.close-popup2');

  openPopupButtons2.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg2.classList.add('active');
      popup2.classList.add('active');
    })
  });

  closePopupButton2.addEventListener('click', () => {
    popupBg2.classList.remove('active');
    popup2.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg2) {
      popupBg2.classList.remove('active');
      popup2.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg2.classList.remove('active');
      popup2.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup3
  let popupBg3 = document.querySelector('.popup__bg3');
  let popup3 = document.querySelector('.popup3');
  let openPopupButtons3 = document.querySelectorAll('.nav__btn, .a3');
  let closePopupButton3 = document.querySelector('.close-popup3');

  openPopupButtons3.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg3.classList.add('active');
      popup3.classList.add('active');
    })
  });

  closePopupButton3.addEventListener('click', () => {
    popupBg3.classList.remove('active');
    popup3.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg3) {
      popupBg3.classList.remove('active');
      popup3.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg3.classList.remove('active');
      popup3.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup4
  let popupBg4 = document.querySelector('.popup__bg4');
  let popup4 = document.querySelector('.popup4');
  let openPopupButtons4 = document.querySelectorAll('.nav__link');
  let closePopupButton4 = document.querySelector('.close-popup4');

  openPopupButtons4.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg4.classList.add('active');
      popup4.classList.add('active');
    })
  });

  closePopupButton4.addEventListener('click', () => {
    popupBg4.classList.remove('active');
    popup4.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg4) {
      popupBg4.classList.remove('active');
      popup4.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg4.classList.remove('active');
      popup4.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup5
  let popupBg5 = document.querySelector('.popup__bg5');
  let popup5 = document.querySelector('.popup5');
  let openPopupButtons5 = document.querySelectorAll('.popup4__btn');
  let closePopupButton5 = document.querySelector('.close-popup5');

  openPopupButtons5.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg5.classList.add('active');
      popup5.classList.add('active');
    })
  });

  closePopupButton5.addEventListener('click', () => {
    popupBg5.classList.remove('active');
    popup5.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg5) {
      popupBg5.classList.remove('active');
      popup5.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg5.classList.remove('active');
      popup5.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup6
  let popupBg6 = document.querySelector('.popup__bg6');
  let popup6 = document.querySelector('.popup6');
  let openPopupButtons6 = document.querySelectorAll('.cont__btn_1');
  let closePopupButton6 = document.querySelector('.close-popup6');

  openPopupButtons6.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg6.classList.add('active');
      popup6.classList.add('active');
    })
  });

  closePopupButton6.addEventListener('click', () => {
    popupBg6.classList.remove('active');
    popup6.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg6) {
      popupBg6.classList.remove('active');
      popup6.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg6.classList.remove('active');
      popup6.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup7
  let popupBg7 = document.querySelector('.popup__bg7');
  let popup7 = document.querySelector('.popup7');
  let openPopupButtons7 = document.querySelectorAll('.cont__btn_2');
  let closePopupButton7 = document.querySelector('.close-popup7');

  openPopupButtons7.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg7.classList.add('active');
      popup7.classList.add('active');
    })
  });

  closePopupButton7.addEventListener('click', () => {
    popupBg7.classList.remove('active');
    popup7.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg7) {
      popupBg7.classList.remove('active');
      popup7.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg7.classList.remove('active');
      popup7.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup8
  let popupBg8 = document.querySelector('.popup__bg8');
  let popup8 = document.querySelector('.popup8');
  let openPopupButtons8 = document.querySelectorAll('.cont__btn_3');
  let closePopupButton8 = document.querySelector('.close-popup8');

  openPopupButtons8.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg8.classList.add('active');
      popup8.classList.add('active');
    })
  });

  closePopupButton8.addEventListener('click', () => {
    popupBg8.classList.remove('active');
    popup8.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg8) {
      popupBg8.classList.remove('active');
      popup8.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg8.classList.remove('active');
      popup8.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup9
  let popupBg9 = document.querySelector('.popup__bg9');
  let popup9 = document.querySelector('.popup9');
  let openPopupButtons9 = document.querySelectorAll('.cont__edit_1');
  let closePopupButton9 = document.querySelector('.close-popup9');

  openPopupButtons9.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg9.classList.add('active');
      popup9.classList.add('active');
    })
  });

  closePopupButton9.addEventListener('click', () => {
    popupBg9.classList.remove('active');
    popup9.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg9) {
      popupBg9.classList.remove('active');
      popup9.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg9.classList.remove('active');
      popup9.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup10
  let popupBg10 = document.querySelector('.popup__bg10');
  let popup10 = document.querySelector('.popup10');
  let openPopupButtons10 = document.querySelectorAll('.cont__edit_2');
  let closePopupButton10 = document.querySelector('.close-popup10');

  openPopupButtons10.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg10.classList.add('active');
      popup10.classList.add('active');
    })
  });

  closePopupButton10.addEventListener('click', () => {
    popupBg10.classList.remove('active');
    popup10.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg10) {
      popupBg10.classList.remove('active');
      popup10.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg10.classList.remove('active');
      popup10.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup11
  let popupBg11 = document.querySelector('.popup__bg11');
  let popup11 = document.querySelector('.popup11');
  let openPopupButtons11 = document.querySelectorAll('.cont__edit_3');
  let closePopupButton11 = document.querySelector('.close-popup11');

  openPopupButtons11.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg11.classList.add('active');
      popup11.classList.add('active');
    })
  });

  closePopupButton11.addEventListener('click', () => {
    popupBg11.classList.remove('active');
    popup11.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg11) {
      popupBg11.classList.remove('active');
      popup11.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg11.classList.remove('active');
      popup11.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup12
  let popupBg12 = document.querySelector('.popup__bg12');
  let popup12 = document.querySelector('.popup12');
  let openPopupButtons12 = document.querySelectorAll('.a4');
  let closePopupButton12 = document.querySelector('.close-popup12');

  openPopupButtons12.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg12.classList.add('active');
      popup12.classList.add('active');
    })
  });

  closePopupButton12.addEventListener('click', () => {
    popupBg12.classList.remove('active');
    popup12.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg12) {
      popupBg12.classList.remove('active');
      popup12.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg12.classList.remove('active');
      popup12.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup13
  let popupBg13 = document.querySelector('.popup__bg13');
  let popup13 = document.querySelector('.popup13');
  let openPopupButtons13 = document.querySelectorAll('.help__btn');
  let closePopupButton13 = document.querySelector('.close-popup13');

  openPopupButtons13.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg13.classList.add('active');
      popup13.classList.add('active');
    })
  });

  closePopupButton13.addEventListener('click', () => {
    popupBg13.classList.remove('active');
    popup13.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg13) {
      popupBg13.classList.remove('active');
      popup13.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg13.classList.remove('active');
      popup13.classList.remove('active');
    }
  });
});
window.addEventListener("DOMContentLoaded", function () {
  $('body').on('click', '.password-control', function () {
    if ($('#password-input').attr('type') == 'password') {
      $(this).addClass('view');
      $('#password-input').attr('type', 'text');
    } else {
      $(this).removeClass('view');
      $('#password-input').attr('type', 'password');
    }
    return false;
  });
});
window.addEventListener("DOMContentLoaded", function () {
  $('body').on('click', '.password-control2', function () {
    if ($('#password-input2').attr('type') == 'password') {
      $(this).addClass('view');
      $('#password-input2').attr('type', 'text');
    } else {
      $(this).removeClass('view');
      $('#password-input2').attr('type', 'password');
    }
    return false;
  });
});
window.addEventListener("DOMContentLoaded", function () {
  $('body').on('click', '.password-control3', function () {
    if ($('#password-input3').attr('type') == 'password') {
      $(this).addClass('view');
      $('#password-input3').attr('type', 'text');
    } else {
      $(this).removeClass('view');
      $('#password-input3').attr('type', 'password');
    }
    return false;
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn1').on('click', function () {
    $('.item__btn1').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn2').on('click', function () {
    $('.item__btn2').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn3').on('click', function () {
    $('.item__btn3').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn4').on('click', function () {
    $('.item__btn4').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn5').on('click', function () {
    $('.item__btn5').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn6').on('click', function () {
    $('.item__btn6').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn7').on('click', function () {
    $('.item__btn7').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn8').on('click', function () {
    $('.item__btn8').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn9').on('click', function () {
    $('.item__btn9').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn10').on('click', function () {
    $('.item__btn10').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn11').on('click', function () {
    $('.item__btn11').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn12').on('click', function () {
    $('.item__btn12').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn13').on('click', function () {
    $('.item__btn13').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.item__btn14').on('click', function () {
    $('.item__btn14').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.view__add').on('click', function () {
    $('.view__add').toggleClass('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.search-box').hover(function () {
    $(this).width('250px')
    $(this).find('input').show()
    $(this).find('button[type="submit"]').width('12.8%')
  }, function () {
    $(this).removeAttr('style')
    $(this).find('input').removeAttr('style')
    $(this).find('button[type="submit"]').removeAttr('style')
  })
});
document.addEventListener('DOMContentLoaded', function () {
  const swiper2 = new Swiper('.swiper2', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next2',
      prevEl: '.swiper-button-prev2',
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 4,
    spaceBetween: 69,
    pagination: {
      el: ".swiper-pagination4",
    },
    navigation: {
      nextEl: '.swiper-button-next4',
      prevEl: '.swiper-button-prev4',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 3
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      1200: {
        spaceBetween: 69,
        slidesPerView: 4
      }
    }
  });
  const swiper33 = new Swiper('.swiper33', {
    slidesPerView: 4,
    spaceBetween: 28,
    pagination: {
      el: ".swiper-pagination33",
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev4',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 3
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      1200: {
        spaceBetween: 28,
        slidesPerView: 4
      }
    }
  });
  // const swiper44 = new Swiper('.swiper44', {
  //   slidesPerView: 4,
  //   loop: false,
  //   spaceBetween: 15,
  //   pagination: {
  //     el: ".swiper-pagination44",
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next44',
  //     prevEl: '.swiper-button-prev44',
  //   },
  //   breakpoints: {
  //     // when window width is >= 320px
  //     320: {
  //       spaceBetween: 0,
  //       loop: true,
  //       slidesPerView: 1
  //     },
  //     767: {
  //       spaceBetween: 10,
  //       slidesPerView: 3
  //     },
  //     992: {
  //       spaceBetween: 15,
  //       slidesPerView: 4
  //     },
  //     1200: {
  //       spaceBetween: 15,
  //       slidesPerView: 4
  //     }
  //   }
  // });
  const swiper4 = new Swiper('.swiper4', {
    slidesPerView: 4,
    spaceBetween: 42,
    navigation: {
      nextEl: '.swiper-button-next5',
      prevEl: '.swiper-button-prev5',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 24,
        loop: true,
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination55",
        },
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 3
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      1200: {
        spaceBetween: 42,
        slidesPerView: 4
      }
    }
  });
});
// document.addEventListener("DOMContentLoaded", () => {
//   const progressCircle = document.querySelector(".autoplay-progress svg");
//   const progressContent = document.querySelector(".autoplay-progress span");
//   var swiper = new Swiper(".swiper44", {
//     slidesPerView: 4,
//     spaceBetween: 70,
//     loop: true,
//     autoplay: {
//       delay: 8450,
//       disableOnInteraction: false
//     },
//     navigation: {
//       nextEl: ".swiper-button-next44",
//       prevEl: ".swiper-button-prev44"
//     },
//     on: {
//       autoplayTimeLeft(s, time, progress) {
//         progressCircle.style.setProperty("--progress", 1 - progress);
//         progressContent.textContent = `${Math.ceil(time / 1000)}s`;
//       }
//     },
//     breakpoints: {
//       // when window width is >= 320px
//       320: {
//         spaceBetween: 0,
//         loop: true,
//         slidesPerView: 1
//       },
//       767: {
//         spaceBetween: 30,
//         slidesPerView: 2
//       },
//       992: {
//         spaceBetween: 40,
//         slidesPerView: 3
//       },
//       1200: {
//         spaceBetween: 70,
//         slidesPerView: 4
//       }
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  let menuBtn = document.querySelector('.menu-btn');
  let menu = document.querySelector('.menu');
  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  let menuBtn2 = document.querySelector('.menu-btn2');
  let menu2 = document.querySelector('.menu2');
  menuBtn2.addEventListener('click', function () {
    menuBtn2.classList.toggle('active');
    menu2.classList.toggle('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // svg
  $(function () {
    jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });
  });
});

