import { PRODUCTS, sanitizeSelection, whatsappUrl, itemMessage, selectionMessage } from './catalog.mjs';

const storageKey = 'geovana-designer-selection-v1';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let selection = [];
try { selection = sanitizeSelection(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { /* Storage may be unavailable. */ }
const dialog = $('#selection-dialog');
let lastOpener = null;
let toastTimer;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(selection)); } catch { /* Selection still works in memory. */ }
}

function announce(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function makeButton(text, action, id, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.dataset[action] = id;
  button.setAttribute('aria-label', label);
  return button;
}

function renderSelection() {
  const count = selection.reduce((total, item) => total + item.quantity, 0);
  $$('.selection-count').forEach(el => { el.textContent = count; });
  $$('.open-selection').forEach(el => el.setAttribute('aria-label', `Abrir minha seleção, ${count} ${count === 1 ? 'item' : 'itens'}`));
  $('#mobile-selection').classList.toggle('has-items', count > 0);
  $('#selection-items').replaceChildren();
  $('#selection-empty').hidden = count > 0;
  $('#selection-form').hidden = count === 0;
  $('#selection-subtitle').textContent = count ? `${count} ${count === 1 ? 'item escolhido' : 'itens escolhidos'} para consultar` : 'Um cuidado começa com uma escolha.';

  for (const row of selection) {
    const product = PRODUCTS.find(item => item.id === row.id);
    const item = document.createElement('li');
    item.className = 'selection-item';
    const photo = document.createElement('img');
    photo.src = `./assets/${product.image}-400.webp`;
    photo.alt = product.alt;
    photo.width = 80;
    photo.height = 96;
    const info = document.createElement('div');
    info.className = 'selection-item-info';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const price = document.createElement('p');
    price.textContent = 'Valor sob consulta';
    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    const minus = makeButton('−', 'decrease', product.id, `Diminuir quantidade de ${product.name}`);
    const amount = document.createElement('span');
    amount.textContent = row.quantity;
    amount.setAttribute('aria-label', `Quantidade: ${row.quantity}`);
    const plus = makeButton('+', 'increase', product.id, `Aumentar quantidade de ${product.name}`);
    plus.disabled = row.quantity >= 20;
    const remove = makeButton('Remover', 'remove', product.id, `Remover ${product.name}`);
    remove.className = 'remove-item';
    controls.append(minus, amount, plus, remove);
    info.append(title, price, controls);
    item.append(photo, info);
    $('#selection-items').append(item);
  }

  $$('[data-add]').forEach(button => {
    const row = selection.find(item => item.id === button.dataset.add);
    button.classList.toggle('is-selected', Boolean(row));
    button.setAttribute('aria-label', `${row ? 'Adicionar mais: ' : 'Adicionar à seleção: '}${PRODUCTS.find(item => item.id === button.dataset.add).name}`);
    button.querySelector('.add-symbol').textContent = row ? '✓' : '+';
  });
}

function changeQuantity(id, delta) {
  const row = selection.find(item => item.id === id);
  if (row) row.quantity = Math.min(20, row.quantity + delta);
  else if (delta > 0 && PRODUCTS.some(item => item.id === id)) selection.push({ id, quantity: 1 });
  selection = selection.filter(item => item.quantity > 0);
  save();
  renderSelection();
}

function openSelection(opener) {
  lastOpener = opener;
  renderSelection();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

function closeSelection() { dialog.close(); }

dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastOpener?.focus();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeSelection();
});
$$('.open-selection').forEach(button => button.addEventListener('click', () => openSelection(button)));
$$('[data-close-selection]').forEach(button => button.addEventListener('click', closeSelection));

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.add) {
    const product = PRODUCTS.find(item => item.id === button.dataset.add);
    const old = selection.find(item => item.id === product.id)?.quantity || 0;
    changeQuantity(product.id, 1);
    announce(old >= 20 ? 'Limite de 20 unidades por item.' : `${product.name} adicionado à sua seleção.`);
  }
  if (button.dataset.increase || button.dataset.decrease) {
    const action = button.dataset.increase ? 'increase' : 'decrease';
    const id = button.dataset[action];
    changeQuantity(id, action === 'increase' ? 1 : -1);
    const next = $(`[data-${action}="${id}"]`);
    (next || $('#selection-title')).focus();
  }
  if (button.dataset.remove) {
    selection = selection.filter(item => item.id !== button.dataset.remove);
    save();
    renderSelection();
    $('#selection-title').focus();
  }
});

const filterButtons = $$('.filter-button');
function applyFilter(value) {
  const category = ['todos', 'cilios', 'sobrancelhas', 'buques'].includes(value) ? value : 'todos';
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  let visible = 0;
  $$('.product-card').forEach(card => {
    const show = category === 'todos' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible++;
  });
  $('#catalog-status').textContent = `${visible} ${visible === 1 ? 'item disponível para consulta' : 'itens disponíveis para consulta'}`;
}
filterButtons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
$$('[data-category-link]').forEach(link => link.addEventListener('click', () => applyFilter(link.dataset.categoryLink)));

const localDate = new Date();
const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
$('#preferred-date').min = today;
$('#selection-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const message = selectionMessage(selection, {
    name: $('#customer-name').value,
    date: $('#preferred-date').value,
    notes: $('#customer-notes').value
  });
  if (!message) { announce('Escolha ao menos um item para consultar.'); return; }
  const url = whatsappUrl(message);
  const link = $('#whatsapp-fallback');
  link.href = url;
  $('#sent-hint').hidden = false;
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  // The visible link also supports browsers that block new tabs or return null with noopener.
  if (opened) opened.opener = null;
});

$$('[data-consult]').forEach(link => {
  const product = PRODUCTS.find(item => item.id === link.dataset.consult);
  if (product) link.href = whatsappUrl(itemMessage(product));
});

renderSelection();

const header = $('.site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const motionToggle = $('#motion-toggle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !prefersReducedMotion.matches;
function setMotion() {
  document.documentElement.classList.toggle('motion-paused', !motionEnabled);
  motionToggle.textContent = motionEnabled ? 'Pausar movimento' : 'Ativar movimento';
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
}
motionToggle.addEventListener('click', () => { motionEnabled = !motionEnabled; setMotion(); });
prefersReducedMotion.addEventListener?.('change', event => { motionEnabled = !event.matches; setMotion(); });
setMotion();
