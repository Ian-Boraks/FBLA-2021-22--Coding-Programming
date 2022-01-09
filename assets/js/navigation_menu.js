let navigationValues = {
  'typeArray': [],
  'keyword': '',
  'radius': 20000,
  'price': null,
  'ratingMin': 0,
  'isOpen': null
}

// This function is for the custom type option in the navigation menu
window.customUpdateNavigation = function () {
  let keyword = prompt('Enter a keyword to search for:');
  updateNavigation('typeArray', []);
  updateNavigation('keyword', keyword ? keyword : '');
}

// This function edits the navigationValues dict based on user input from the navigation menu
window.updateNavigation = function (varName, value) {
  navigationValues[varName] = value;
  console.log(navigationValues);
}

// This function resets the navigationValues either on button press or when no results are found
window.resetUpdateNavigation = function () {
  console.log("reset");
  navigationValues = {
    'typeArray': [],
    'keyword': '',
    'radius': 20000,
    'price': null,
    'ratingMin': 0,
    'isOpen': null
  }
  alert('Reset navigation menu selections.');
}

// This function closes the dropdown menu if the user clicks a different dropdown
function closeActive(currElem) {
  var active = document.getElementsByClassName("show");
  for (var i = 0; i < active.length; i++) {
    if (active[i] != currElem) {
      active[i].classList.toggle("show")
    }
  }
}

// This function opens the drop down menu and if the update button is clicked, it will update the map
function toggleFunc(num) {
  closeActive(this);
  if (num == 0) {
    // num 0 corresponds to the update button
    updateMap(
      navigationValues.typeArray, // Types
      navigationValues.keyword, // Keyword
      navigationValues.radius, // Radius
      navigationValues.price, // Price
      navigationValues.ratingMin, // Min Rating
      navigationValues.isOpen // Is Open
    );
    return;
  }
  document.getElementById("myDropdown" + num).classList.toggle("show");
}

// This function closes the dropdown menu if the user clicks outside of it
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

// This is ran when the page loads, and makes it so that the dropdown buttons are "clickable" by hitting the enter key
$(function () {
  var dropdowns = document.getElementsByClassName("dropbutton");
  for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener("keypress",
      function (e) {
        if (e.key === "Enter") {
          this.dispatchEvent(new Event("click"));
        }
      }
    );
  }

  var options = document.getElementsByClassName("filter-option");
  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("keypress",
      function (e) {
        if (e.key === "Enter") {
          this.dispatchEvent(new Event("click"));
        }
      }
    );
  }
});
