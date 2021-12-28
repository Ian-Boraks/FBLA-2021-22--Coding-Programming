let map;
let infowindow;
let places;
let initialLocation;
let searchTypes = ["food", "bar"];


function find(latLng, types, radius) {
    var request = {
        types: types,
        location: latLng,
        radius: radius
    };
    infowindow = new google.maps.InfoWindow();
    places = new google.maps.places.PlacesService(map);
    places.nearbySearch(request, callback);
}

window.initMap = function (types = searchTypes, radius = 10000) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 0, lng: 0 }
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
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
}

function callback(results, status, pagination) {
    if (status !== 'OK') return;

    createMarkers(results);
};

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}