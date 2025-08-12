const form = document.getElementById('form-agendamento');
const lista = document.getElementById('lista-agendamentos');
const horariosContainer = document.getElementById('horarios-container');
const dataInput = document.getElementById('data');
const horaInput = document.getElementById('hora');
const servicoInput = document.getElementById('servico');

let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
const horariosFixos = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Preenche o serviço se veio da outra tela
if (servicoInput) {
  const servicoSelecionado = localStorage.getItem('servicoSelecionado');
  if (servicoSelecionado) {
    servicoInput.value = servicoSelecionado;
  }
}

renderizarLista();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const agendamento = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    data: dataInput.value,
    hora: horaInput.value,
    servico: servicoInput.value
  };

  agendamentos.push(agendamento);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

  form.reset();
  horariosContainer.innerHTML = '';
  renderizarLista();
});

dataInput.addEventListener('change', () => {
  mostrarHorarios(dataInput.value);
});

function mostrarHorarios(dataSelecionada) {
  horariosContainer.innerHTML = '';
  
  const ocupados = agendamentos
    .filter(ag => ag.data === dataSelecionada)
    .map(ag => ag.hora);

  horariosFixos.forEach(horario => {
    const btn = document.createElement('button');
    btn.textContent = horario;
    btn.classList.add('horario');
    
    if (ocupados.includes(horario)) {
      btn.classList.add('ocupado');
      btn.disabled = true;
    } else {
      btn.classList.add('livre');
      btn.addEventListener('click', () => {
        horaInput.value = horario;
      });
    }

    horariosContainer.appendChild(btn);
  });
}

function renderizarLista() {
  lista.innerHTML = '';
  agendamentos.forEach((ag, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${ag.nome}</strong> (${ag.email})<br>
        ${ag.data} às ${ag.hora} - ${ag.servico}
      </div>
      <button class="remove" onclick="remover(${index})">X</button>
    `;
    lista.appendChild(li);
  });
}

function remover(index) {
  agendamentos.splice(index, 1);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  renderizarLista();
}
