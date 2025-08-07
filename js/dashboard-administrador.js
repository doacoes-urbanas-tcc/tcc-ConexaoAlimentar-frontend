async function carregarResumoDashboard() {
    const token = localStorage.getItem("token");
    const resp = await fetch("https://conexao-alimentar.onrender.com/admin/dashboard/resumo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resp.ok) {
      const resumo = await resp.json();
      document.getElementById("qtd-ativos").textContent = resumo.usuariosAtivos;
      document.getElementById("qtd-pendentes").textContent = resumo.usuariosPendentes;
      document.getElementById("qtd-doacoes").textContent = resumo.doacoesAtivas;
      document.getElementById("qtd-tasks").textContent = resumo.tasksAbertas;
    }
}

    async function carregarUltimosPendentes() {
      const token = localStorage.getItem("token");
      const resp = await fetch("https://conexao-alimentar.onrender.com/admin/dashboard/usuarios/pendentes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const lista = await resp.json();
        const tbody = document.getElementById("tabela-usuarios");
        tbody.innerHTML = "";
        lista.forEach(usuario => {
            console.log(usuario); 
          const tr = document.createElement("tr");
          tr.classList.add("hover:bg-gray-50");
          tr.innerHTML = `
            <td class="px-4 py-2">${usuario.nome}</td>
            <td class="px-4 py-2">${usuario.email}</td>
            <td class="px-4 py-2">${usuario.tipoUsuario}</td>
            <td class="px-4 py-2">${usuario.status}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "/pages/cadastrologin/login.html";
    }

    carregarResumoDashboard();
    carregarUltimosPendentes();