  const token = localStorage.getItem("token");

    document.getElementById("form-task").addEventListener("submit", async (e) => {
      e.preventDefault();

      const dto = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        linkRepositorio: document.getElementById("linkRepositorio").value,
        tags: document.getElementById("tags").value.split(',').map(t => t.trim()).filter(Boolean)
      };

      const response = await fetch("http://localhost:8080/tasks-ti/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        alert("Task cadastrada com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao cadastrar task.");
      }
    });