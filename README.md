# Tacloban City Map 2018


## Project 5 in the Full Stack Web Developer Nanodegree

The Tacloban City Map 2018 is a web application which displays a map of my favorite coffee and tea venues in Tacloban City, on the island of Leyte in the Philippines. 

The map, which is loaded via an asychronous request to the [Google Maps API](https://developers.google.com/maps/), displays markers of the venue locations, and a navigation list displays the names of the corresponding venues as well. One can click on either the map markers, or the list items to pop up an information window which will display name and address information for the venue. 

The information windows contain data obtained from the [Foursquare API](https://developer.foursquare.com/) via AJAX requests. A link is also provided which when clicked will open the corresponding Foursquare venue page.

The list view and functionality is rendered using the [Knockout.js](http://knockoutjs.com/) web framework, which provides a clean MVVM solution for binding JavaScript logic to the HTML view. The view is refreshed automatically when state changes in the model.

The [Bootstrap](https://getbootstrap.com/) library is utilized to implement styles, and responsiveness for mobile devices and tablets.

The [jQuery](https://jquery.com/) library is utilized as a dependency for Bootstrap, as well as for basic AJAX functionality.

The [Popper.js](https://popper.js.org/) library is utilized as a dependency to Bootstrap.

## Files Included
1. **script.js** - The JavaScript file which contains the logic of the application. It contains the functions which initialize the map view, and the Knockout.js Model and ViewModel.

2. **index.html** - The HTML file which contains the document presentation and view logic, and the declarative bindings for Knockout.js. 

2. **styles.css** - Cascading Style Sheets file for view display rules which are not handled by the Bootstrap class assignments.

## How to Make it Work

1. Clone the repository: `git-clone https://github.com/colecode-ph/tacloban-map.git`

2. Open the index.html file in Chrome.

3. This project is also hosted on GitHub pages. Just click here: [Tacloban Map 2018](https://colecode-ph.github.io/tacloban-map/)
