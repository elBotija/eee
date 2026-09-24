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
    // Usamos el endpoint JSON de visualización (gviz) en lugar de CSV.
    // Esto evita la redirección (307) que bloquea el polyfill de fetch en iOS 9.
    const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:json`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Sheet no público o ID incorrecto');
    
    const text = await response.text();
    // El texto viene envuelto en una función, extraemos solo el JSON:
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);
    const rows = data.table.rows || [];
    
    // Filtramos las filas. Columna 0: Tarea, Columna 1: Estado/Fecha (opcional)
    const tasks = rows.filter(r => r && r.c && r.c[0] && r.c[0].v !== null && r.c[0].v.toString().trim() !== '');

    listEl.innerHTML = ''; // Limpiar
    
    if (tasks.length === 0) {
      listEl.innerHTML = '<li class="text-zinc-500 italic text-center mt-4">Todo limpio 🎉</li>';
    } else {
      tasks.slice(0, 8).forEach(task => {
        const title = task.c[0].v.toString();
        const subtitle = (task.c[1] && task.c[1].v !== null) ? task.c[1].v.toString() : '';
        
        const li = document.createElement('li');
        li.className = "flex items-center gap-3";
        li.innerHTML = `
          <div class="w-4 h-4 rounded-full border-2 border-emerald-500 flex-shrink-0"></div>
          <span class="truncate">${title}</span>
          ${subtitle ? `<span class="ml-auto text-sm text-zinc-500">${subtitle}</span>` : ''}
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
