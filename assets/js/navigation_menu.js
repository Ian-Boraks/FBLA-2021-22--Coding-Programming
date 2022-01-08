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
  let type = prompt('Enter a type from the list below or click cancle to only enter a keyword:\naccounting\nairport\namusement_park\naquarium\nart_gallery\natm\nbakery\nbank\nbar\nbeauty_salon\nbicycle_store\nbook_store\nbowling_alley\nbus_station\ncafe\ncampground\ncar_dealer\ncar_rental\ncar_repair\ncar_wash\ncasino\ncemetery\nchurch\ncity_hall\nclothing_store\nconvenience_store\ncourthouse\ndentist\ndepartment_store\ndoctor\ndrugstore\nelectrician\nelectronics_store\nembassy\nfire_station\nflorist\nfuneral_home\nfurniture_store\ngas_station\ngym\nhair_care\nhardware_store\nhindu_temple\nhome_goods_store\nhospital\ninsurance_agency\njewelry_store\nlaundry\nlawyer\nlibrary\nlight_rail_station\nliquor_store\nlocal_government_office\nlocksmith\nlodging\nmeal_delivery\nmeal_takeaway\nmosque\nmovie_rental\nmovie_theater\nmoving_company\nmuseum\nnight_club\npainter\npark\nparking\npet_store\npharmacy\nphysiotherapist\nplumber\npolice\npost_office\nprimary_school\nreal_estate_agency\nrestaurant\nroofing_contractor\nrv_park\nschool\nsecondary_school\nshoe_store\nshopping_mall\nspa\nstadium\nstorage\nstore\nsubway_station\nsupermarket\nsynagogue\ntaxi_stand\ntourist_attraction\ntrain_station\ntransit_station\ntravel_agency\nuniversity\nveterinary_care\nzoo\n');
  let keyword = prompt('Enter any keyword/s to search for or click cancle to only use a type');
  updateNavigation('typeArray', type ? [type] : []);
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