export async function initTasks(config) {
  const statusEl = document.getElementById('tasks-status');
  const listEl = document.getElementById('tasks-list');
  
  if (!config || !config.sheetId) {
    statusEl.textContent = "Sin configurar";
    statusEl.className = "text-sm text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20";
    listEl.innerHTML = '<li class="text-zinc-500 italic text-center mt-4">Agrega el ID de tu Google Sheet en Ajustes</li>';
    return;
  }

  statusEl.textContent = "Sincronizando...";
  statusEl.className = "text-sm text-blue-400 font-medium bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20";

  try {
    // Para no requerir backend ni oauth, el sheet debe estar publicado en la web como CSV.
    // URL: https://docs.google.com/spreadsheets/d/{sheetId}/export?format=csv
    const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/export?format=csv`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Sheet no público o ID incorrecto');
    
    const csvText = await response.text();
    // Reemplazamos los retornos de carro \r y dividimos por líneas \n
    const rows = csvText.replace(/\r/g, '').split('\n').map(row => row.split(','));
    
    // Filtramos las filas vacías. Columna 0: Tarea, Columna 1: Estado/Fecha (opcional)
    // Ya no saltamos la fila 1 (slice), tomamos todo desde la fila 1 (A1).
    const tasks = rows.filter(r => r[0] && r[0].trim() !== '');

    listEl.innerHTML = ''; // Limpiar
    
    if (tasks.length === 0) {
      listEl.innerHTML = '<li class="text-zinc-500 italic text-center mt-4">Todo limpio 🎉</li>';
    } else {
      tasks.slice(0, 8).forEach(task => {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3";
        li.innerHTML = `
          <div class="w-4 h-4 rounded-full border-2 border-emerald-500 flex-shrink-0"></div>
          <span class="truncate">${task[0].replace(/"/g, '')}</span>
          ${task[1] ? `<span class="ml-auto text-sm text-zinc-500">${task[1].replace(/"/g, '')}</span>` : ''}
        `;
        listEl.appendChild(li);
      });
    }

    statusEl.textContent = "Sincronizado";
    statusEl.className = "text-sm text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20";

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error al leer";
    statusEl.className = "text-sm text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20";
    listEl.innerHTML = `<li class="text-red-400/70 italic text-sm mt-4 text-center">Revisa el ID y que el sheet esté "Publicado en la web"</li>`;
  }
}
