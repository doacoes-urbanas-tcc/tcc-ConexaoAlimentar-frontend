function baixar(tipo, formato) {
  const token = localStorage.getItem("token");
  let url = `https://conexao-alimentar.onrender.com/admin/relatorio/${formato}`;

  if (tipo === 'doacoes-mensais') {
    const mes = document.getElementById('mes').value;
    const ano = document.getElementById('ano').value;
    url += `/doacoes-mensais?mes=${mes}&ano=${ano}`;  
  } else {
    url += `/${tipo}`;
  }

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.blob())
  .then(blob => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}
