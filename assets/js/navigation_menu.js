function closeActive(currElem) {
  var active = document.getElementsByClassName("show");
  for (var i = 0; i < active.length; i++) {
    if (active[i] != currElem) {
      active[i].classList.toggle("show")
    }
  }
}

function toggleFunc(num) {
  closeActive(this);
  if (num == 0) { return; }
  document.getElementById("myDropdown" + num).classList.toggle("show")
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbutton")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}