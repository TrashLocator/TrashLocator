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

            // Will call place marker to place marker at geolocation
            google.maps.event.addDomListener(controlUI, 'click', function () {
                getUsersLocation();
            });

        }

        function getUsersLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
              position.coords.longitude);
            markers[0].setPosition(pos);
            console.log(pos)
          }, function() {
            markers[0].setPosition(new google.maps.LatLng(14.597466, 121.0092));
          });
        } else {
          markers[0].setPosition(new google.maps.LatLng(14.597466, 121.0092));
        }
      }


        var map, infowindow, player;
        var msie = (document.all) ? 1 : 0;

        function TabCard(a, b, c) {
            this.tabid = a;
            this.cardid = b;
            this.handleTabs = handleTabs;
            this.point = c;
            this.handleTabs(1)
        }

        function handleTabs(c) {
            var d = this;
            var e = document.getElementById(this.tabid);
            this.newcard = this.cardid + c;
            if (!this.card) this.card = this.newcard;
            document.getElementById(this.card).style.display = "none";
            document.getElementById(this.newcard).style.display = "block";
            this.card = this.newcard;
            for (var i = 0, tab; tab = e.getElementsByTagName("span")[i]; i++) {
                if (tab.getAttribute("data-name") * 1 == c) {
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
                        var a = this.getAttribute("data-name") * 1;
                        var b = this.firstChild.nodeValue;
                        d.handleTabs(a);
                        if (a == 5) viewStreet(d.card, d.point);
                        else if (b == "Mini Map") seeMiniMap(d.card, d.point);
                        return false
                    }
                }
            }
        }

        function viewStreet(a, b) {
            var g = google.maps;
            var c = new g.StreetViewPanorama(document.getElementById(a), {
                position: b
            });
            c.setVisible(true)
        }

        function seeMiniMap(a, b) {
            var g = google.maps;
            var c = new g.Map(document.getElementById(a), {
                center: b,
                zoom: 17,
                streetViewControl: false,
                mapTypeId: "hybrid",
                mapTypeControlOptions: {
                    style: g.MapTypeControlStyle.DROPDOWN_MENU
                }
            })
        }

        var markers = [];

        function createMarker(position, b) {
            var marker = new google.maps.Marker({
                //position: position,
                map: map,
                clickable: true,
                draggable: true
            });
            markers.push(marker);
            console.log(markers);
            google.maps.event.addListener(marker, "click", function () {
                infowindow.setContent(b);
                b.style.display = "block";
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
                markers[0].setPosition(e.latLng)
            });

            // Create the search box and link it to the UI element.
            var input = /** @type {HTMLInputElement} */
                (
                document.getElementById('pac-input'));
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            var searchBox = new google.maps.places.SearchBox(
                /** @type {HTMLInputElement} */
                (input));

            // [START region_getplaces]
            // Listen for the event fired when the user selects an item from the
            // pick list. Retrieve the matching places for that item.
            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();

                //for (var i = 0, marker; marker = markers[i]; i++) {
                //    marker.setMap(null);
                //}

                // For each place, get the icon, place name, and location.
                //markers = [];
                var bounds = new google.maps.LatLngBounds();
                //for (var i = 0, place; place = places[i]; i++) {
                //places only first location in queue
                place = places[0]

                //calls placeMarker to place marker
                //placeMarker(place.geometry.location)
                markers[0].setPosition(place.geometry.location)

                //adjusts window
                bounds.extend(place.geometry.location);
                map.fitBounds(bounds);
            });
            // [END region_getplaces]

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
            markers[0].setPosition(null)
        }

        window.onload = buildMap;