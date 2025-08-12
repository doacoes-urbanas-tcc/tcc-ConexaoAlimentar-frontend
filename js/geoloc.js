let h2 = document.querySelector('h2');
let donationTitle = document.getElementById('donationTitle');
let donationDetails = document.getElementById('donationDetails');
let calculateBtn = document.getElementById('calculateRoute');
let clearBtn = document.getElementById('clearRoute');
let routeInfo = document.getElementById('routeInfo');

var map;
var currentRoute;
var ongLocation;
var donationData = null;

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        nomeAlimento: urlParams.get('nomeAlimento'),
        doadorNome: urlParams.get('doadorNome'),
        endereco: urlParams.get('endereco'),
        lat: parseFloat(urlParams.get('lat')),
        lng: parseFloat(urlParams.get('lng')),
        quantidade: urlParams.get('quantidade'),
        unidadeMedida: urlParams.get('unidadeMedida'),
        categoria: urlParams.get('categoria'),
        dataValidade: urlParams.get('dataValidade'),
        descricao: urlParams.get('descricao'),
        contato: urlParams.get('contato'),
        urlImagem: urlParams.get('urlImagem')
    };
}

function displayDonationInfo() {
    donationData = getUrlParams();
    
    if (donationData.nomeAlimento && !isNaN(donationData.lat) && !isNaN(donationData.lng)) {
        donationTitle.textContent = donationData.nomeAlimento;
        
        let detailsHTML = `
            <strong>Doador:</strong> ${donationData.doadorNome || 'Não informado'}<br>
            <strong>Endereço:</strong> ${donationData.endereco || 'Não informado'}<br>
            <strong>Quantidade:</strong> ${donationData.quantidade || 'Não especificada'} ${donationData.unidadeMedida || ''}<br>
            <strong>Categoria:</strong> ${donationData.categoria || 'Não especificada'}<br>
        `;
        
        if (donationData.dataValidade) {
            const dataFormatada = new Date(donationData.dataValidade).toLocaleDateString('pt-BR');
            detailsHTML += `<strong>Validade:</strong> ${dataFormatada}<br>`;
        }
        
        if (donationData.contato) {
            detailsHTML += `<strong>Contato:</strong> ${donationData.contato}<br>`;
        }
        
        if (donationData.descricao) {
            detailsHTML += `<strong>Descrição:</strong> ${donationData.descricao}`;
        }
        
        donationDetails.innerHTML = detailsHTML;
        
        return true;
    } else {
        donationTitle.textContent = "Erro: Dados da doação não encontrados";
        donationDetails.innerHTML = `
            <span style="color: #dc2626;">
                Por favor, acesse esta página através da lista de doações.
            </span>
        `;
        return false;
    }
}

function addDonationMarker() {
    if (!donationData || isNaN(donationData.lat) || isNaN(donationData.lng)) return;
    
    const marker = L.marker([donationData.lat, donationData.lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);
    
    let popupContent = `<b>${donationData.nomeAlimento}</b><br>${donationData.endereco}<br><hr>`;
    
    if (donationData.quantidade && donationData.unidadeMedida) {
        popupContent += `<b>Quantidade:</b> ${donationData.quantidade} ${donationData.unidadeMedida}<br>`;
    }
    
    if (donationData.categoria) {
        popupContent += `<b>Categoria:</b> ${donationData.categoria}<br>`;
    }
    
    if (donationData.dataValidade) {
        const dataFormatada = new Date(donationData.dataValidade).toLocaleDateString('pt-BR');
        popupContent += `<b>Validade:</b> ${dataFormatada}<br>`;
    }
    
    if (donationData.contato) {
        popupContent += `<b>Contato:</b> ${donationData.contato}`;
    }
    
    marker.bindPopup(popupContent);
}

function success(pos) {
    ongLocation = [pos.coords.latitude, pos.coords.longitude];
    
    h2.textContent = `ONG localizada: Lat ${pos.coords.latitude.toFixed(6)}, Lng ${pos.coords.longitude.toFixed(6)}`;
    h2.classList.remove('loading');
    h2.classList.add('text-gray-600', 'italic');
    
    if (map !== undefined) {
        map.remove();
    }
    
    map = L.map('mapid').setView(ongLocation, 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker(ongLocation, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map)
      .bindPopup('🏢 Localização da ONG')
      .openPopup();
    
    addDonationMarker();
    
    if (donationData && !isNaN(donationData.lat) && !isNaN(donationData.lng)) {
        calculateBtn.disabled = false;
    }
}

function error(err) {
    console.error('Erro de geolocalização:', err);
    h2.textContent = 'Erro ao obter localização: ' + err.message;
    h2.classList.remove('loading');
    h2.classList.add('text-red-600', 'font-bold', 'bg-red-50');
    
    if (map === undefined) {
        ongLocation = [-23.5505, -46.6333];
        
        map = L.map('mapid').setView(ongLocation, 12);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        L.marker(ongLocation, {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map)
          .bindPopup('🏢 ONG - São Paulo (localização padrão)')
          .openPopup();
        
        addDonationMarker();
        
        if (donationData && !isNaN(donationData.lat) && !isNaN(donationData.lng)) {
            calculateBtn.disabled = false;
        }
    }
}

function calculateRoute() {
    if (!donationData || !ongLocation || isNaN(donationData.lat) || isNaN(donationData.lng)) return;
    
    if (currentRoute) {
        map.removeControl(currentRoute);
    }
    
    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(ongLocation[0], ongLocation[1]),
            L.latLng(donationData.lat, donationData.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function() { return null; },
        lineOptions: {
            styles: [{ color: '#dc2626', weight: 5, opacity: 0.8 }]
        },
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            language: 'pt'
        })
    }).addTo(map);
    
    currentRoute.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        
        const distance = (summary.totalDistance / 1000).toFixed(2);
        const time = Math.round(summary.totalTime / 60);
        
        routeInfo.innerHTML = `
            <h3>Informações do Trajeto</h3>
            <p><b>Destino:</b> ${donationData.nomeAlimento}</p>
            <p><b>Doador:</b> ${donationData.doadorNome || 'Não informado'}</p>
            <p><b>Distância:</b> ${distance} km</p>
            <p><b>Tempo estimado:</b> ${time} minutos</p>
            <p><b>Quantidade:</b> ${donationData.quantidade || 'Não especificada'} ${donationData.unidadeMedida || ''}</p>
        `;
        routeInfo.style.display = 'block';
        routeInfo.classList.remove('hidden');
    });
    
    const group = new L.featureGroup([
        L.marker(ongLocation),
        L.marker([donationData.lat, donationData.lng])
    ]);
    map.fitBounds(group.getBounds().pad(0.1));
}

function clearRoute() {
    if (currentRoute) {
        map.removeControl(currentRoute);
        currentRoute = null;
    }
    routeInfo.style.display = 'none';
    routeInfo.classList.add('hidden');
    
    if (ongLocation) {
        map.setView(ongLocation, 13);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const hasValidData = displayDonationInfo();
    
    calculateBtn.addEventListener('click', calculateRoute);
    clearBtn.addEventListener('click', clearRoute);
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        });
    } else {
        h2.textContent = 'Geolocalização não está disponível neste navegador';
        h2.classList.remove('loading');
        h2.classList.add('text-red-600', 'font-bold');
        error({ message: 'Geolocalização não suportada' });
    }
});