var geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0) {
            updateMarkerAddress(responses[0].formatted_address);
        } else {
            updateMarkerAddress('Cannot determine address at this location.');
        }
    });
}

function updateMarkerAddress(str) {
    document.getElementById('address').innerHTML =
        document.getElementById('address2').innerHTML =
        document.getElementById('address3').innerHTML =
        document.getElementById('address4').innerHTML = str;
}

function GeoLocation(controlDiv, map) {

    controlDiv.style.padding = '5px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to place a marker at your current position';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Current Location</b>';
    controlUI.appendChild(controlText);

    // Calls getUsersLocation
    google.maps.event.addDomListener(controlUI, 'click', function () {
        getUsersLocation();
    });

}

//gets geoLocation of browser and places marker. Defaults to Central Park if cannot do so
function getUsersLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            mainmarker.setPosition(pos);
            console.log(pos)
        }, function () {
            mainmarker.setPosition(new google.maps.LatLng(14.597466, 121.0092));
        });
    } else {
        mainmarker.setPosition(new google.maps.LatLng(14.597466, 121.0092));
    }
}


var map, infowindow, player;
var msie = (document.all) ? 1 : 0;

function TabCard(tabid, cardid, position) {
    this.tabid = tabid;
    this.cardid = cardid;
    this.handleTabs = handleTabs;
    this.point = position;
    this.handleTabs(1)
}

function handleTabs(defaultTab) {
    var marker = this;
    var tabid = document.getElementById(this.tabid);
    this.newcard = this.cardid + defaultTab;
    if (!this.card) this.card = this.newcard;
    document.getElementById(this.card).style.display = "none";
    document.getElementById(this.newcard).style.display = "block";
    this.card = this.newcard;
    for (var i = 0, tab; tab = tabid.getElementsByTagName("span")[i]; i++) {
        if (tab.getAttribute("data-name") * 1 == defaultTab) {
            tab.className = "activeTab";
            tab.onmouseover = null;
            tab.onmouseout = null;
            tab.onclick = null
        } else {
            tab.className = "passiveTab";
            tab.onmouseover = function () {
                this.className = "hoverTab"
            };
            tab.onmouseout = function () {
                this.className = "passiveTab"
            };
            tab.onclick = function () {
                var name = this.getAttribute("data-name") * 1;
                var tabvalue = this.firstChild.nodeValue;
                marker.handleTabs(name);
                if (name == 5) viewStreet(marker.card, marker.point);
                else if (tabvalue == "Mini Map") seeMiniMap(marker.card, marker.point);
                return false
            }
        }
    }
}

function viewStreet(card, position) {
    var streetMap = new google.maps.StreetViewPanorama(document.getElementById(card), {
        position: mainmarker.getPosition()
    });
    streetMap.setVisible(true)
}

function seeMiniMap(card, position) {
    var mini = new google.maps.Map(document.getElementById(card), {
        center: mainmarker.getPosition(),
        zoom: 17,
        streetViewControl: false,
        mapTypeId: "hybrid",
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    })
}

var markers = [];
var mainmarker = null;

//creates mainmarker(marker used for forms)
function createMarker(position, content) {
    var marker = new google.maps.Marker({
        map: map,
        clickable: true,
        draggable: true
    });

    mainmarker = marker;
    console.log(mainmarker);
    google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(content);
        content.style.display = "block";
        infowindow.open(map, this)
        geocodePosition(marker.getPosition());
    });
    google.maps.event.addListener(marker, 'dragstart', function () {
        updateMarkerAddress('Dragging...');
    });

    google.maps.event.addListener(marker, 'dragend', function () {
        geocodePosition(marker.getPosition());
    });
    return marker
}

//adds marker to markers list of submitted requests
function addHistoryMarker(position) {
    deleteMarkers()
    var confirmwindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        position: position,
        clickable: true,
        draggable: false,
        icon: 'https://lh3.googleusercontent.com/-H5iwqSQvpq4/U1hsUZ_yzfI/AAAAAAAAACo/ggP69uLczMc/s45-no/Untitled-1.png'
    })
    markers.push(marker)

    geocoder.geocode({
        'latLng': position
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                map.setZoom(11);
                confirmwindow.setContent('<div id="content" align="center">' + '<div id="siteNotice">' + '</div>' + '<h1 id="firstHeading" class="firstHeading">Thank you for your submission</h1>' + '<div id="bodyContent">' + '<p>You placed a request at ' + results[0].formatted_address + '.</p>' + '</div>' + '</div>');
                confirmwindow.open(map, marker);
                google.maps.event.addListener(marker, 'click', function () {
                    confirmwindow.open(map, marker);
                });
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}


function buildMap() {

    //min and max Zoom levels for map
    var minZoomLevel = 11;
    var maxZoomLevel = 17;

    var mapOptions = {
        center: new google.maps.LatLng(40.714353, -74.005973),
        zoom: 11,
        mapTypeId: "roadmap",
        streetViewControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.555026, -74.196167),
        new google.maps.LatLng(40.857448, -73.711395));
    map.fitBounds(strictBounds);

    google.maps.event.addListener(map, 'dragend', function () {
        if (strictBounds.contains(map.getCenter())) return;

        //moves map back into position if dragged out of coordinates
        var c = map.getCenter(),
            x = c.lng(),
            y = c.lat(),
            maxX = strictBounds.getNorthEast().lng(),
            maxY = strictBounds.getNorthEast().lat(),
            minX = strictBounds.getSouthWest().lng(),
            minY = strictBounds.getSouthWest().lat();

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;

        map.setCenter(new google.maps.LatLng(y, x));
    });
    placeMarker(map.getCenter());

    google.maps.event.addListener(map, 'zoom_changed', function () {
        if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
        if (map.getZoom() > maxZoomLevel) map.setZoom(maxZoomLevel);
    });

    google.maps.event.addListener(map, 'click', function (e) {
        mainmarker.setPosition(e.latLng)
    });

    // Create the search box and link it to the UI element.
    var input =
        (
            document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        (input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();

        var bounds = new google.maps.LatLngBounds();

        //places only first location in queue
        place = places[0]

        //sets mainmarkers new position to first location found
        mainmarker.setPosition(place.geometry.location)

        //adjusts window
        bounds.extend(place.geometry.location);
        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    var geoLocationDiv = document.createElement('div');
    var geoLocation = new GeoLocation(geoLocationDiv, map);


    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(geoLocationDiv);

}

//Places marker in given position (used only at init or to place new marker)
function placeMarker(position) {
    infowindow = new google.maps.InfoWindow();
    var wrapper = document.getElementById("wrapper1");
    var e = new TabCard("firstTabs", "firstCard", position);
    var f = createMarker(position, wrapper);
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Sets the position of marker 0 to null, removing it from the map.
function deleteMarkers() {
    infowindow.close()
    mainmarker.setPosition(null)
}

window.onload = buildMap;