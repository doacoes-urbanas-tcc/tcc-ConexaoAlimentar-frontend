let h2 = document.querySelector('h2');
let donationTitle = document.getElementById('donationTitle');
let donationDetails = document.getElementById('donationDetails');
let calculateBtn = document.getElementById('calculateRoute');
let clearBtn = document.getElementById('clearRoute');
let routeInfo = document.getElementById('routeInfo');

let map, currentRoute, ongLocation, donationData = null;

function displayDonationInfo() {
    const dadosString = localStorage.getItem("dadosDoacao");
    if (!dadosString) {
        donationTitle.textContent = "Erro: Dados da doação não encontrados";
        donationDetails.innerHTML = `<span style="color: #dc2626;">Acesse esta página pela lista de doações.</span>`;
        return false;
    }

    donationData = JSON.parse(dadosString);
    donationTitle.textContent = donationData.nomeAlimento || "Doação";

    let detailsHTML = `
        <strong>Doador:</strong> ${donationData.doadorNome || 'Não informado'}<br>
        <strong>Quantidade:</strong> ${donationData.quantidade || ''} ${donationData.unidadeMedida || ''}<br>
        <strong>Categoria:</strong> ${donationData.categoria || ''}<br>
    `;

    if (donationData.dataValidade) {
        detailsHTML += `<strong>Validade:</strong> ${new Date(donationData.dataValidade).toLocaleDateString('pt-BR')}<br>`;
    }
    if (donationData.descricao) {
        detailsHTML += `<strong>Descrição:</strong> ${donationData.descricao}`;
    }
    if (donationData.urlImagem) {
        detailsHTML += `<br><img src="${donationData.urlImagem}" alt="Imagem da doação" style="max-width:200px;margin-top:10px;">`;
    }

    donationDetails.innerHTML = detailsHTML;
    return true;
}

function addDonationMarker() {
    if (!donationData || isNaN(donationData.lat) || isNaN(donationData.lng)) return;
    L.marker([donationData.lat, donationData.lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map).bindPopup(`<b>${donationData.nomeAlimento}</b>`);
}

function success(pos) {
    ongLocation = [pos.coords.latitude, pos.coords.longitude];
    h2.textContent = `ONG localizada: Lat ${pos.coords.latitude.toFixed(6)}, Lng ${pos.coords.longitude.toFixed(6)}`;
    h2.classList.remove('loading');

    if (map) map.remove();

    map = L.map('mapid').setView(ongLocation, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker(ongLocation, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map).bindPopup('🏢 Localização da ONG').openPopup();

    addDonationMarker();

    if (donationData && !isNaN(donationData.lat) && !isNaN(donationData.lng)) {
        calculateBtn.disabled = false;
    }
}

function error(err) {
    h2.textContent = 'Erro ao obter localização: ' + err.message;
}

function calculateRoute() {
    if (!donationData || !ongLocation || isNaN(donationData.lat) || isNaN(donationData.lng)) return;
    if (currentRoute) map.removeControl(currentRoute);

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(ongLocation[0], ongLocation[1]),
            L.latLng(donationData.lat, donationData.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: { styles: [{ color: '#dc2626', weight: 5, opacity: 0.8 }] },
        language: 'pt-BR'
    }).on('routesfound', function (e) {
        let route = e.routes[0];
        let distanciaKm = (route.summary.totalDistance / 1000).toFixed(2);
        let tempoMin = Math.round(route.summary.totalTime / 60);

        routeInfo.innerHTML = `
            <strong>Distância:</strong> ${distanciaKm} km<br>
            <strong>Tempo estimado:</strong> ${tempoMin} minutos
        `;
        routeInfo.classList.remove('hidden');
    }).addTo(map);
}

function clearRoute() {
    if (currentRoute) {
        map.removeControl(currentRoute);
        currentRoute = null;
    }
    routeInfo.innerHTML = "";
    routeInfo.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!displayDonationInfo()) return;

    calculateBtn.addEventListener('click', calculateRoute);
    clearBtn.addEventListener('click', clearRoute);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    } else {
        h2.textContent = 'Geolocalização não disponível neste navegador';
    }
});
