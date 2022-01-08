let map;
let infowindow;
let places;
let initialLocation;

let ogZoom;
let ogCenter;
let current_marker;
let bounds;

let minRating = 0;

let zoomedIn = false;

let markersFinal = [];
let typeArray = [];
let resultsFinal = [];

// This function is called when the page loads.
$(function () {
  document.getElementById("reset-zoom-button").onclick =
    function () { resetMapZoom(); }
});

// * This is to be ran by the update map button
window.updateMap = function (
  types = typeArray,
  keyword = "",
  radius = 10000,
  maxPrice = 4,
  ratingMin = 0,
  isOpen = null) {
  console.log(types, keyword, radius, maxPrice, ratingMin, isOpen);
  // This is setting the global variable to the value of the local variable.
  minRating = ratingMin;
  $('#results-list').empty();
  deleteMarkers();
  resetMapArrays();
  find(initialLocation, types, keyword, radius, maxPrice, isOpen);
}

function resetMapArrays() {
  markersFinal.splice(0, markersFinal.length);
  resultsFinal.splice(0, resultsFinal.length);
}
function resetMapZoom() {
  console.log("reset");
  map.panTo(ogCenter);
  map.setZoom(ogZoom);
  zoomedIn = false;
}
function deleteMarkers() {
  for (let i = 0; i < markersFinal.length; i++) {
    markersFinal[i].setMap(null);
  }
}

function find(
  latLng,
  types = ['restaurant'],
  keyword = "",
  radius = 10000,
  maxPrice = 4,
  isOpen = null) {
  // TODO: Make it so that the find() only works for a certain latLng range.
  var request = {
    types: types,
    keyword: keyword,
    location: latLng,
    radius: radius, // This is in meters
    maxPrice: maxPrice,
  };
  if (isOpen) {
    request['opennow'] = isOpen;
  }
  infowindow = new google.maps.InfoWindow();
  places = new google.maps.places.PlacesService(map);
  places.nearbySearch(request, callback);
}

// This is the main function that is called when the map loads
window.initMap = function () {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 0, lng: 0 },
    zoomDelta: 0.25,
    zoomSnap: 0
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
      console.log(position.coords.latitude);
      // creates a marker of user's location
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: 'Your Location'
      });
      // find(marker.getPosition());
    }, function (error) {
      console.log(error)
    });
  }

  // Modified from: https://tommcfarlin.com/tag/google-maps-api/
  google.maps.event.addListener(map, 'idle', function () {
    // updateResultsList();
    if (map.getZoom() < 15) {
      zoomedIn = false;
    }
  });

  // This resets the typeArray to an empty array.
  typeArray.splice(0, typeArray.length);
}

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

function setBounds() {
  let bounds = new google.maps.LatLngBounds();

  for (let i = 0; i < markersFinal.length; i++) {
    bounds.extend(markersFinal[i].getPosition());
  }
  map.fitBounds(bounds);
  ogZoom = map.getZoom();
  ogCenter = map.getCenter();
}

function callback(results, status, pagination) {
  if (status !== 'OK') {
    console.log(status);
    return;
  } else {
    if (minRating > 0) {
      results = results.filter(function (el) {
        return el.rating >= minRating;
      });
    }
    console.log(results);
    createMarkers(results);
    resultsFinal = resultsFinal.concat(results);
    if (pagination && pagination.hasNextPage) {
      // Note: nextPage will call the same handler function as the initial call
      pagination.nextPage();
    }
    setBounds();
  }
};

function createMarkers(places) {
  for (let i = 0, place; place = places[i]; i++) {
    // This sets what the image icon should be fore the marker
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // This makes the actual marker object
    let marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    // Zoom in on the marker when it is clicked.
    google.maps.event.addListener(marker, 'click', function () {
      let currentZoom = map.getZoom();
      console.log(currentZoom);

      map.panTo(this.getPosition());
      if (!zoomedIn) {
        map.setZoom(18);
        zoomedIn = true;
        window.setTimeout(() => { zoomedIn = false; }, 3500);
      };
    });

    markersFinal.push(marker);
  }
  updateResultsList();
}