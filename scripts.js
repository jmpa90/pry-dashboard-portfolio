let projects = [];

async function fetchProjects() {
  try {
    const res = await fetch('projects.json');
    projects = await res.json();

    // Ordenar por fechaModificacion descendente (más reciente primero)
    projects.sort((a, b) => new Date(b.fechaModificacion) - new Date(a.fechaModificacion));

    populateCategoryFilter();
    renderProjects(projects);
  } catch (err) {
    console.error('Error cargando proyectos:', err);
  }
}

function populateCategoryFilter() {
  const categoriaSet = new Set(projects.map(p => p.categoria));
  const select = document.getElementById('categoriaFilter');

  categoriaSet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}




function renderProjects(projectList) {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';

  if (projectList.length === 0) {
    container.innerHTML = '<p>No se encontraron proyectos con esos filtros.</p>';
    return;
  }

  projectList.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'col-md-6';

    // Formatear fecha a formato legible, ej: "10 Jul 2024"
    const fecha = new Date(proj.fechaModificacion);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${proj.titulo}</h5>
          <p><strong>Categoría:</strong> ${proj.categoria}</p>
          <p><strong>Nivel:</strong> ${proj.nivel}</p>
          <p>${proj.descripcion.length > 150 ? proj.descripcion.slice(0, 150) + '...' : proj.descripcion}</p>
          <div>
          <strong>Etiquetas:</strong>
          <div class="d-flex flex-wrap gap-1 mt-1">
            ${proj.etiquetas.map(t => {
              const className = `badge-tag badge-${t.toLowerCase().replace(/\s+/g, '-')}`;
              return `<span class="${className}">${t}</span>`;
            }).join('')}
          </div>
        </div>
          <p><strong>Última modificación:</strong> ${fechaFormateada}</p>

          <a href="${proj.link}" target="_blank" class="btn btn-outline-primary btn-sm">Ver Proyecto</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}



function filterProjects() {
  const categoriaValue = document.getElementById('categoriaFilter').value;
  const nivelValue = document.getElementById('nivelFilter').value;
  const tagValue = document.getElementById('tagFilter').value.toLowerCase();

  let filtered = projects;

  if (categoriaValue !== 'all') {
    filtered = filtered.filter(p => p.categoria === categoriaValue);
  }

  if (nivelValue !== 'all') {
    filtered = filtered.filter(p => p.nivel === nivelValue);
  }

  if (tagValue) {
    filtered = filtered.filter(p => p.etiquetas.some(t => t.toLowerCase().includes(tagValue)));
  }

  renderProjects(filtered);
}

document.getElementById('categoriaFilter').addEventListener('change', filterProjects);
document.getElementById('nivelFilter').addEventListener('change', filterProjects);
document.getElementById('tagFilter').addEventListener('input', filterProjects);

document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  document.getElementById('categoriaFilter').value = 'all';
  document.getElementById('nivelFilter').value = 'all';
  document.getElementById('tagFilter').value = '';
  filterProjects();
});

// Función para mostrar modal con detalles del proyecto
// function showProjectDetails(title) {
//   const project = projects.find(p => p.titulo === title);
//   if (!project) return;

//   const modalTitle = document.getElementById('projectModalLabel');
//   const modalBody = document.getElementById('projectModalBody');
//   const modalLink = document.getElementById('projectModalLink');

//   modalTitle.textContent = project.titulo;
//   modalBody.innerHTML = `
//     <p><strong>Categoría:</strong> ${project.categoria}</p>
//     <p><strong>Nivel:</strong> ${project.nivel}</p>
//     <p>${project.descripcion}</p>
//     <p><strong>Etiquetas:</strong> ${project.etiquetas.map(t => `<span class="badge bg-primary me-1">${t}</span>`).join('')}</p>
//   `;

//   modalLink.href = project.link;

//   // Mostrar el modal con Bootstrap 5 JS
//   const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
//   projectModal.show();
// }

// Delegación de eventos para botones "Ver Proyecto"
document.getElementById('projectsContainer').addEventListener('click', (e) => {
  if (e.target.classList.contains('view-project-btn')) {
    e.preventDefault();
    const title = e.target.getAttribute('data-id');
    showProjectDetails(title);
  }
});



fetchProjects();
