//  updateMap(['spa'], 20000, 3, 2.0, true)
let navigationValues = {
  'typeArray': [],
  'keyword': '',
  'radius': 10000,
  'maxPrice': 4,
  'ratingMin': 0,
  'isOpen': null
}

// TODO: Make this better with a drop down menu
window.customUpdateNavigation = function () {
  let keyword = prompt('Enter a keyword to search for:');
  updateNavigation('typeArray', []);
  updateNavigation('keyword', keyword ? keyword : '');
}

window.updateNavigation = function (varName, value) {
  navigationValues[varName] = value;
  console.log(navigationValues);
}

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
  if (num == 0) {
    updateMap(
      navigationValues.typeArray, // Types
      navigationValues.keyword, // Keyword
      navigationValues.radius, // Radius
      navigationValues.maxPrice, // Max Price
      navigationValues.ratingMin, // Min Rating
      navigationValues.isOpen // Is Open
    );
    return;
  }
  document.getElementById("myDropdown" + num).classList.toggle("show");
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