let map;
let infowindow;
let places;
let initialLocation;

var zoomedIn = false;
var current_marker;
var bounds;
var markers = [];


function find(latLng, types, radius) {
  var request = {
    types: types,
    location: latLng,
    radius: radius, // This is in meters
  };
  infowindow = new google.maps.InfoWindow();
  places = new google.maps.places.PlacesService(map);
  places.nearbySearch(request, callback);
}

// This is the main function that is called when the page loads.
// It is also called when ever the user changes the input of there search,
// this might induce un wanted calls to the map load api but oh well :).
window.initMap = function (types = ["food", "bar"], radius = 10000) {
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
      find(marker.getPosition(), types, radius);
    }, function (error) {
      console.log(error)
    });
  }

  // Modified from: https://tommcfarlin.com/tag/google-maps-api/
  google.maps.event.addListener(map, 'idle', function () {
    // Read the bounds of the map being displayed.
    bounds = map.getBounds();
    $('#results-list').empty();

    // Iterate through all of the markers that are displayed on the *entire* map.
    for (var i = 0, l = markers.length; i < l; i++) {

      current_marker = markers[i];

      /* 
       * If the current marker is visible within the bounds of the current map,
       * let's add it as a list item to #nearby-results that's located above
       * this script.
       */
      if (bounds.contains(current_marker.getPosition())) {

        /*
         * Only add a list item if it doesn't already exist. This is so that				  				 
         * if the browser is resized or the tablet or phone is rotated, we don't
         * have multiple results.
         */
        if (0 === $('#map-marker-' + i).length) {
          $('#results-list').append(
            $('<li />')
              .attr('id', 'map-marker-' + i)
              .attr('class', 'depot-result')
              .html("<a href=\"javascript:void(0);\">" + current_marker.title + "</a>")
              .click(function () {
                document.querySelector("[title=\"" + this.textContent + "\"]").dispatchEvent(new Event("click"));
              })
          );
        }
      }
    }
  });
}

function callback(results, status, pagination) {
  if (status !== 'OK') return;

  createMarkers(results);
};

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  markers.splice(0, markers.length);

  for (var i = 0, place; place = places[i]; i++) {
    // This sets what the image icon should be fore the marker
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // This makes the actual marker object
    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    // Zoom in on the marker when it is clicked.
    google.maps.event.addListener(marker, 'click', function () {
      if (!zoomedIn) {
        zoomedIn = true;
        var ogZoom = map.getZoom();
        var ogCenter = map.getCenter();

        map.panTo(this.getPosition());
        window.setTimeout(() => { map.setZoom(17); }, 200);

        window.setTimeout(() => {
          map.setZoom(ogZoom);
          map.panTo(ogCenter);
          zoomedIn = false;
        }, 3000);
      };
    });

    bounds.extend(place.geometry.location);

    markers.push(marker);
  }
  map.fitBounds(bounds);
}