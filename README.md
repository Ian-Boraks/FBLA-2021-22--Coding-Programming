
# Colorful Colrado Attractions
### [attractions.cc](https://www.attractions.cc/)

Attractions.cc is designed for Colorado's torusim bureau to help potential visitors find important locations all around the state. 


## Screenshots

Shown below is the initial view the user will have on the website.
* At the top of the page is the location selection filters.
* The main body of the page is the custom implementation of Google Maps.
* In the bottom left of the page is the location list, reset zoom button, and the help button.

![Main App](https://imgur.com/d4CDMyR.jpg)

### Location Selection Filters
![Min Rating](https://imgur.com/SChB8en.jpg)
![Distance](https://imgur.com/BA42hbm.jpg)
![Max Price](https://imgur.com/DmXNNG7.jpg)
![Open or Closed](https://imgur.com/Sfqr5qT.jpg)

This is the type selection menu. There is a custom option where the user can input any keyword(s) that they would like to search for.
![Type](https://imgur.com/3Be9glS.jpg)
![Custom Type](https://imgur.com/EBAxJEH.jpg)

### Location List and Marker Pop Up
![List](https://imgur.com/DggX34z.jpg)
![Pop Up](https://imgur.com/M5J4Ywp.jpg)



## Code Walkthrough

This is the main function that is called when the map loads:
```javascript
window.initMap = function () {
  // This is setting up the map with the default values and style.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 0, lng: 0 },
    zoomDelta: 0.25,
    styles: defaultMapStyle
  });

  // This makes sure that the user has geolocation enabled for the website.
  if (navigator.geolocation) {
    // This find the user location.
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);

      // Creates a marker at the user's location
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: 'Your Location'
      });
    }, function (error) {
      // console.log(error)
    });
  } else {
    alert('Geolocation is not supported/enabled by this browser.\n\nPlease use a browser that supports geolocation or enable geolocation.\nhttps://www.gps-coordinates.net/geolocation');
  }

  // This statement is used to detect if the map is idle. If so, it will check the zoom level of the map.
  google.maps.event.addListener(map, 'idle', function () {
    // updateResultsList();
    if (map.getZoom() < 15) {
      zoomedIn = false;
    }
  });

  // This statement is used to detect if the user is in 'Street View' mode.
  google.maps.event.addListener(map.getStreetView(), 'visible_changed', function () {
    streetView = this.getVisible() ? true : false;
  });
}
```

This is how the code updates the results list:
```javascript
function updateResultsList() {
  // Read the bounds of the map being displayed.
  bounds = map.getBounds();
  $('#results-list').empty();

  // Iterate through all of the markers that are displayed on the *entire* map.
  for (let i = 0, l = markersFinal.length; i < l; i++) {

    current_marker = markersFinal[i];

    /* If the current marker is visible within the bounds of the current map, let's add it as a list item to #nearby-results that's located above this script. */
    if (bounds.contains(current_marker.getPosition())) {

      /* Only add a list item if it doesn't already exist. This is so that if the browser is resized or the tablet or phone is rotated, we don't have multiple results. */
      if (0 === $('#map-marker-' + i).length) {
        $('#results-list').append(
          $('<li />')
            .attr('id', 'map-marker-' + i)
            .attr('class', 'depot-result')
            .html("<a href=\"javascript:void(0);\">" + current_marker.title + "</a>")
            .click(function () {
              // This finds the div holding the marker image/data and clicks it.
              document.querySelector("[title=\"" + this.textContent + "\"]").dispatchEvent(new Event("click"));
            })
        );
      }
    }
  }
}
```

This is the function that is called when the map needs to update for a changed user filter:
```javascript
window.updateMap = function (
  types = [''],
  keyword = "",
  radius = 20000,
  price = null,
  ratingMin = 0,
  isOpen = null) {
  // console.log(types, keyword, radius, price, ratingMin, isOpen);
  toggleResultsFirstLoad();
  // This is setting the global variable to the value of the local variable.
  minRating = ratingMin;
  $('#results-list').empty();
  deleteMarkers();
  resetMapArrays();
  find(initialLocation, types, keyword, radius, price, isOpen);
}
```

The above function is called from the navagation bar's 'update' button with:
```javascript
updateMap(
    navigationValues.typeArray, // Types
    navigationValues.keyword, // Keyword
    navigationValues.radius, // Radius
    navigationValues.price, // Price
    navigationValues.ratingMin, // Min Rating
    navigationValues.isOpen // Is Open
);
```
## Tech Stack

**Client:** CSS3, HTML5, Javascript

**Server:** Github Pages, Google Maps API

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| geometry | ![#ebe3cd](https://via.placeholder.com/10/ebe3cd?text=+) #ebe3cd |
| labels.text.fill | ![#523735](https://via.placeholder.com/10/523735?text=+) #523735 |
| labels.text.stroke | ![#f5f1e6](https://via.placeholder.com/10/f5f1e6?text=+) #f5f1e6 |
| geometry.stroke | ![#c9b2a6](https://via.placeholder.com/10/c9b2a6?text=+) #c9b2a6 |
| geometry.stroke | ![#dcd2be](https://via.placeholder.com/10/dcd2be?text=+) #dcd2be |
| labels | ![#ae9e90](https://via.placeholder.com/10/ae9e90?text=+) #ae9e90 |
| geometry | ![#dfd2ae](https://via.placeholder.com/10/dfd2ae?text=+) #dfd2ae |
| labels.text | ![#93817c](https://via.placeholder.com/10/93817c?text=+) #93817c |
| geometry.fill | ![#a5b076](https://via.placeholder.com/10/a5b076?text=+) #a5b076 |
| labels.text.fill | ![#447530](https://via.placeholder.com/10/447530?text=+) #447530 |
| geometry | ![#f5f1e6](https://via.placeholder.com/10/f5f1e6?text=+) #f5f1e6 |
| geometry | ![#fdfcf8](https://via.placeholder.com/10/fdfcf8?text=+) #fdfcf8 |
| geometry | ![#f8c967](https://via.placeholder.com/10/f8c967?text=+) #f8c967 |
| geometry.stroke | ![#e9bc62](https://via.placeholder.com/10/e9bc62?text=+) #e9bc62 |
| geometry | ![#e98d58](https://via.placeholder.com/10/e98d58?text=+) #e98d58 |
| geometry.stroke | ![#db8555](https://via.placeholder.com/10/db8555?text=+) #db8555 |
| labels | ![#806b63](https://via.placeholder.com/10/806b63?text=+) #806b63 |
| geometry | ![#dfd2ae](https://via.placeholder.com/10/dfd2ae?text=+) #dfd2ae |
| labels.text.fill | ![#8f7d77](https://via.placeholder.com/10/8f7d77?text=+) #8f7d77 |
| labels.text.stroke | ![#ebe3cd](https://via.placeholder.com/10/ebe3cd?text=+) #ebe3cd |

