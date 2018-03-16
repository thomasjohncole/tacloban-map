// Some of these code ideas were borrowed from Udacity Maps API classes
// Create global map variable
var map;

// Model: this is the data used to create the array of markers and list items
var locations = [
    {name: 'The Apartment', location: {lat: 11.223399, lng: 125.001354}},
    {name: 'Skye Lounge', location: {lat: 11.237465, lng: 125.002999}},
    {name: 'Jose Karlos Cafe', location: {lat: 11.241782, lng: 125.005242}},
    {name: 'Rovinare', location: {lat: 11.207398, lng: 125.018457}}
];

// create a location object with knockout observables
var Location = function (data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
};

var ViewModel = function () {
    var self = this;
    // 'this refers to the ViewModel binding context'

    this.locationList = ko.observableArray([]);

    // push locations array values into locationList array
    locations.forEach(function (listItem) {
        self.locationList.push( new Location(listItem) );
    });

    this.itemClicked = function (clickedListItem) {
        alert("item clicked!");
    }

}

ko.applyBindings(new ViewModel());


// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // create an object which contains the map options center, zoom, and styles
    // Map style is 'klapsons purple' by Vanlop Ninkhuha from snazzymaps.com
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

    // Constructor creates a new map and takes mapOptions as an argument
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Recenter map on window resize to fit markers
    window.onresize = function () {
        map.fitBounds(bounds);
    };

    //  use the locations array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var name = locations[i].name;
        // Create a marker for each location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
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
}
