/* Some of these code ideas were borrowed from Udacity Maps API classes
and the Udacity KnockoutJS classes */

// Model: this is the data used to create the markers and list items
// TODO: put this in a separate file and use export/import syntax
const locations = [
        {
            name: "Serenitea",
            position: {lat: 11.221357, lng: 125.003836},
            type: "Real Street",
            venueID: "57ac5646498ea62681e9636d"
        },
        {
            name: "Skye coffee+wine",
            position: {lat: 11.237465, lng: 125.002999},
            type: "Real Street",
            venueID: "5777e920498ecedd942ed04d"
        },
        {
            name: "Jose Karlos Coffee Shop",
            position: {lat: 11.241782, lng: 125.005242},
            type: "Downtown",
            venueID: "5823d7c4d1efa6541ad2ae30"
        },
        {
            name: "Rovinare",
            position: {lat: 11.207398, lng: 125.018457},
            type: "Uptown",
            venueID: "58241574b04e981d14efa4cc"
        },
        {
            name: "Cafe Lucia",
            position: {lat: 11.218591, lng: 125.006297},
            type: "Real Street",
            venueID: "546c72b4498ebfe8af97db76"
        },
        {
            name: "ABCD Cafe",
            position: {lat: 11.244335, lng: 125.002798},
            type: "Downtown",
            venueID: "51c2ebe4498ea4fe1cf353f8"
        }
    ];

// Define variables to construct the URL for the Foursquare API request
const fsInitialURL = "https://api.foursquare.com/v2/venues/";
const fsVersion = "?v=20180323";
const fsClientID = "&client_id=OH0WUYIEE0T2YES1ZRS3TPTZOCFEEIKSUHZR3HH2HMSKLRQQ";
const fsClientSecret = "&client_secret=PIGR2CGDNIJZXV4MXGUHLJ1TMZCJ3NBYFXKLZBFCGPGUH1YT";


// Filters to use for dropdown menu
const filters = ["All", "Downtown", "Real Street", "Uptown"];

// Sort the locations alpha by name
locations.sort(function(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
});

let map;

function initMap() {
    /* Create an object which contains the map options: center, zoom, and styles.
    Map styles are "klapsons purple" by Vanlop Ninkhuha taken from snazzymaps.com */
    const mapOptions = {
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
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    let largeInfowindow = new google.maps.InfoWindow();
    let bounds = new google.maps.LatLngBounds();

    // This function populates the infowindow when the marker is clicked
    function populateInfoWindow(marker, infowindow) {
        if (marker.fsAddress) {
            let address = "";
            /* The formattedAddress returned from the API request is an array,
            so we can loop through it and add line breaks for display */
            marker.fsAddress.forEach(function (line){
                address += line + "</br>";
            });

            infowindow.setContent("<div>" +
                                  "<strong>" + marker.fsName + "</strong>" +
                                  "</br>" + address +
                                  "</br>(Address provided by Foursquare)" +
                                  "</br><a href='http://foursquare.com/v/" +
                                  marker.fsVenueID +
                                  "'target='_blank'>" +
                                  "<img src='img/foursquare150.png'></a>" +
                                  "</div>");
        } else {
            // Error fallback in case $.getJSON function response is empty
            infowindow.setContent("<div>" +
                                  "<strong>" + marker.name + "</strong>" +
                                  "</br>" +
                                  "Foursquare data currently unavailable." +
                                  "</div>");
        }

        infowindow.open(map, marker);
    }

    // This is the Knockout viewModel.
    let viewModel = function () {
        let self = this;

        /* Constructor function creates an object of type Location when called
        with the "new" keyword - this will be used to populate the locationList */
        // TODO - convert this to 'class = Location' syntax
        let Location = function (data) {
            this.name = data.name;
            this.position = data.position;
            this.type = data.type;
            this.venueID = data.venueID; // Foursquare venue ID
            this.marker = ""; // Gets assigned later when markers are created
        };

        this.locationList = ko.observableArray([]);

        /* Iterate through locations array. For each item/object in the array,
        create a new instance of the Location object and push it to the
        locationList observable array */
        locations.forEach(function (listItem) {
            self.locationList.push( new Location(listItem) );
        });

        /* Build a Foursquare API URL using the venue ID for each Location object
        Note: Code in this function will run AFTER everything else executes because
        $.getJSON is asynchronous */
        this.locationList().forEach(function (listItem) {
            let fsFullURL = fsInitialURL +
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

        /* Use the locationList observableArray to create map markers;
        Create a marker for each Location object in the array */
        this.locationList().forEach(function (listItem) {
            let marker = new google.maps.Marker({
                map: map, // specifies the map on which to place the marker
                position: listItem.position, // the only required value
                name: listItem.name,
                fsName: listItem.fsName, // the name from Foursquare
                fsAddress: listItem.fsAddress, // the address from Foursquare
                fsVenueID: listItem.venueID, // Foursquare venue ID
                animation: google.maps.Animation.DROP,
            });

            /* Assign the newly created marker object to the marker property of
            the corresponding "Location" object - This is what allows the filter
            function work on BOTH the list and the markers simultaneously */
            listItem.marker = marker;
            // Extends the map bounds as per marker positions
            bounds.extend(marker.position);

            // Create an onclick event to open an infowindow per marker
            marker.addListener("click", function() {
                populateInfoWindow(this, largeInfowindow); // "this" is the marker object
                this.setIcon("https://maps.google.com/mapfiles/ms/micons/purple-dot.png");
            });
        });
        // Make sure markers are visible in window, lower zoom value if needed
        map.fitBounds(bounds);

        // Recenter map on window resize to accomodate markers
        window.onresize = function () {
            map.fitBounds(bounds);
        };

        /* This function is called when the listItem is clicked in the view,
        // this works via knockout binding on the list item HTML element and
        // passes the corresponging marker as argument to populateInfoWindow */
        this.itemClicked = function (clickedListItem) {
            populateInfoWindow(clickedListItem.marker, largeInfowindow);
            // turns the marker purple when it"s clicked
            clickedListItem.marker.setIcon("https://maps.google.com/mapfiles/ms/micons/purple-dot.png");
        };

        // Create an observable array and pass it the "filters" global array
        this.filters = ko.observableArray(filters);
        // Set the initial filter to blank
        this.filter = ko.observable("");
        // Create a computed observable which filters locations based on type.
        this.filteredLocations = ko.computed(function() {
            let filter = self.filter();
            /* If filter is false OR is set to "All" then return all of the
            locations, otherwise return only the locations which have a "type" value
            which matches the filter value. */
            if (!filter || filter === "All") {

                return ko.utils.arrayFilter( self.locationList(), function(arrayItem) {
                    arrayItem.marker.setVisible(true);
                    return self.locationList();
                });
            } else {
                return ko.utils.arrayFilter( self.locationList(), function(arrayItem) {
                    /* Set visibility to true first, since the marker may be
                    invisible from a previous "else" loop execution */
                    arrayItem.marker.setVisible(true);
                    if (arrayItem.type != filter) {
                        arrayItem.marker.setVisible(false);
                        // Close any open infowindows when filter is applied
                        largeInfowindow.close(largeInfowindow);
                    }
                    return arrayItem.type == filter;
                });
            }
        });

    };

    ko.applyBindings(new viewModel());

}
// This function will execute if the google maps API won't load
function googleMapsAPIError() {
    alert("Google Maps API did not load!\nTry a refresh?\n" +
          "Turn it off and on again?\nAre you behind a firewall?\n" +
          "Are you online?\nMaybe just try again later.");
}
