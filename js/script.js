/* Some of these code ideas were borrowed from Udacity Maps API classes
and the Udacity KnockoutJS classes */

// Create global map variable
var map;

// Model: this is the data used to create markers, list items, and dropdown menu
var initialData = {
    locations: [
        {name: 'Serenitea', location: {lat: 11.221357, lng: 125.003836}, type: 'Real Street'},
        {name: 'Skye Lounge', location: {lat: 11.237465, lng: 125.002999}, type: 'Real Street'},
        {name: 'Jose Karlos Cafe', location: {lat: 11.241782, lng: 125.005242}, type: 'Downtown'},
        {name: 'Rovinare', location: {lat: 11.207398, lng: 125.018457}, type: 'Uptown'},
        {name: 'Cafe Lucia', location: {lat: 11.218591, lng: 125.006297}, type: 'Real Street'},
        {name: 'ABCD Cafe', location: {lat: 11.244335, lng: 125.002798}, type: 'Downtown'}
    ],
    filters: ['All', 'Downtown', 'Real Street', 'Uptown']
};
// sort the locations by name
initialData.locations.sort(function(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
});

// Create a Location object with knockout observables.
var Location = function (data) {
    this.name = ko.observable(initialData.locations.name);
    this.location = ko.observable(initialData.locations.location);
};

// Create a new blank array for all the listing markers.
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

    // Recenter map on window resize to fit markers
    window.onresize = function () {
        map.fitBounds(bounds);
    };

    //  use the locations array to create an array of markers
    initialData.locations.forEach(function (location, index) {
        var position = location.location;
        var name = location.name;
        var id = index;
        // Create a marker for each item in the locations array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name,
            animation: google.maps.Animation.DROP,
            id: id
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(marker.position);
    });
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);


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

    /* this is the Knockout viewModel. We're placing it inside the initMap function
    so it can access the populateInfoWindow function when the listItem is clicked */
    var viewModel = function (data) {
        var self = this;
        // 'this' refers to the ViewModel binding context

        this.locationList = ko.observableArray([]);

        /* push locations array values into locationList observable array
        this observable array is made up of Location objects */
        initialData.locations.forEach(function (listItem) {
            self.locationList.push( new Location(listItem) );
        });


        // this function is called when the listItem is clicked in the view
        this.itemClicked = function (clickedListItem) {
            /* we're going to iterate through the markers to get the one which has a
            matching index to the clickedistItem, then we can call the populateInfoWindow
            function passing the marker as an argument */
            markers.forEach( function (marker) {
                if (self.locationList.indexOf(clickedListItem) === marker.id){
                    populateInfoWindow(marker, largeInfowindow);
                }
            });
        }

        // Filter the locations based on the dropdown value.
        // Create an observable array for the filters.
        this.filters = ko.observableArray(initialData.filters);
        // Set the initial filter to blank.
        this.filter = ko.observable('');
        // Create an obervable array of the locations.
        this.locations = ko.observableArray(initialData.locations);
        // Create a computed observable.
        this.filteredLocations = ko.computed(function() {
            var filter = self.filter();
            /* If filter does not exist or is set to 'All' then return all of the
            locations, otherwise return only the locations which have a 'type' value
            which matches the filter value. */
            if (!filter || filter === "All") {
                return self.locations();
            } else {
                return ko.utils.arrayFilter(self.locations(), function(i) {
                    return i.type === filter;
                });
            }
        });


    }

    ko.applyBindings(new viewModel(initialData));

}
