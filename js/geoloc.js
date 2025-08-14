const API_BASE = "https://conexao-alimentar.onrender.com";

function validarCoords(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
    throw new Error("Parâmetros inválidos para geolocalização");
  }
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

async function safeFetch(url, options = {}) {
  const resp = await fetch(url, options);
  if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`);
  return await resp.json();
}

async function getDoacaoById(idDoacao) {
  return await safeFetch(`${API_BASE}/doacoes/${idDoacao}`);
}

async function getOngLocation() {
  const data = await safeFetch(`${API_BASE}/admin/usuarios/usuario/localizacao`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return validarCoords(data.latitude, data.longitude);
}


async function initMap(doadorCoords, ongCoords) {
  const map = L.map("map").setView([doadorCoords.lat, doadorCoords.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([doadorCoords.lat, doadorCoords.lng])
    .addTo(map)
    .bindPopup("Local do Doador");

  if (ongCoords) {
    L.marker([ongCoords.lat, ongCoords.lng])
      .addTo(map)
      .bindPopup("Local da ONG");

    const bounds = L.latLngBounds(
      [doadorCoords.lat, doadorCoords.lng],
      [ongCoords.lat, ongCoords.lng]
    );
    map.fitBounds(bounds);

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(doadorCoords.lat, doadorCoords.lng),
        L.latLng(ongCoords.lat, ongCoords.lng)
      ],
      routeWhileDragging: false,
      createMarker: () => null
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const route = e.routes[0];
      const distanciaKm = (route.summary.totalDistance / 1000).toFixed(2);
      const tempoMin = Math.round(route.summary.totalTime / 60);

      const infoBox = document.getElementById("routeInfo");
      infoBox.textContent = `Distância: ${distanciaKm} km | Tempo estimado: ${tempoMin} min`;
      infoBox.classList.remove("hidden");
    });
  }
}


(async function () {
  const params = new URLSearchParams(window.location.search);
  const idDoacao = params.get("idDoacao");
  if (!idDoacao) {
    alert("ID da doação não informado.");
    return;
  }

  try {
    const doacao = await getDoacaoById(idDoacao);
    const doadorCoords = validarCoords(doacao.doadorLatitude, doacao.doadorLongitude);

    let ongCoords = null;
    try {
      ongCoords = await getOngLocation();
    } catch (e) {
      console.warn("Localização da ONG indisponível:", e.message);
    }

    document.getElementById("nome-alimento").textContent = doacao.nomeAlimento;
    document.getElementById("descricao").textContent = doacao.descricao || "";
    document.getElementById("quantidade").textContent = `${doacao.quantidade} ${doacao.unidadeMedida}`;
    document.getElementById("categoria").textContent = `Categoria: ${doacao.categoria}`;
    document.getElementById("voltar").onclick = () => window.history.back();

    await initMap(doadorCoords, ongCoords);

  } catch (err) {
    console.error("Erro ao carregar mapa:", err);
    alert("Não foi possível carregar a geolocalização.");
  }
})();
