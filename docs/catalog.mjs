export const WHATSAPP_NUMBER = '5531997491835';
export const WHATSAPP_LABEL = '(31) 99749-1835';

export const PRODUCTS = Object.freeze([
  { id: 'brasileiro', name: 'Volume Brasileiro', category: 'cilios', label: 'Cílios', image: 'brasileiro', alt: 'Imagem ilustrativa de cílios com volume leve e delicado', description: 'Leveza e definição para um olhar que encanta.' },
  { id: 'hollywood', name: 'Volume Hollywood', category: 'cilios', label: 'Cílios', image: 'hollywood', alt: 'Imagem ilustrativa de extensão de cílios com volume marcante', description: 'Um toque de intensidade, com presença e elegância.' },
  { id: 'henna', name: 'Design com Henna', category: 'sobrancelhas', label: 'Sobrancelhas', image: 'henna', alt: 'Imagem ilustrativa de sobrancelha definida com henna', description: 'Mais definição para valorizar os traços do seu rosto.' },
  { id: 'natural', name: 'Design Natural', category: 'sobrancelhas', label: 'Sobrancelhas', image: 'natural', alt: 'Imagem ilustrativa de sobrancelha natural com fios delicados', description: 'Sua beleza natural, respeitada em cada detalhe.' },
  { id: 'remocao', name: 'Remoção de Cílios', category: 'cilios', label: 'Cuidado', image: 'remocao', alt: 'Imagem ilustrativa de um atendimento delicado para remoção de cílios', description: 'Um cuidado delicado para uma nova fase do seu olhar.' },
  { id: 'buque', name: 'Buquê Personalizado', category: 'buques', label: 'Buquês', image: 'buque', alt: 'Imagem ilustrativa de um buquê de rosas vermelhas e flores claras com laço vinho', description: 'Flores e detalhes para transformar carinho em presente.' }
]);

const validIds = new Set(PRODUCTS.map(item => item.id));

export function sanitizeSelection(raw) {
  if (!Array.isArray(raw)) return [];
  const amounts = new Map();
  for (const row of raw) {
    if (!row || !validIds.has(row.id)) continue;
    const value = Number(row.quantity);
    if (!Number.isFinite(value) || value < 1) continue;
    const quantity = Math.min(20, Math.floor(value));
    amounts.set(row.id, Math.min(20, (amounts.get(row.id) || 0) + quantity));
  }
  return [...amounts].map(([id, quantity]) => ({ id, quantity }));
}

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function itemMessage(product) {
  return `Olá, Geovana! Tenho interesse em ${product.name}. Poderia me informar o valor e a disponibilidade?`;
}

export function selectionMessage(raw, details = {}) {
  const selection = sanitizeSelection(raw);
  if (!selection.length) return '';
  const lines = ['Olá, Geovana! Gostaria de consultar os seguintes itens:', ''];
  if (details.name?.trim()) lines.push(`Meu nome: ${details.name.trim().slice(0, 80)}`, '');
  for (const row of selection) {
    const product = PRODUCTS.find(item => item.id === row.id);
    lines.push(`• ${row.quantity} × ${product.name} — sob consulta`);
  }
  if (details.date) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(details.date);
    if (match) lines.push('', `Data de preferência: ${match[3]}/${match[2]}/${match[1]}`);
  }
  if (details.notes?.trim()) lines.push('', `Observações: ${details.notes.trim().slice(0, 600)}`);
  lines.push('', 'Pode confirmar os valores e a disponibilidade, por favor?');
  return lines.join('\n');
}
