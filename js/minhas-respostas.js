function logout() {
      localStorage.removeItem("token");
      window.location.href = "/pages/cadastrologin/login.html";
    }
    function Menu(e) {
      const menu = document.getElementById("menu");
      if (menu.classList.contains("hidden")) {
        e.name = "close-outline";
        menu.classList.remove("hidden");
        menu.classList.add("flex");
      } else {
        e.name = "menu-outline";
        menu.classList.remove("flex");
        menu.classList.add("hidden");
      }
    }