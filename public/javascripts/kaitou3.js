var doc = document.getElementById("modoru");
var mydiv = document.getElementById("myid2");
doc.innerHTML = "<a href=/Answer_back?name=" + encodeURIComponent(mydiv.innerText) + ">戻る</a>"