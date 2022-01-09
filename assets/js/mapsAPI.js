let map;
let infoWindow;
let places;
let initialLocation;

let ogZoom;
let ogCenter;
let current_marker;
let bounds;

let minRating = 0;

let zoomedIn = false;

let markersFinal = [];
let resultsFinal = [];

import { defaultMapStyle } from "./maps_style.js";

// no operation function
function noop() { };

// This makes sure that the marker list is shown when the user presses update for the first time.
function toggleResultsFirstLoad() {
  // This line makes it so this function only runs once.
  toggleResultsFirstLoad = noop;
  toggleResults(true);
}

// This function is called when the page loads.
$(function () {
  document.getElementById("reset-zoom-button").onclick =
    function () { resetMapZoom(); }
});

// This is to be ran by the update map button
window.updateMap = function (
  types = [''],
  keyword = "",
  radius = 20000,
  price = null,
  ratingMin = 0,
  isOpen = null) {
  console.log(types, keyword, radius, price, ratingMin, isOpen);
  toggleResultsFirstLoad();
  // This is setting the global variable to the value of the local variable.
  minRating = ratingMin;
  $('#results-list').empty();
  deleteMarkers();
  resetMapArrays();
  find(initialLocation, types, keyword, radius, price, isOpen);
}

// RESET FUNCTIONS --------------------------------------------
function resetMapArrays() {
  markersFinal.splice(0, markersFinal.length);
  resultsFinal.splice(0, resultsFinal.length);
}
window.resetMapZoom = function () {
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
// ------------------------------------------------------------

// This is the find function. It finds all places that match the search criteria.
function find(
  latLng,
  types = [''],
  keyword = "",
  radius = 20000,
  price = null,
  isOpen = null) {
  // TODO: Make it so that the find() only works for a certain latLng range.
  var request = {
    types: types,
    keyword: keyword,
    location: latLng,
    radius: radius, // This is in meters
  };

  if (isOpen) {
    request['opennow'] = isOpen;
  } if (price) {
    request['maxPriceLevel'] = price;
    // request['minPriceLevel'] = price;
  }

  console.log(request);
  infoWindow = new google.maps.InfoWindow();
  places = new google.maps.places.PlacesService(map);
  places.nearbySearch(request, callback);
}

// This is the main function that is called when the map loads
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

      // Creates a marker of user's location
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: 'Your Location'
      });
    }, function (error) {
      console.log(error)
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
    alert('Status: ' + status + '\n\nSearch options have been reset.\nPlease try a different search.');
    resetUpdateNavigation();
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
    updateResultsList();
  }
};

window.zoomIn = function (textContent) {
  document.querySelector("[title=\"" + textContent + "\"]").dispatchEvent(new Event("dblclick"));
}

function createMarkers(places) {
  for (let i = 0, place; place = places[i]; i++) {
    // This sets what the image icon should be fore the marker
    let image = {
      url: place.icon,
      // size: new google.maps.Size(71, 71),
      // origin: new google.maps.Point(0, 0),
      // anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // This makes the actual marker object
    let marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      label: '',
      position: place.geometry.location
    });

    let contentString =
      '<div id="info-content">' +
      '<h1>' + marker.getTitle() + '</h1>' +
      '<a href="https://www.google.com/maps/place/?q=place_id:' + place.place_id + '" target="_blank">' +
      'Link to Google Maps </a> <br>' +
      '<a href="javascript:void(0);" onclick="zoomIn(\'' + marker.getTitle() + '\');">' +
      'Zoom In </a>' +
      '</div>'
      ;

    // Zoom in on the marker when it is clicked.
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.close();
      infoWindow.setContent(contentString);
      infoWindow.open(this.getMap(), this);
    });

    google.maps.event.addListener(marker, 'dblclick', function () {
      console.log('zoomIn');
      map.panTo(marker.getPosition());
      if (!zoomedIn) {
        map.setZoom(17);
        zoomedIn = true;
        window.setTimeout(() => { zoomedIn = false; }, 3500);
      };
    });

    markersFinal.push(marker);
  }
}