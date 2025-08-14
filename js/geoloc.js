let h2 = document.querySelector('h2');
let donationTitle = document.getElementById('donationTitle');
let donationDetails = document.getElementById('donationDetails');
let calculateBtn = document.getElementById('calculateRoute');
let clearBtn = document.getElementById('clearRoute');
let routeInfo = document.getElementById('routeInfo');

let map, currentRoute, ongLocation, donationData = null;

const toNum = v => v === null || v === undefined || v === '' ? NaN : Number(v);

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
    const dLat = toNum(donationData?.lat);
    const dLng = toNum(donationData?.lng);
    if (Number.isNaN(dLat) || Number.isNaN(dLng)) return;

    L.marker([dLat, dLng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map).bindPopup(`<b>${donationData.nomeAlimento || 'Doação'}</b>`);
}

function calculateRoute() {
    const dLat = toNum(donationData?.lat);
    const dLng = toNum(donationData?.lng);
    const oLat = toNum(ongLocation?.lat);
    const oLng = toNum(ongLocation?.lng);

    if (Number.isNaN(dLat) || Number.isNaN(dLng) || Number.isNaN(oLat) || Number.isNaN(oLng)) return;
    if (currentRoute) map.removeControl(currentRoute);

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(oLat, oLng),        
            L.latLng(dLat, dLng)         
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: { styles: [{ color: '#dc2626', weight: 5, opacity: 0.8 }] },
        language: 'pt-BR'
    }).on('routesfound', function (e) {
        const route = e.routes[0];
        const distanciaKm = (route.summary.totalDistance / 1000).toFixed(2);
        const tempoMin = Math.round(route.summary.totalTime / 60);

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
        const res = await fetch(`/api/ong/${ongId}/localizacao`);
        if (!res.ok) throw new Error('Erro ao buscar localização da ONG');
        return await res.json();
    } catch (err) {
        console.error(err);
        h2.textContent = "Erro ao carregar localização da ONG";
        h2.classList.remove('loading');
        return null;
    }
}

function resolveOngId() {
    if (donationData?.ongId && !Number.isNaN(Number(donationData.ongId))) {
        return Number(donationData.ongId);
    }
    const stored = localStorage.getItem('usuarioId');
    if (stored && !Number.isNaN(Number(stored))) {
        return Number(stored);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!displayDonationInfo()) return;

    if (calculateBtn) calculateBtn.disabled = true;

    const ongId = resolveOngId();
    if (!ongId) {
        h2.textContent = "Erro: ID da ONG não encontrado";
        h2.classList.remove('loading');
        return;
    }

    ongLocation = await getOngLocation(ongId);
    if (!ongLocation) return;

    const oLat = toNum(ongLocation.lat);
    const oLng = toNum(ongLocation.lng);
    if (Number.isNaN(oLat) || Number.isNaN(oLng)) {
        h2.textContent = "Erro: Localização da ONG inválida";
        h2.classList.remove('loading');
        return;
    }

    h2.textContent = `ONG localizada: Lat ${oLat.toFixed(6)}, Lng ${oLng.toFixed(6)}`;
    h2.classList.remove('loading');

    map = L.map('mapid').setView([oLat, oLng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker([oLat, oLng], {
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

    const dLat = toNum(donationData?.lat);
    const dLng = toNum(donationData?.lng);
    if (!Number.isNaN(dLat) && !Number.isNaN(dLng)) {
        const bounds = L.latLngBounds([oLat, oLng], [dLat, dLng]);
        map.fitBounds(bounds, { padding: [50, 50] });
        if (calculateBtn) calculateBtn.disabled = false;
    }

    calculateBtn?.addEventListener('click', calculateRoute);
    clearBtn?.addEventListener('click', clearRoute);
});
