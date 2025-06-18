const map = L.map('map').setView([7.8731, 80.7718], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let selectedLatLng = null;
let marker = null;

map.on('click', function(e) {
  selectedLatLng = e.latlng;
  if (marker) {
    marker.setLatLng(selectedLatLng);
  } else {
    marker = L.marker(selectedLatLng).addTo(map);
  }
});

document.getElementById('stationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!selectedLatLng) {
    alert('Please select a location on the map');
    return;
  }

  const formData = new FormData(this);
  formData.append('lat', selectedLatLng.lat);
  formData.append('lng', selectedLatLng.lng);

  try {
    const res = await fetch('http://localhost:5000/api/stations/add', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      alert('Station added successfully!');
      window.location.href = 'index.html';
    } else {
      alert('Failed to add station');
    }
  } catch (error) {
    alert('Error adding station');
    console.error(error);
  }
});
