const map = L.map('map').setView([7.8731, 80.7718], 7); // Center on Sri Lanka by default

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let markers = [];

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

async function loadStations(plugType = 'all', minPower = 0) {
  clearMarkers();

  const query = new URLSearchParams();
  if (plugType !== 'all') query.append('plugType', plugType);
  if (minPower > 0) query.append('minPower', minPower);

  try {
    const res = await fetch(`http://localhost:5000/api/stations/all?${query.toString()}`);
    const stations = await res.json();

    stations.forEach(station => {
      const marker = L.marker([station.lat, station.lng]).addTo(map);

      let popupHtml = `<b>${station.name}</b><br>`;
      popupHtml += `Plug: ${station.plugType}<br>`;
      popupHtml += `Power: ${station.powerKW} kW<br>`;
      if (station.photoUrl) {
        popupHtml += `<img src="http://localhost:5000${station.photoUrl}" alt="Station photo" style="width:100px; margin-top:5px;"/>`;
      }

      marker.bindPopup(popupHtml);
      markers.push(marker);
    });
  } catch (error) {
    alert('Failed to load stations');
    console.error(error);
  }
}

// On page load, load all stations
loadStations();

document.getElementById('applyFilters').addEventListener('click', () => {
  const plugType = document.getElementById('filterPlugType').value;
  const minPower = Number(document.getElementById('filterMinPower').value) || 0;
  loadStations(plugType, minPower);
});

let popupHtml = `
  <div class="text-sm">
    <div class="font-bold text-green-700 text-base">${station.name}</div>
    <div>🔌 <b>Plug:</b> ${station.plugType}</div>
    <div>⚡ <b>Power:</b> ${station.powerKW} kW</div>
    ${station.photoUrl ? `<img src="http://localhost:5000${station.photoUrl}" class="mt-2 rounded shadow" width="120" />` : ''}
  </div>
`;
