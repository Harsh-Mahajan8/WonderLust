
var map = L.map('map').setView(coordinates, 15); // Default view (India)


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// console.log(coordinates);

var layer = L.marker(coordinates,{color:"red"}).addTo(map);
layer.addTo(map);


