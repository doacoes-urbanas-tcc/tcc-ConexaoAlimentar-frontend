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

function calculateRoute() {
    if (!donationData || !ongLocation || isNaN(donationData.lat) || isNaN(donationData.lng)) return;
    if (currentRoute) map.removeControl(currentRoute);

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(ongLocation.lat, ongLocation.lng),
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

async function getOngLocation(ongId) {
    try {
        const res = await fetch(`https://conexao-alimentar.onrender.com/ong/${ongId}/localizacao`);
        if (!res.ok) throw new Error('Erro ao buscar localização da ONG');
        return await res.json(); 
    } catch (err) {
        console.error(err);
        h2.textContent = "Erro ao carregar localização da ONG";
        h2.classList.remove('loading');
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!displayDonationInfo()) return;

    if (!donationData.ongId) {
        h2.textContent = "Erro: ID da ONG não encontrado";
        h2.classList.remove('loading');
        return;
    }

    ongLocation = await getOngLocation(donationData.ongId);
    if (!ongLocation) return;

    h2.textContent = `ONG localizada: Lat ${ongLocation.lat}, Lng ${ongLocation.lng}`;
    h2.classList.remove('loading');

    map = L.map('mapid').setView([ongLocation.lat, ongLocation.lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker([ongLocation.lat, ongLocation.lng], {
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

    calculateBtn.addEventListener('click', calculateRoute);
    clearBtn.addEventListener('click', clearRoute);
});
