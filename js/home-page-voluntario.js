document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
      const nome = localStorage.getItem("nomeUsuario");
      document.getElementById("nomeUsuario").textContent = nome;
    });
    const resp = await fetch("http://localhost:8080/admin/usuarios/perfil", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` 
    
       }
      });
      const usuario = await resposta.json();
      return usuario.nome;
      



    function logout() {
      localStorage.clear();
      window.location.href = "/pages/cadastrologin/login.html";
    }