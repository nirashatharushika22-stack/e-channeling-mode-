const form = document.getElementById('bookForm');
const docSel = document.getElementById('doctor');
const nameIn = document.getElementById('pname');
const phoneIn = document.getElementById('phone');
const dateIn = document.getElementById('date');
const hint = document.getElementById('dateHint');
const confirmBox = document.getElementById('confirm');
const errs = { name: document.getElementById('e1'), phone: document.getElementById('e2'), date: document.getElementById('e3') };

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* Doctor dropdown (supports ?doc=index from the Doctors page) */
docSel.innerHTML = doctors.map((d, i) =>
  `<option value="${i}">${d.name} - ${d.spec} (${centers[d.center].name})</option>`).join('');
const pre = Number(new URLSearchParams(location.search).get('doc'));
if (Number.isInteger(pre) && pre >= 0 && pre < doctors.length) docSel.value = pre;

/* Earliest bookable date = today (local time) */
const t = new Date();
dateIn.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

const currentDoctor = () => doctors[Number(docSel.value)];
function updateHint() {
  const d = currentDoctor();
  hint.textContent = `${d.name} is available on: ${d.days} at ${d.time}.`;
}
updateHint();
docSel.onchange = () => { updateHint(); errs.date.textContent = ''; };

form.onsubmit = e => {
  e.preventDefault();
  Object.values(errs).forEach(el => el.textContent = '');
  confirmBox.style.display = 'none';

  const d = currentDoctor();
  const name = nameIn.value.trim();
  const phone = phoneIn.value.replace(/[\s-]/g, '');
  const dateVal = dateIn.value;
  let firstBad = null;
  const fail = (key, input, msg) => { errs[key].textContent = msg; firstBad = firstBad || input; };

  if (!/^[A-Za-z .'-]{3,}$/.test(name)) fail('name', nameIn, 'Enter your full name (letters only, at least 3 characters).');
  if (!/^0\d{9}$/.test(phone)) fail('phone', phoneIn, 'Enter a valid 10-digit phone number, e.g. 0771234567.');

  if (!dateVal) {
    fail('date', dateIn, 'Please choose a date.');
  } else if (dateVal < dateIn.min) {
    fail('date', dateIn, 'Date cannot be in the past.');
  } else {
    const [y, m, day] = dateVal.split('-').map(Number);
    const weekday = DAY_NAMES[new Date(y, m - 1, day).getDay()];
    if (!d.days.split(',').map(s => s.trim()).includes(weekday)) {
      fail('date', dateIn, `${d.name} is not available on ${weekday}. Choose: ${d.days}.`);
    }
  }

  if (firstBad) { firstBad.focus(); return; }

  const ref = 'EC' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
  confirmBox.replaceChildren();
  const add = (tag, text) => { const el = document.createElement(tag); el.textContent = text; confirmBox.appendChild(el); };
  add('h2', 'Booking Confirmed ✔');
  add('p', `Reference: ${ref}`);
  add('p', `${name}, your appointment with ${d.name} (${d.spec}) at ${centers[d.center].name} is booked for ${dateVal} at ${d.time}.`);
  add('p', `Please pay Rs. ${d.fee} at the medical center.`);
  confirmBox.style.display = 'block';
  confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nameIn.value = phoneIn.value = dateIn.value = '';
};

[['name', nameIn], ['phone', phoneIn], ['date', dateIn]].forEach(([k, el]) =>
  el.addEventListener('input', () => errs[k].textContent = ''));
