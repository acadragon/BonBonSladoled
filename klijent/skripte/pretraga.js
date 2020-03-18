
var Pretraga = $("#search-input");
var Filter = $("#filter-input");
var Sort = $("#sort-input");

Pretraga.on('keyup', pretrazi);
Filter.on('change', pretrazi);
Sort.on('change', pretrazi);

function pretrazi(){
    var pojam = Pretraga.val();
    var nadjeno = sladoledi.filter(sladoled=>new RegExp(pojam,'i').test(sladoled.name));

    var tip = Filter.val();
    if (tip !== 'svi') {
      nadjeno = nadjeno.filter(sladoled=>new RegExp(tip,'i').test(sladoled.type));
    }

    var sort = Sort.val();
    switch(sort) {
      case 'cenaasc':
        nadjeno = nadjeno.sort((a, b) => (parseInt(a.price) > parseInt(b.price)) ? 1 : -1);
        break;
      case 'cenadesc':
        nadjeno = nadjeno.sort((a, b) => (parseInt(a.price) < parseInt(b.price)) ? 1 : -1);
        break;
      case 'nazivasc':
        nadjeno = nadjeno.sort((a, b) => (a.name > b.name) ? 1 : -1);
        break;
      case 'nazivdesc':
        nadjeno = nadjeno.sort((a, b) => (a.name < b.name) ? 1 : -1);
        break;
      default:
        break;
    }

    prikazi(nadjeno);
}

