const cards = document.getElementById('cards');
const search = document.getElementById('search');
const priority = document.getElementById('priority');
let items = [];

async function load() {
  const res = await fetch('data/opportunities_public.json', {cache: 'no-store'});
  items = await res.json();
  render();
}

function render() {
  const q = search.value.toLowerCase();
  const p = priority.value;
  const filtered = items.filter(x => {
    const hay = [x.title, x.source_name, x.programme, ...(x.topics || [])].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!p || x.priority === p);
  });
  cards.innerHTML = filtered.map(x => `
    <article class="card">
      <h2>${escapeHtml(x.title)}</h2>
      <p class="meta">${escapeHtml(x.source_name)} · ${escapeHtml(x.source_level)} · ${escapeHtml(x.status || 'unknown')}</p>
      <div class="score">${Number(x.score_0_100).toFixed(0)}</div>
      <p><span class="badge">${escapeHtml(x.priority)}</span>${x.deadline ? `<span class="badge">Deadline: ${escapeHtml(x.deadline)}</span>` : ''}</p>
      <p>${(x.topics || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</p>
      <p>${escapeHtml(x.public_summary || '')}</p>
      <p class="reason">${escapeHtml(x.public_reason || '')}</p>
      <a href="${x.url}" target="_blank" rel="noreferrer">Abrir fuente</a>
    </article>
  `).join('') || '<p>No hay oportunidades para este filtro.</p>';
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

search.addEventListener('input', render);
priority.addEventListener('change', render);
load().catch(err => { cards.innerHTML = `<p>Error cargando datos: ${escapeHtml(err.message)}</p>`; });
