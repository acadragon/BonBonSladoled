var korpa;
var iceCream;
var scoops = [];
var sladoledi = [];

var sladolediUKorpi = [];
var sladoledUIzdradi = {kugle:[]};

function ucitaj(resurs) {
  $.ajax({
    url: resurs,
    success: function(result) {
      sladoledi = result.data;
      prikazi(sladoledi);
      podesiKorpu();
    }
  });
}

function prikazi(data) {
  $("#list").empty();
  for (var i = 0; i < data.length; i++) {
    let item = data[i];
    $("#list").append(
      '<div class="kartica"><img class="slika" src="' +
        item.src +
        '"/><span class="kartica-label">' +
        item.name +
        '</span><span class="kartica-label">' +
        item.price +
        'din</span><div class="add" value="' +
        item.name.split(" ")[0] +
        '" >+</div></div>'
    );
  }

  $(".add").click(function(e) {
    let ukus = e.target.getAttribute("value");
    addScoop(ukus);
  });
  $("#cone").click(function(e) {
    dodajuKorpu(sladoledUIzdradi);
    clearScoops();
  });
}

function addScoop(ukus, zapamti = true) {
  iceCream = document.querySelector("#scoops");
  var scoop = document.createElement("div");
  var scoopImage = document.createElement("img");
  scoopImage.classList.add(ukus);
  scoopImage.src = "../server/slike/scoop.png";

  scoop.appendChild(scoopImage);
  scoop.style.top = -5 - scoops.length * 4 + "vh";
  scoop.classList.add("scoop");
  scoop.classList.add("pad");

  iceCream.appendChild(scoop);
  scoops.push(scoop);

  if (zapamti) {
    sladoledUIzdradi.kugle = [...(sladoledUIzdradi.kugle || []), ukus];
    sladoledUIzdradi[ukus] = {
      kolicina:
        ((sladoledUIzdradi[ukus] && sladoledUIzdradi[ukus].kolicina) || 0) + 1,
      jedCena: sladoledi.find(sladoled => sladoled.name === ukus).price
    };
    sladoledUIzdradi[ukus].total =
      (sladoledUIzdradi[ukus] &&
        sladoledUIzdradi[ukus].kolicina * sladoledUIzdradi[ukus].jedCena) ||
      0;

    if (korpa)
      korpa.setItem("sladoledUIzradi", JSON.stringify(sladoledUIzdradi));
  }
}

function clearScoops() {
  iceCream.innerHTML = "";
  scoops = [];
}

function podesiKorpu() {
  korpa = window.localStorage;
  $(".order").click(dodajuKorpu);
  $("#cancel-button").click(function(e) {
    $("body").toggleClass("noScroll");
    $("#order-popup").toggleClass("hidden");
  });
  if (!korpa) alert("Local storage nije podrzan");
  var porudzbine = korpa.getItem("porudzbine");
  if (porudzbine) {
    sladolediUKorpi = JSON.parse(korpa.getItem("porudzbine")) || sladolediUKorpi;
    sladoledUIzdradi = JSON.parse(korpa.getItem("sladoledUIzradi")) || sladoledUIzdradi;
    ucitajSladoledUIzradi();
    $("#order-forma").submit(function(e) {
      e.preventDefault();

      var $form = $(this);
      var data = $form.serializeArray();
      data.push({
        name: "sladoledi",
        value: encodeURIComponent(JSON.stringify(sladolediUKorpi))
      });
      $.post($form.attr("action"), data).then(function() {
        alert("Hvala! Vas sladoled stize uskoro");
      });
    });
  } else {
    korpa.setItem("porudzbine", JSON.stringify([]));
  }
 
  $("#cart").click(function(e) {
    prikaziPorudzbine();
    $("#order-popup").toggleClass("hidden");
  });
}

function ucitajSladoledUIzradi() {
  if (sladoledUIzdradi && sladoledUIzdradi.kugle) {
    sladoledUIzdradi.kugle.forEach(kugla => {
      this.addScoop(kugla, false);
    });
  }
}

function prikaziPorudzbine() {
  var total = 0;
  $("#order-items").empty();
  var poruceniSladoledi = JSON.parse(korpa.getItem("porudzbine"));
  if (poruceniSladoledi.length) {
    poruceniSladoledi.forEach((sladoled, i) => {
      $("#order-items").append(
        `<div class="item"> <p>#${i +
          1} 🍦</p> <p id="remove" value=${i}>Obrisi</p></div>`
      );
      if (sladoled && sladoled.kugle) {
        var kugle = Object.keys(sladoled);
        kugle.shift();
        kugle.forEach(kugla => {
          $("#order-items").append(
            `<div class="sub-item">
                <p>${kugla}</p>
                <p>${sladoled[kugla].kolicina}</p>
                <p>${sladoled[kugla].jedCena} din</p>
                <p>${sladoled[kugla].total} din</p>
            </div>`
          );
          total += sladoled[kugla].total;
        });
      }
    });
  }
  $("#total-price").text(`${total} din`);
}

function dodajuKorpu(sladoled) {
  // Dodaj porudzbinu i prikazi formu
  if (Object.keys(sladoledUIzdradi).length) {
    sladolediUKorpi.push(sladoledUIzdradi);
    korpa.setItem("porudzbine", JSON.stringify(sladolediUKorpi));
    sladoledUIzdradi = {};
    korpa.setItem("sladoledUIzradi", JSON.stringify(sladoledUIzdradi));
    prikaziPorudzbine();
    clearScoops();
    $("#order-popup").css("top", window.scrollY + "px");
    $("body").toggleClass("noScroll");
    $("#order-popup").toggleClass("hidden");

    $("#order-items").click(function(e) {
      if (e.target.id === "remove") {
        sladolediUKorpi = sladolediUKorpi.filter(
          (sladoled, i) => i != e.target.getAttribute("value")
        );
        korpa.setItem("porudzbine", JSON.stringify(sladolediUKorpi));
        prikaziPorudzbine();
      }
    });
  }
}

function ispraziKorpu() {
  if (korpa) {
    korpa.setItem("porudzbine", JSON.stringify([]));
  }
}

ucitaj("../server/baza/bombone.json");
$( "79" ).blur(function() {

let re = /^(([^<>()[].,;:\s@"]+(.[^<>()[].,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

let isValid = re.test($( "79" ).val());

If (isValid) {
$( "79" ).css("color", "green");
} else {
$( "79" ).css("color", "red");
}

});
