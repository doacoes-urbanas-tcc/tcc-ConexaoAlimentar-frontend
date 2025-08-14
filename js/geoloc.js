document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const idReserva = params.get("idReserva");

    if (!idReserva) {
        console.error("ID da reserva não informado");
        alert("ID da reserva não informado.");
        return;
    }

    try {
        const doadorCoords = await getLocalizacaoDoador(idReserva);
        const ongCoords = await getOngLocation();

        initMap(doadorCoords, ongCoords);
    } catch (error) {
        console.error("Erro ao carregar mapa:", error);
        alert("Não foi possível carregar o mapa.");
    }
});

async function getLocalizacaoDoador(idReserva) {
    const res = await fetch(`/api/reservas/${idReserva}/localizacao`);
    if (!res.ok) throw new Error("Erro ao buscar localização do doador");
    const data = await res.json();

    if (!data.latitude || !data.longitude) {
        throw new Error("Localização do doador não disponível");
    }

    return { lat: data.latitude, lng: data.longitude };
}

async function getOngLocation() {
    const res = await fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/usuario/localizacao`);
    if (!res.ok) throw new Error("Erro ao buscar localização da ONG");
    const data = await res.json();

    if (!data.latitude || !data.longitude) {
        throw new Error("Localização da ONG não disponível");
    }

    return { lat: data.latitude, lng: data.longitude };
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
