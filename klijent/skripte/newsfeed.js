
function prikazi(data) {
    $("#list").empty();
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      $("#list").append(
        '<div class="news-kartica"><img class="slika-news" src="' +
          item.src +
          '"/><span class="kartica-label-news">' +
          item.name +
          '</span>'+'<span class="news-text">'+item.news+'</span>'+
          '<span class="news-read-more">jos...</span>'
      );
    }
  
    $(".add").click(function(e) {
      let ukus = e.target.getAttribute("value");
      addScoop(ukus);
    });
}

function ucitaj(resurs) {
    $.ajax({
      url: resurs,
      success: function(result) {
        vesti = result.data;
        prikazi(vesti);
      }
    });
}

ucitaj('../server/baza/news.json');