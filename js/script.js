/* Some of these code ideas were borrowed from Udacity Maps API classes
and the Udacity KnockoutJS classes */

// Model: this is the data used to create markers, list items, and dropdown menu
var locations = [
        {
            name: 'Serenitea',
            position: {lat: 11.221357, lng: 125.003836},
            type: 'Real Street',
            venueID: '57ac5646498ea62681e9636d'
        },
        {
            name: 'Skye Lounge',
            position: {lat: 11.237465, lng: 125.002999},
            type: 'Real Street',
            venueID: '5777e920498ecedd942ed04d'
        },
        {
            name: 'Jose Karlos Cafe',
            position: {lat: 11.241782, lng: 125.005242},
            type: 'Downtown',
            venueID: '5823d7c4d1efa6541ad2ae30'
        },
        {
            name: 'Rovinare',
            position: {lat: 11.207398, lng: 125.018457},
            type: 'Uptown',
            venueID: '58241574b04e981d14efa4cc'
        },
        {
            name: 'Cafe Lucia',
            position: {lat: 11.218591, lng: 125.006297},
            type: 'Real Street',
            venueID: '546c72b4498ebfe8af97db76'
        },
        {
            name: 'ABCD Cafe',
            position: {lat: 11.244335, lng: 125.002798},
            type: 'Downtown',
            venueID: '51c2ebe4498ea4fe1cf353f8'
        }
    ];

// Define variables to construct the URL for the Foursquare API request
var fsInitialURL = "https://api.foursquare.com/v2/venues/";
var fsVersion = "?v=20180323";
var fsClientID = "&client_id=OH0WUYIEE0T2YES1ZRS3TPTZOCFEEIKSUHZR3HH2HMSKLRQQ";
var fsClientSecret = "&client_secret=PIGR2CGDNIJZXV4MXGUHLJ1TMZCJ3NBYFXKLZBFCGPGUH1YT";


// filters to use for dropdown menu
var filters = ['All', 'Downtown', 'Real Street', 'Uptown'];

// sort the locations alpha by name
locations.sort(function(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
});

// Create global map variable - Why do I need this?????
// Commenting it out until something goes wrong, as I see nothing
// In the global execution context that requires this to be defined
// Outside of initMap - Maybe I need this if the map doesn't load?
// var map;
// var marker;

function initMap() {
    /* Create an object which contains the map options: center, zoom, and styles.
    Map styles are 'klapsons purple' by Vanlop Ninkhuha taken from snazzymaps.com */
    var mapOptions = {
        center: {lat: 11.223399, lng: 125.001354},
        zoom: 14,
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
            if (marker.fsAddress) {
                address = '';
                marker.fsAddress.forEach(function (line){
                    address += line + '</br>';
                });

                    infowindow.setContent('<div>' +
                                          '<strong>' + marker.fsName + '</strong>' +
                                          '</br>' + address +
                                          '</br><a href="http://foursquare.com/v/' +
                                          marker.fsVenueID +
                                          '"><img src="img/foursquare150.png"></a>' +
                                          '</div>');
                    infowindow.open(map, marker);
                    // Make sure the marker property is cleared if the infowindow is closed.
                    infowindow.addListener('closeclick',function(){
                        infowindow.setMarker = null;
                    });

            } else {
                infowindow.setContent('<div>' +
                                      '<strong>' + marker.name + '</strong>' +
                                      '</br>' +
                                      "Foursquare data currently unavailable." +
                                      '</div>');
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;

                });
            }
        }
    }

    // this is the Knockout viewModel.
    var viewModel = function () {
        var self = this;

        // Constructor function creates an object of type Location when called
        // with the 'new' keyword - this will be used to populate the locationList
        // Do we need to pass the map argument?
        var Location = function (data, map) {
            this.name = data.name;
            this.position = data.position;
            this.type = data.type;
            this.venueID = data.venueID; // Foursquare venue ID
            this.marker = ''; // gets assigned later when markers are created
        };

        this.locationList = ko.observableArray([]);

        /* Iterate through locations array. For each item/object in the array,
        create a new instance of the Location object and push it to the
        locationList observable array. */
        locations.forEach(function (listItem) {
            self.locationList.push( new Location(listItem) );
        });

        // Build a Foursquare API URL using the venue ID for each Location object
        // Note: Code in this function will run AFTER everything else
        // executes because $.getJSON is asynchronous

        this.locationList().forEach(function (listItem) {
            var fsFullURL = fsInitialURL +
                        listItem.venueID +
                        fsVersion +
                        fsClientID +
                        fsClientSecret;
            // Get data from Foursquare and assign values to Location.marker properties
            $.getJSON(fsFullURL, function (data) {
                listItem.marker.fsName = data.response.venue.name;
                listItem.marker.fsAddress = data.response.venue.location.formattedAddress;
            });
        });

        // Use the locationList observableArray to create map markers
        // Create a marker for each Location object in the array
        this.locationList().forEach(function (listItem) {
            var marker = new google.maps.Marker({
                map: map, // specifies the map on which to place the marker
                position: listItem.position, // the only required value
                name: listItem.name,
                fsName: listItem.fsName, // the name from Foursquare
                fsAddress: listItem.fsAddress, // the address from Foursquare
                fsVenueID: listItem.venueID, // Foursquare venue ID
                animation: google.maps.Animation.DROP,
            });

            // Assign the newly created marker object to the marker property of
            // the corresponding 'Location' object - This is what allows the filter
            // function work on BOTH the list and the markers simultaneously
            listItem.marker = marker;
            // extends the map bounds as per marker positions
            bounds.extend(marker.position);

            // Create an onclick event to open an infowindow per marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow); // 'this' is the marker object
            });
        });
        // make sure markers are visible in window, lower zoom value if needed
        map.fitBounds(bounds);

        // Recenter map on window resize to accomodate markers
        window.onresize = function () {
            map.fitBounds(bounds);
        };

        // this function is called when the listItem is clicked in the view
        // passes the appropriate marker as argument
        this.itemClicked = function (clickedListItem) {
            populateInfoWindow(clickedListItem.marker, largeInfowindow);
        }

        // Create an observable array and pass it the 'filters' global array
        this.filters = ko.observableArray(filters);
        // Set the initial filter to blank.
        this.filter = ko.observable('');

        // Create a computed observable which filters locations based on type.
        this.filteredLocations = ko.computed(function() {
            var filter = self.filter();
            /* If filter is false OR is set to 'All' then return all of the
            locations, otherwise return only the locations which have a 'type' value
            which matches the filter value. */
            if (!filter || filter === "All") {

                return ko.utils.arrayFilter( self.locationList(), function(arrayItem) {
                    arrayItem.marker.setVisible(true);
                    return self.locationList();
                });
            } else {
                return ko.utils.arrayFilter( self.locationList(), function(arrayItem) {
                    // set visibility to true first, since the marker may be
                    // invisible from a previous else loop execution
                    arrayItem.marker.setVisible(true);
                    if (arrayItem.type != filter) {
                        arrayItem.marker.setVisible(false);
                    }
                    return arrayItem.type == filter;
                });
            }
        });

    }

    ko.applyBindings(new viewModel());

}
