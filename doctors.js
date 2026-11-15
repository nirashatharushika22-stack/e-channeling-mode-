const list = document.getElementById('docList');
const q = document.getElementById('q');
const cs = document.getElementById('cs');

cs.innerHTML = '<option value="">All centers</option>' +
  centers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

q.value = new URLSearchParams(location.search).get('q') || '';

function show() {
  const text = q.value.trim().toLowerCase();
  const results = doctors
    .map((d, i) => ({ ...d, i }))
    .filter(d => (d.name + ' ' + d.spec).toLowerCase().includes(text))
    .filter(d => cs.value === '' || d.center === Number(cs.value));

  if (results.length === 0) {
    list.innerHTML = '<p class="empty">No doctors found.</p>';
    return;
  }
  list.innerHTML = results.map(d => `
    <article class="card">
      <img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.onerror=null;this.src='images/avatar.svg'">
      <h3>${d.name}</h3>
      <span class="tag">${d.spec}</span>
      <p>${centers[d.center].name}</p>
      <p>📅 ${d.days} | ⏰ ${d.time}</p>
      <p><strong>Rs. ${d.fee}</strong></p>
      <a class="btn" href="book.html?doc=${d.i}">Book Now</a>
    </article>`).join('');
}

q.oninput = show;
cs.onchange = show;
show();

document.getElementById('timeBody').innerHTML = doctors.map(d => `
  <tr>
    <td>${d.name}</td>
    <td>${d.spec}</td>
    <td>${centers[d.center].name}</td>
    <td>${d.days}</td>
    <td>${d.time}</td>
    <td>${d.fee}</td>
  </tr>`).join('');
