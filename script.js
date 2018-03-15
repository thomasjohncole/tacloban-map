var map;

function initMap() {
// Constructor creates a new map - only center and zoom are required.
// styles are taken from the page www. something - fix this attribution!
map = new google.maps.Map(document.getElementById('map'), {
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
});
// this is the lat and lng of the apartment
var apartment = {lat: 11.223399, lng: 125.001354};
// creates a marker where the apartment is in the map
var marker = new google.maps.Marker({
    position: apartment,
    map: map,
    title: 'The Apartment'
})
var infowindow = new google.maps.InfoWindow({
    content: 'this is the apartment where I have been living for over a year'
});
marker.addListener('click', function() {
    infowindow.open(map, marker);
})
}