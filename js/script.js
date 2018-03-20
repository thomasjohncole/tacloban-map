/* Some of these code ideas were borrowed from Udacity Maps API classes
and the Udacity KnockoutJS classes */

// Model: this is the data used to create markers, list items, and dropdown menu
var locations = [
        {name: 'Serenitea', position: {lat: 11.221357, lng: 125.003836}, type: 'Real Street'},
        {name: 'Skye Lounge', position: {lat: 11.237465, lng: 125.002999}, type: 'Real Street'},
        {name: 'Jose Karlos Cafe', position: {lat: 11.241782, lng: 125.005242}, type: 'Downtown'},
        {name: 'Rovinare', position: {lat: 11.207398, lng: 125.018457}, type: 'Uptown'},
        {name: 'Cafe Lucia', position: {lat: 11.218591, lng: 125.006297}, type: 'Real Street'},
        {name: 'ABCD Cafe', position: {lat: 11.244335, lng: 125.002798}, type: 'Downtown'}
    ];

var filters = ['All', 'Downtown', 'Real Street', 'Uptown'];

// sort the locations by name
locations.sort(function(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
});

// Create global map variable
var map;

// Create a new global array which will eventually contain map markers.
var markers = [];

function initMap() {
    /* Create an object which contains the map options: center, zoom, and styles.
    Map style is 'klapsons purple' by Vanlop Ninkhuha taken from snazzymaps.com */
    var mapOptions = {
        center: {lat: 11.223399, lng: 125.001354},
        zoom: 15,
        styles: [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#6600ff"
                },
                {
                    "saturation": -11
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -78
                },
                {
                    "lightness": -47
                },
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff00ee"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ff00ee"
                },
                {
                    "saturation": -79
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": 30
                },
                {
                    "weight": 1.3
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#5e00ff"
                },
                {
                    "saturation": -16
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -72
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -65
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "lightness": 8
                }
            ]
        }
        ]
    };

    /* Constructor creates a new map and takes the div element and the
    mapOptions object as arguments */
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    /* This function populates the infowindow when the marker is clicked. We'll only
    allow one infowindow which will open at the marker that is clicked, and populate based
    on that marker's position. */
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
            });
        }
    }

    // this is the Knockout viewModel.
    var viewModel = function () {
        var self = this;

        // This function will be used to add new Location objects to the locationList
        // Do we need to pass these in?  (data, id, map)
        var Location = function (data) {
            this.name = data.name;
            this.position = data.position;
            this.type = data.type;
            //this.marker = '';
            // this.markerID = id;
        };

        this.locationList = ko.observableArray([]);

        /* Iterate through locations array values then pass value into locationList
        observable array. Each pass pushes a new Location object to locationList */
        locations.forEach(function (listItem) {
            self.locationList.push( new Location(listItem) );
        });

        // Use the locationList observableArray to create array of markers
        // you can pass an index as the second(optional) parameter of forEach
        // need to put parenthesis after locationList because ????
        // this.locationList().forEach(function (listItem) {
        //     var position = listItem.position;
        //     console.log(position);
        //     // Create a marker for each Location object
        //     var marker = new google.maps.Marker({
        //         map: map,
        //         position: position,
        //         title: name,
        //         animation: google.maps.Animation.DROP,
        //     });
        //     // Push the marker to our array of markers.
        //     // markers.push(marker);

        //     listItem.marker = marker;

        //     // add the marker object to the marker array??

        //     // Create an onclick event to open an infowindow at each marker.
        //     marker.addListener('click', function() {
        //         populateInfoWindow(this, largeInfowindow);
        //     });
        //     bounds.extend(marker.position);
        // });
        // // Extend the boundaries of the map for each marker
        // map.fitBounds(bounds);

        // Recenter map on window resize to fit markers
        // this doesn't work right now because the markers aren't being created
        window.onresize = function () {
            map.fitBounds(bounds);
        };

        // this function is called when the listItem is clicked in the view
        this.itemClicked = function (clickedListItem) {
            // stuff goes here
        }

        // Create an observable array and pass it the 'filters' global array
        this.filters = ko.observableArray(filters);
        // Set the initial filter to blank.
        this.filter = ko.observable('');

        // Create a computed observable which filters locations based on type.
        this.filteredLocations = ko.computed(function() {
            var filter = self.filter();
            /* If filter does not exist OR is set to 'All' then return all of the
            locations, otherwise return only the locations which have a 'type' value
            which matches the filter value. */
            if (!filter || filter === "All") {
                return self.locationList();
            } else {
                return ko.utils.arrayFilter( self.locationList(), function(arrayItem) {
                    return arrayItem.type == filter;
                });
            }
        });

    }

    ko.applyBindings(new viewModel());

}
