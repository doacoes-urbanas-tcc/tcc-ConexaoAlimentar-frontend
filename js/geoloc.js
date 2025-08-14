document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const idReserva = params.get("idReserva");
  const idDoacao = params.get("id");
  const token = localStorage.getItem("token");
  const API_BASE = "https://conexao-alimentar.onrender.com";

  if (!idReserva && !idDoacao) {
    console.error("Nenhum identificador informado (idReserva ou id).");
    alert("Parâmetros inválidos para geolocalização.");
    return;
  }

  try {
    console.log("Iniciando geolocalização. idReserva:", idReserva, "idDoacao:", idDoacao);

    const doadorCoords = idReserva
      ? await getLocalizacaoPorReserva(idReserva)
      : await getLocalizacaoPorDoacao(idDoacao);

    const ongCoords = await getOngLocation();

    initMap(doadorCoords, ongCoords);
  } catch (error) {
    console.error("Erro ao carregar mapa:", error);
    alert(error.message || "Não foi possível carregar o mapa.");
  }

  async function safeFetch(url, opts = {}) {
    opts.headers = opts.headers || {};
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(url, opts);
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    if (!res.ok) throw new Error(body?.msg || body?.message || res.statusText || "Erro na requisição");
    return body;
  }

  async function getLocalizacaoPorReserva(reservaId) {
    console.log("Buscando localização por reserva:", reservaId);
    const data = await safeFetch(`${API_BASE}/reservas/${reservaId}/localizacao`);
    validarCoords(data);
    return { lat: data.latitude, lng: data.longitude };
  }

  async function getLocalizacaoPorDoacao(doacaoId) {
    console.log("Tentando usar localStorage.dadosDoacao...");
    const cache = localStorage.getItem("dadosDoacao");
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        if (Number(parsed?.id) === Number(doacaoId) && parsed?.lat && parsed?.lng) {
          console.log("Coordenadas vindas do localStorage.");
          return { lat: parsed.lat, lng: parsed.lng };
        }
      } catch {}
    }

    console.log("Buscando doação na API:", doacaoId);
    const d = await safeFetch(`${API_BASE}/doacoes/${doacaoId}`);
    if (d?.latitude && d?.longitude) {
      return { lat: d.latitude, lng: d.longitude };
    }

    if (d?.doador?.endereco?.latitude && d?.doador?.endereco?.longitude) {
      return { lat: d.doador.endereco.latitude, lng: d.doador.endereco.longitude };
    }

    throw new Error("Localização do doador não disponível para esta doação.");
  }

  async function getOngLocation() {
    console.log("Buscando localização da ONG (usuário logado)...");
    const data = await safeFetch(`${API_BASE}/admin/usuarios/usuario/localizacao`);
    validarCoords(data);
    return { lat: data.latitude, lng: data.longitude };
  }

  function validarCoords(obj) {
    if (!obj?.latitude || !obj?.longitude) {
      throw new Error("Localização não disponível.");
    }
  }

  function initMap(doadorCoords, ongCoords) {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: doadorCoords,
      zoom: 12
    });

    new google.maps.Marker({
      position: doadorCoords,
      map: map,
      label: "D",
      title: "Local do Doador"
    });

    new google.maps.Marker({
      position: ongCoords,
      map: map,
      label: "O",
      title: "Local da ONG"
    });

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(doadorCoords);
    bounds.extend(ongCoords);
    map.fitBounds(bounds);
  }
});
