const token = localStorage.getItem("token");

const tagsContainer = document.getElementById("tagsContainer");
const tagsInput = document.getElementById("tags");

const possibleTags = [
  "Java", "Spring Boot", "HTML", "CSS", "JavaScript", "React", "Vue.js",
  "Angular", "Node.js", "Python", "Django", "PostgreSQL", "MySQL", "MongoDB",
  "Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Terraform"
];

const selectedTags = new Set();

function renderTagButtons() {
  tagsContainer.innerHTML = "";
  possibleTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tag;
    btn.className = "bg-white border border-red-500 text-red-600 font-medium text-sm px-3 py-1 rounded-full hover:bg-red-100 cursor-pointer transition";

    if (selectedTags.has(tag)) {
      btn.classList.remove("bg-white", "text-red-600");
      btn.classList.add("bg-red-500", "text-white");
    }

    btn.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove("bg-red-500", "text-white");
        btn.classList.add("bg-white", "text-red-600");
      } else {
        selectedTags.add(tag);
        btn.classList.remove("bg-white", "text-red-600");
        btn.classList.add("bg-red-500", "text-white");
      }
      tagsInput.value = Array.from(selectedTags).join(", ");
    });

    tagsContainer.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTagButtons();

  document.getElementById("form-task").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dto = {
      titulo: document.getElementById("titulo").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      linkRepositorio: document.getElementById("linkRepositorio").value.trim(),
      tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const response = await fetch("https://conexao-alimentar.onrender.com/tasks-ti/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        showToast("Task cadastrada com sucesso!", "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast("Erro ao cadastrar task.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao cadastrar task.", "error");
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/cadastrologin/login.html";
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `p-4 rounded-lg shadow-md text-white ${type === "success" ? "bg-green-500" : "bg-red-500"} animate-fadeIn`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-500");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
