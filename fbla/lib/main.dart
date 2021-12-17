import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:geolocator/geolocator.dart';
import 'api.dart' as apiHolder;
import 'dart:async';

// You have been hired by your state or local area’s tourism bureau to develop a program that suggests attractions (can be tourist attractions, restaurants, shopping, things to do, etc.) to potential visitors. Your program will allow users to search for attractions in the area based on desired attributes, such as location, type of attraction, and amenities. Your program must include at least 50 attractions, and users must be able to define at least five desired attributes to search for an attraction.

var apiKey = apiHolder.apiKey;

Map<String, dynamic> resNearMeFinalMap  =   {'foo' : 'bar'};
Map<String, dynamic> resNearMeMap       =   {'foo' : 'bar'};

Future<http.Response> requestMethod(var url) async {
    var body = json.encode({"foo": "bar"});

    Map<String,String> headers = {
      'Content-type' : 'application/json', 
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    final response = await http.post(Uri.parse(url), body: body, headers: headers);
    return response;
}

Future<Position> _determinePosition() async {
  bool serviceEnabled;
  LocationPermission permission;

  // Test if location services are enabled.
  serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    // Location services are not enabled don't continue
    // accessing the position and request users of the 
    // App to enable the location services.
    return Future.error('Location services are disabled.');
  }
  
  try {
    permission = await Geolocator.checkPermission();
  } catch (e) {
    return Future.error(
      'Could not run Geolocator.checkPermission();');
  }

  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      // Permissions are denied, next time you could try
      // requesting permissions again (this is also where
      // Android's shouldShowRequestPermissionRationale 
      // returned true. According to Android guidelines
      // your App should show an explanatory UI now.
      return Future.error('Location permissions are denied');
    }
  }
  
  if (permission == LocationPermission.deniedForever) {
    // Permissions are denied forever, handle appropriately.
    await Geolocator.openLocationSettings();
    
    return Future.error(
      'Location permissions are permanently denied, we cannot request permissions.');
  } 

  // When we reach here, permissions are granted and we can
  // continue accessing the position of the device.
  return await Geolocator.getCurrentPosition();

}

Future<Map<String, dynamic>> getNextPageJson(var pageToken) async {
  var url = 
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
      "?pagetoken=$pageToken" +
      "&key=$apiKey";

  await Future.delayed(Duration(seconds: 2));

  var nextPageResponse = await requestMethod(url);
  var nextPageBody = nextPageResponse.body;
  Map<String, dynamic> nextPageMap = jsonDecode(nextPageBody);
  return nextPageMap;
}

void printPretty(Map<String, dynamic> json) async {
  JsonEncoder encoder = new JsonEncoder.withIndent('  ');
  String prettyPrint = encoder.convert(json);
  print(prettyPrint);
}

// So all of these can be used as types for the api call
// So mabey we just have a nested drop down for these
// Food
// |__ Cafe
// |__ Fast Food
// |__ Restaurant
// |__ Bar
// |__ Pub
// |__ Bakery
// Trasnportiaon
// |__ Bus
// |__ Airport
// Fun
// |__ amusement park
// |__ aquarium
// |__ zoo
// |__ museum
// |__ park
// |__ stadium
// |__ art gallery
// |__ library
// |__ movie theater
// |__ bowling alley
// etc
// |__ etc
// -------------------------
// accounting
// airport
// amusement_park
// aquarium
// art_gallery
// atm
// bakery
// bank
// bar
// beauty_salon
// bicycle_store
// book_store
// bowling_alley
// bus_station
// cafe
// campground
// car_dealer
// car_rental
// car_repair
// car_wash
// casino
// cemetery
// church
// city_hall
// clothing_store
// convenience_store
// courthouse
// dentist
// department_store
// doctor
// drugstore
// electrician
// electronics_store
// embassy
// fire_station
// florist
// funeral_home
// furniture_store
// gas_station
// gym
// hair_care
// hardware_store
// hindu_temple
// home_goods_store
// hospital
// insurance_agency
// jewelry_store
// laundry
// lawyer
// library
// light_rail_station
// liquor_store
// local_government_office
// locksmith
// lodging
// meal_delivery
// meal_takeaway
// mosque
// movie_rental
// movie_theater
// moving_company
// museum
// night_club
// painter
// park
// parking
// pet_store
// pharmacy
// physiotherapist
// plumber
// police
// post_office
// primary_school
// real_estate_agency
// restaurant
// roofing_contractor
// rv_park
// school
// secondary_school
// shoe_store
// shopping_mall
// spa
// stadium
// storage
// store
// subway_station
// supermarket
// synagogue
// taxi_stand
// tourist_attraction
// train_station
// transit_station
// travel_agency
// university
// veterinary_care
// zoo
// -------------------------

void findResNearMe(Position currentPos) async {
  String url = 
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
    "?location=${currentPos.latitude},${currentPos.longitude}" +
    "&radius=8046" + // This would let us set how far we want to search around the user. This would count as one of the options a user could change.
    "&type=restaurant" + // So that list would be edditing this value, and once this is done, we can sort the json it spits out as each place has its types listed.
    "&key=$apiKey"; 

  var resNearMeResponse = await requestMethod(url);
  var resNearMeBody = resNearMeResponse.body;
  resNearMeMap = resNearMeFinalMap = jsonDecode(resNearMeBody);
  
  for (var i = 0; i < 2; i++) {
    if (resNearMeMap['next_page_token'] != null) {
      resNearMeMap = await getNextPageJson(resNearMeMap['next_page_token']);
      resNearMeFinalMap['results'] += resNearMeMap['results'];
    }
  }

  int i = 0;
  for (var result in resNearMeFinalMap['results']) {
    i ++;
    print("$i. Name: ${result['name']}");
  }
}

void main() async {
  // findResNearMe(await _determinePosition());
  
}