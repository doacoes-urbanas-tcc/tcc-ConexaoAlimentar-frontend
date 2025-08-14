const API_BASE = "https://conexao-alimentar.onrender.com";

function validarCoords(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

async function safeFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(url, { ...options, headers, credentials: "include" });
  if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`);
  return await resp.json();
}

async function getDoacaoById(idDoacao) {
  return await safeFetch(`${API_BASE}/doacoes/${idDoacao}`);
}

async function initMap(doadorCoords, ongCoords) {
  const centerCoords = doadorCoords || ongCoords;
  if (!centerCoords) throw new Error("Nenhuma coordenada disponível para exibir no mapa.");
  const map = L.map("map").setView([centerCoords.lat, centerCoords.lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
  if (doadorCoords) L.marker([doadorCoords.lat, doadorCoords.lng]).addTo(map).bindPopup("Local do Doador");
  if (ongCoords) L.marker([ongCoords.lat, ongCoords.lng]).addTo(map).bindPopup("Local da ONG");
  if (doadorCoords && ongCoords) {
    const bounds = L.latLngBounds([doadorCoords.lat, doadorCoords.lng], [ongCoords.lat, ongCoords.lng]);
    map.fitBounds(bounds);
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(doadorCoords.lat, doadorCoords.lng), L.latLng(ongCoords.lat, ongCoords.lng)],
      createMarker: () => null
    }).addTo(map);
    routingControl.on("routesfound", function (e) {
      const route = e.routes[0];
      const distanciaKm = (route.summary.totalDistance / 1000).toFixed(2);
      const tempoMin = Math.round(route.summary.totalTime / 60);
      const info = document.getElementById("routeInfo");
      info.classList.remove("hidden");
      info.innerHTML = `<strong>Distância:</strong> ${distanciaKm} km<br><strong>Tempo estimado:</strong> ${tempoMin} min`;
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
    const ongCoords = validarCoords(doacao.receptorLatitude, doacao.receptorLongitude);
    document.getElementById("doador").textContent = `Doador: ${doacao.doadorNome || "Não informado"}`;
    document.getElementById("endereco-doador").textContent = doacao.enderecoDoador || "";
    document.getElementById("nome-alimento").textContent = doacao.nomeAlimento;
    document.getElementById("descricao").textContent = doacao.descricao || "";
    document.getElementById("quantidade").textContent = `${doacao.quantidade} ${doacao.unidadeMedida}`;
    document.getElementById("categoria").textContent = `Categoria: ${doacao.categoria}`;
    document.getElementById("voltar").onclick = () => window.history.back();
    await initMap(doadorCoords, ongCoords);
  } catch (err) {
    console.error("Erro ao carregar mapa:", err);
    if (err.message.includes("403")) {
      alert("Sua sessão expirou. Faça login novamente.");
      window.location.href = "/pages/cadastrologin/login.html";
    } else {
      alert("Não foi possível carregar a geolocalização.");
    }
  }
})();
