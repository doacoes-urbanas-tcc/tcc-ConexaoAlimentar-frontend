const token = localStorage.getItem("token");

    fetch("http://localhost:8080/tasks-ti/voluntario", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(tasks => {
      const container = document.getElementById("listaTasks");
      tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow";

        card.innerHTML = `
          <h2 class="text-xl font-semibold">${task.titulo}</h2>
          <p class="text-gray-700">${task.descricao}</p>
          <p class="text-sm mt-2 text-gray-500">Tecnologias: ${task.tags.join(", ")}</p>
          <button onclick="verDetalhes(${task.id})" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Ver Detalhes</button>
        `;
        container.appendChild(card);
      });
    });

    function verDetalhes(id) {
      window.location.href = `detalhes-task-ti.html?id=${id}`;
    }