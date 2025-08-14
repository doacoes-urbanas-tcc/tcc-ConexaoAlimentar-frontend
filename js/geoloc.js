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

async function initMap(doadorCoords, ongCoords) {
  const map = L.map("mapid").setView([doadorCoords.lat, doadorCoords.lng], 13);

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

    L.Routing.control({
      waypoints: [
        L.latLng(doadorCoords.lat, doadorCoords.lng),
        L.latLng(ongCoords.lat, ongCoords.lng)
      ],
      createMarker: () => null
    }).addTo(map);
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
    const ongCoords = validarCoords(doacao.ongLatitude, doacao.ongLongitude);

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
