 const setorSelect = document.getElementById("setorTi");
    const stacksContainer = document.getElementById("stacks");
    const stackInput = document.getElementById("stackConhecimento");
    const selectedStacks = new Set();

    const stacksPorSetor = {
      DESENVOLVIMENTO_BACKEND: ["Java", "Spring Boot", "Node.js", "Express", "Python", "Django"],
      DESENVOLVIMENTO_FRONTEND: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular"],
      BANCO_DE_DADOS: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQL Server"],
      SUPORTE_TECNICO: ["Windows", "Linux", "Help Desk", "Office 365", "GLPI"],
      SEGURANCA_DA_INFORMACAO: ["OWASP", "Kali Linux", "Wireshark", "ISO 27001", "LGPD"],
      DEVOPS_E_INFRAESTRUTURA: ["Docker", "Kubernetes", "Git", "CI/CD", "AWS", "Terraform"]
    };

    function renderTags(stacks) {
      stacksContainer.innerHTML = "";
      selectedStacks.clear();
      stackInput.value = "";

      stacks.forEach(stack => {
        const tag = document.createElement("button");
        tag.type = "button";
        tag.textContent = stack;
        tag.className = "tag bg-white border border-red-500 text-red-600 font-medium text-sm px-3 py-1 rounded-full hover:bg-red-100 cursor-pointer transition";

        tag.addEventListener("click", () => {
          if (selectedStacks.has(stack)) {
            selectedStacks.delete(stack);
            tag.classList.remove("bg-red-500", "text-white");
            tag.classList.add("bg-white", "text-red-600");
          } else {
            selectedStacks.add(stack);
            tag.classList.remove("bg-white", "text-red-600");
            tag.classList.add("bg-red-500", "text-white");
          }
          stackInput.value = Array.from(selectedStacks).join(", ");
        });

        stacksContainer.appendChild(tag);
      });
    }

    setorSelect.addEventListener("change", () => {
      const setor = setorSelect.value;
      if (stacksPorSetor[setor]) {
        renderTags(stacksPorSetor[setor]);
      } else {
        stacksContainer.innerHTML = "";
        stackInput.value = "";
        selectedStacks.clear();
      }
    });
   const form = document.getElementById('formTI');
   form.addEventListener('submit', async (e) => {
   e.preventDefault();

  const formData = new FormData();
  const voluntarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const dto = {
    setorTi: document.getElementById("setorTi").value,
    stackConhecimento: stackInput.value,
    certificacoes: "", 
    experiencia: document.getElementById("experiencia").value,
    linkedin: document.getElementById("linkedin").value,
    github: document.getElementById("github").value,
    disponibilidadeHoras: parseFloat(document.getElementById("disponibilidadeHoras").value)
  };

  formData.append("dados", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  formData.append("certificacoesFile", document.getElementById("certificacoesFile").files[0]);

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/voluntario/${voluntarioId}/perfil-ti`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Erro ao cadastrar perfil");

    showSuccess("Perfil cadastrado com sucesso! Redirecionando para a tela de login...");

    form.reset();
    selectedStacks.clear();
    stackInput.value = "";

    const tagButtons = document.querySelectorAll("#stacks button");
    tagButtons.forEach(tag => {
    tag.classList.remove('bg-red-500', 'text-white');
    tag.classList.add('bg-white', 'text-red-600', 'border-red-500');
});
setTimeout(() => {
  window.location.href = "/pages/cadastrologin/login.html";
}, 1000);


  } catch (err) {
    alert("Erro ao enviar formulário");
    console.error(err);
  }
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('modalSuccessMessage');
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
  const msgEl = document.getElementById('modalErrorMessage');
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




