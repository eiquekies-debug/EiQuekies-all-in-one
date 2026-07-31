export async function renderCalendar(container) {
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>📅 Kalendar Tempahan</h2>
      <p style="color: var(--text-muted);">Jadual pickup dan penghantaran bulanan.</p>
    </div>

    <div class="card" style="text-align: center; padding: 30px;">
      <h3 style="color: var(--primary-pink); margin-bottom: 15px;">🗓️ Mac 2026</h3>
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; font-weight: bold;">
        <div>Ahad</div><div>Isn</div><div>Sel</div><div>Rab</div><div>Kha</div><div>Jum</div><div>Sab</div>
      </div>
      <hr style="margin: 15px 0; border: none; border-top: 1px solid var(--border-color);">
      <p style="color: var(--text-muted);">Paparan kalendar interaktif sedia dihubungkan dengan jadual tempahan anda.</p>
    </div>
  `;
}
