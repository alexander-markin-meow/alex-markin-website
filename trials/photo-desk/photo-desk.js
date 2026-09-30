// Proportional positions keep the shared composition usable at different widths.
// Only these bounded numeric/boolean fields are shared; no visitor-authored HTML.
const desk = document.getElementById('desk');
const picker = document.getElementById('object-picker');
const status = document.getElementById('connection');
const announcement = document.getElementById('announcement');
const objects = [...desk.querySelectorAll('.object')];
const defaults = new Map(objects.map((element) => [element.id, {
  x: Number(element.dataset.x), y: Number(element.dataset.y),
  angle: Number(element.dataset.angle), size: 1, flipped: false, on: false,
  z: Number(element.dataset.z)
}]));
const states = new Map([...defaults].map(([id, value]) => [id, { ...value }]));
const handles = new Map();
let selected = picker.value;
let sharedReady = false;
let provider;
let playhtml;
let online = false;
let drag = null;
let pendingMove = null;
let moveTimer;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const number = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : fallback;

function clean(data, fallback) {
  return {
    x: number(data?.x, fallback.x, 0, 1), y: number(data?.y, fallback.y, 0, 1),
    angle: number(data?.angle, fallback.angle, -180, 180),
    size: number(data?.size, 1, .75, 1.25),
    z: Math.round(number(data?.z, fallback.z, 1, 1000000)),
    flipped: data?.flipped === true, on: data?.on === true
  };
}

function dimensions(element, state) {
  // Reserve the complete rotated footprint, including a small selection gutter.
  const angle = state.angle * Math.PI / 180;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const footprintWidth = width * Math.abs(Math.cos(angle)) + height * Math.abs(Math.sin(angle));
  const footprintHeight = height * Math.abs(Math.cos(angle)) + width * Math.abs(Math.sin(angle));
  // A tall note rotated sideways can exceed a narrow phone's desk. Fit it locally
  // without changing the shared size that other visitors chose.
  const size = Math.min(state.size, (desk.clientWidth - 20) / footprintWidth, (desk.clientHeight - 20) / footprintHeight);
  const rotatedWidth = footprintWidth * size;
  const rotatedHeight = footprintHeight * size;
  return {
    size,
    left: Math.max(10, (rotatedWidth - width) / 2 + 10),
    top: Math.max(10, (rotatedHeight - height) / 2 + 10),
    travelX: Math.max(0, desk.clientWidth - Math.max(width, rotatedWidth) - 20),
    travelY: Math.max(0, desk.clientHeight - Math.max(height, rotatedHeight) - 20)
  };
}

function render(element) {
  const state = states.get(element.id);
  const box = dimensions(element, state);
  element.style.left = `${box.left + state.x * box.travelX}px`;
  element.style.top = `${box.top + state.y * box.travelY}px`;
  element.style.zIndex = state.z;
  element.style.setProperty('--angle', `${state.angle}deg`);
  element.style.setProperty('--size', box.size);
  element.dataset.flipped = String(state.flipped);
  element.dataset.on = String(state.on);
  element.classList.toggle('is-selected', selected === element.id);
  if (element.dataset.kind === 'lamp') {
    desk.dataset.light = state.on ? 'on' : 'off';
    desk.style.setProperty('--light-x', `${state.x * 100}%`);
    desk.style.setProperty('--light-y', `${state.y * 100}%`);
  }
  if (element.id === selected) updateControls();
}

function updateControls() {
  const element = document.getElementById(selected);
  const state = states.get(selected);
  const kind = element.dataset.kind;
  document.getElementById('flip-object').textContent = kind === 'lamp' ? (state.on ? 'light off' : 'light on') : kind === 'cup' ? (state.flipped ? 'fill cup' : 'empty cup') : (state.flipped ? 'show front' : 'flip print');
  document.getElementById('selection-detail').textContent = `${state.angle}° · ${Math.round(state.size * 100)}%${kind === 'lamp' ? (state.on ? ' · light on' : ' · light off') : ''}`;
  document.querySelector('[data-action="smaller"]').disabled = state.size <= .75;
  document.querySelector('[data-action="larger"]').disabled = state.size >= 1.25;
}

function write(id, changes) {
  if (sharedReady) {
    // Mutating only changed properties preserves concurrent edits to other fields.
    handles.get(id).setData((draft) => { Object.assign(draft, changes); });
  } else {
    states.set(id, clean({ ...states.get(id), ...changes }, defaults.get(id)));
    render(document.getElementById(id));
  }
}

function front(id) {
  const highest = Math.max(...[...states.values()].map((state) => state.z));
  if (states.get(id).z !== highest) write(id, { z: Math.min(highest + 1, 1000000) });
}

function select(id, raise = false) {
  selected = id;
  picker.value = id;
  objects.forEach((element) => element.classList.toggle('is-selected', element.id === id));
  if (raise) front(id);
  updateControls();
}

function action(name) {
  const state = states.get(selected);
  const element = document.getElementById(selected);
  if (name === 'left' || name === 'right') {
    let angle = state.angle + (name === 'left' ? -15 : 15);
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    write(selected, { angle });
  } else if (name === 'smaller' || name === 'larger') {
    write(selected, { size: Math.round(clamp(state.size + (name === 'smaller' ? -.1 : .1), .75, 1.25) * 100) / 100 });
  } else if (name === 'flip') {
    write(selected, element.dataset.kind === 'lamp' ? { on: !state.on } : { flipped: !state.flipped });
  } else if (name === 'front') front(selected);
  else if (name === 'reset') write(selected, { ...defaults.get(selected) });
}

function flushMove() {
  clearTimeout(moveTimer);
  moveTimer = undefined;
  if (!pendingMove) return;
  const { id, x, y } = pendingMove;
  pendingMove = null;
  write(id, { x, y });
}

for (const element of objects) {
  render(element);
  element.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    flushMove();
    select(element.id, true);
    element.focus({ preventScroll: true });
    const state = states.get(element.id);
    drag = { id: element.id, pointer: event.pointerId, startX: event.clientX, startY: event.clientY, x: state.x, y: state.y, ...dimensions(element, state) };
    element.setPointerCapture(event.pointerId);
    element.classList.add('is-dragging');
  });
  element.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== element.id || drag.pointer !== event.pointerId) return;
    const x = clamp(drag.x + (event.clientX - drag.startX) / Math.max(1, drag.travelX), 0, 1);
    const y = clamp(drag.y + (event.clientY - drag.startY) / Math.max(1, drag.travelY), 0, 1);
    // Render immediately, publish at most 20 writes/sec, and flush on release.
    states.set(element.id, { ...states.get(element.id), x, y });
    render(element);
    pendingMove = { id: element.id, x: Math.round(x * 10000) / 10000, y: Math.round(y * 10000) / 10000 };
    if (!moveTimer) moveTimer = setTimeout(flushMove, 50);
  });
  const release = (event) => {
    if (!drag || drag.pointer !== event.pointerId) return;
    flushMove();
    drag = null;
    element.classList.remove('is-dragging');
  };
  element.addEventListener('pointerup', release);
  element.addEventListener('pointercancel', release);
  element.addEventListener('lostpointercapture', release);
  element.addEventListener('focus', () => select(element.id));
  element.addEventListener('dblclick', () => { select(element.id); action('flip'); });
  element.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const state = states.get(element.id);
    const step = event.shiftKey ? .05 : .01;
    const movement = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    select(element.id);
    if (movement) {
      event.preventDefault();
      front(selected);
      write(selected, { x: clamp(state.x + movement[0], 0, 1), y: clamp(state.y + movement[1], 0, 1) });
    } else {
      const command = { r: 'right', R: 'left', f: 'flip', F: 'flip', Enter: 'flip', ' ': 'flip', '+': 'larger', '=': 'larger', '-': 'smaller' }[event.key];
      if (command) { event.preventDefault(); action(command); }
    }
  });
}

picker.addEventListener('change', () => {
  select(picker.value, true);
  document.getElementById(selected).focus({ preventScroll: true });
});
document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));
const dialog = document.getElementById('reset-dialog');
document.getElementById('reset-desk').addEventListener('click', () => {
  dialog.returnValue = '';
  dialog.showModal();
});
dialog.addEventListener('close', () => {
  if (dialog.returnValue !== 'reset') return;
  flushMove();
  objects.forEach((element) => write(element.id, { ...defaults.get(element.id) }));
  announcement.textContent = sharedReady ? 'the desk has been reset for everyone.' : 'the desk has been reset in this tab.';
});
const resizeObserver = new ResizeObserver(() => objects.forEach(render));
resizeObserver.observe(desk);
objects.forEach((element) => resizeObserver.observe(element));
desk.querySelectorAll('img').forEach((image) => image.addEventListener('load', () => objects.forEach(render)));

function showConnection() {
  status.dataset.state = online ? 'live' : 'offline';
  if (online) {
    const count = playhtml.users.getAll().length;
    status.textContent = count > 1 ? `shared desk · ${count} people here` : 'shared desk · you’re here';
  } else {
    status.textContent = sharedReady ? 'reconnecting · changes wait in this tab' : 'connection unavailable · try the desk in this tab';
  }
}

const slowConnection = setTimeout(() => { if (!sharedReady) showConnection(); }, 12000);
window.addEventListener('offline', () => { online = false; showConnection(); });
window.addEventListener('online', () => { online = provider?.wsconnected === true; showConnection(); });
try {
  ({ playhtml } = await import('./vendor/playhtml-2.15.0/playhtml.es.js'));
  for (const element of objects) {
    handles.set(element.id, playhtml.register(element, {
      defaultData: { ...defaults.get(element.id) },
      update: ({ data }) => {
        states.set(element.id, clean(data, defaults.get(element.id)));
        render(element);
      }
    }));
  }
  const connection = playhtml.init({
    room: 'photo-desk-v1',
    host: 'api.playhtml.fun',
    cursors: { enabled: true, container: desk, enableChat: false },
    onError: () => { online = false; showConnection(); }
  });
  // The library exposes both init() and ready promises; handle both on failure.
  playhtml.ready.catch(() => {});
  provider = await connection;
  sharedReady = true;
  online = provider.wsconnected;
  clearTimeout(slowConnection);
  provider.on('status', ({ status: connection }) => { online = connection === 'connected'; showConnection(); });
  provider.on('sync', (synced) => { if (synced) { online = true; showConnection(); } });
  playhtml.users.onChange(showConnection);
  showConnection();
} catch (error) {
  clearTimeout(slowConnection);
  online = false;
  showConnection();
  console.warn('photo desk: shared connection unavailable', error);
}
