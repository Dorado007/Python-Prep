const canvas = document.getElementById('canvas');
const log = document.getElementById('log');
const runBtn = document.getElementById('runBtn');
const saveBtn = document.getElementById('saveBtn');
const search = document.getElementById('search');

const propEmpty = document.getElementById('propEmpty');
const propForm = document.getElementById('propForm');
const propName = document.getElementById('propName');
const propParams = document.getElementById('propParams');

const activities = [...document.querySelectorAll('.activity')];
let flow = [
  { id: crypto.randomUUID(), type: 'start', name: 'Inicio', params: {} },
];
let selectedId = null;

const defaultNames = {
  start: 'Inicio',
  if: 'Condición If',
  for: 'Bucle For Each',
  while: 'Bucle While',
  wait: 'Esperar',
  end: 'Fin',
  'open-browser': 'Abrir Navegador',
  click: 'Click Elemento',
  write: 'Escribir Texto',
};

function renderFlow() {
  canvas.innerHTML = '';

  flow.forEach((node) => {
    const card = document.createElement('article');
    card.className = `node ${selectedId === node.id ? 'selected' : ''}`;
    card.dataset.id = node.id;
    card.innerHTML = `
      <div class="node-title">${node.name}</div>
      <div class="node-subtitle">${node.type}</div>
    `;

    card.addEventListener('click', () => {
      selectedId = node.id;
      renderProperties();
      renderFlow();
    });

    canvas.appendChild(card);
  });
}

function renderProperties() {
  const node = flow.find((item) => item.id === selectedId);
  if (!node) {
    propEmpty.classList.remove('hidden');
    propForm.classList.add('hidden');
    return;
  }

  propEmpty.classList.add('hidden');
  propForm.classList.remove('hidden');
  propName.value = node.name;
  propParams.value = JSON.stringify(node.params, null, 2);
}

activities.forEach((activity) => {
  activity.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', activity.dataset.type);
  });
});

canvas.addEventListener('dragover', (event) => {
  event.preventDefault();
});

canvas.addEventListener('drop', (event) => {
  event.preventDefault();
  const type = event.dataTransfer.getData('text/plain');

  if (!type) {
    return;
  }

  flow.push({
    id: crypto.randomUUID(),
    type,
    name: defaultNames[type] || type,
    params: {},
  });
  renderFlow();
});

propForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const index = flow.findIndex((node) => node.id === selectedId);

  if (index === -1) {
    return;
  }

  try {
    flow[index].name = propName.value.trim() || flow[index].name;
    flow[index].params = propParams.value.trim() ? JSON.parse(propParams.value) : {};
    log.textContent = `✔ Bloque "${flow[index].name}" actualizado.`;
    renderFlow();
  } catch {
    log.textContent = '✖ JSON inválido en parámetros.';
  }
});

runBtn.addEventListener('click', () => {
  const now = new Date().toLocaleTimeString('es-AR');
  const lines = flow.map((step, index) => `${index + 1}. ${step.name} (${step.type})`);
  log.textContent = [`[${now}] Ejecutando flujo...`, ...lines, `[${now}] Flujo finalizado.`].join('\n');
});

saveBtn.addEventListener('click', () => {
  const automationName = document.getElementById('automationName').value || 'automatizacion';
  const payload = {
    name: automationName,
    version: 1,
    updatedAt: new Date().toISOString(),
    flow,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${automationName.toLowerCase().replaceAll(' ', '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
  log.textContent = '✔ Automatización exportada en JSON.';
});

search.addEventListener('input', () => {
  const query = search.value.toLowerCase().trim();
  activities.forEach((item) => {
    const visible = item.textContent.toLowerCase().includes(query);
    item.style.display = visible ? 'block' : 'none';
  });
});

renderFlow();
renderProperties();
