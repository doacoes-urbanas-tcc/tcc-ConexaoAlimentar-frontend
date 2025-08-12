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
       showSuccess("Task cadastrada com sucesso!", () => {
       window.location.reload();
       });
       } else {
       showError("Erro ao cadastrar task.");
      }

    } catch (err) {
      showError("Erro ao cadastrar task.");
      console.error(err);
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/cadastrologin/login.html";
}


function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('mensagem-sucesso');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = document.getElementById('modalError');
  const msgEl = document.getElementById('mensagem-erro');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}


