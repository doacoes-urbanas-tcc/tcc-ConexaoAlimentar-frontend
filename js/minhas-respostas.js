function logout() {
  localStorage.removeItem("token");
  showToast("Você saiu da conta.", "success");
  setTimeout(() => {
    window.location.href = "/pages/cadastrologin/login.html";
  }, 1200);
}

function Menu(e) {
  const menu = document.getElementById("menu");
  const isHidden = menu.classList.contains("hidden");

  e.name = isHidden ? "close-outline" : "menu-outline";
  menu.classList.toggle("hidden", !isHidden);
  menu.classList.toggle("flex", isHidden);
}
