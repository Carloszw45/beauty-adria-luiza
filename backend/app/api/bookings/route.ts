import { getRawDb } from "@/db";
import { services } from "@/lib/catalog";

type BookingRow = { id: string; service_id: string; service_name: string; total_cents: number; customer_name: string; customer_phone: string; preferred_date: string; preferred_time: string; status: string };
const pagesOrigin = "https://carloszw45.github.io";
function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin || origin === pagesOrigin;
}
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    "Cache-Control": "no-store",
    "Vary": "Origin",
    ...(origin && allowedOrigin(request) ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "600",
    } : {}),
  };
}
function publicReceipt(row: BookingRow) { return { id: row.id, code: row.id.slice(0, 8).toUpperCase(), serviceId: row.service_id, serviceName: row.service_name, totalCents: row.total_cents, name: row.customer_name, date: row.preferred_date, time: row.preferred_time, status: row.status }; }

export async function OPTIONS(request: Request) {
  return new Response(null, { status: allowedOrigin(request) ? 204 : 403, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const responseHeaders = corsHeaders(request);
  const failure = (error: string, status = 400) => Response.json({ error }, { status, headers: responseHeaders });
  if (!allowedOrigin(request)) return failure("Solicitação inválida.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return failure("Envie os dados do formulário.", 415);
  if (Number(request.headers.get("content-length") || 0) > 4096) return failure("Dados inválidos.", 413);
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 4096) return failure("Dados inválidos.", 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return failure("Dados inválidos.");
    payload = parsed as Record<string, unknown>;
  } catch { return failure("Confira os dados e tente novamente."); }
  const read = (key: string) => typeof payload[key] === "string" ? (payload[key] as string).trim() : "";
  const id = read("requestId");
  const service = services.find(s => s.id === read("serviceId"));
  const name = read("name"), phone = read("phone").replace(/\D/g, ""), date = read("date"), time = read("time");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return failure("Reabra o checkout para continuar.");
  if (!service) return failure("Escolha um serviço válido.");
  if (name.length < 2 || name.length > 80) return failure("Informe seu nome, com até 80 caracteres.");
  if (!/^(?:55)?\d{10,11}$/.test(phone)) return failure("Informe seu WhatsApp com DDD.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return failure("Escolha uma data e um horário válidos.");
  const candidate = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(candidate.getTime()) || !candidate.toISOString().startsWith(date)) return failure("Escolha uma data válida.");
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  const currentDate = `${part("year")}-${part("month")}-${part("day")}`;
  const currentTime = `${part("hour")}:${part("minute")}`;
  if (`${date} ${time}` <= `${currentDate} ${currentTime}`) return failure("Escolha um horário futuro. Volte e ajuste sua preferência.");
  if (candidate.getTime() > Date.now() + 180 * 86400000) return failure("Escolha uma data nos próximos seis meses.");
  try {
    const db = getRawDb();
    await db.prepare("INSERT INTO bookings (id, service_id, service_name, total_cents, customer_name, customer_phone, preferred_date, preferred_time, status, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'at_appointment', ?) ON CONFLICT(id) DO NOTHING")
      .bind(id, service.id, service.name, service.price, name, phone, date, time, new Date().toISOString()).run();
    const row = await db.prepare("SELECT id, service_id, service_name, total_cents, customer_name, customer_phone, preferred_date, preferred_time, status FROM bookings WHERE id = ?").bind(id).first<BookingRow>();
    if (!row) throw new Error("Booking was not saved.");
    if (row.customer_name !== name || row.customer_phone !== phone || row.service_id !== service.id || row.preferred_date !== date || row.preferred_time !== time) return failure("Os dados desta solicitação foram alterados. Reabra o checkout.", 409);
    return Response.json({ booking: publicReceipt(row) }, { status: 201, headers: responseHeaders });
  } catch (error) {
    console.error("Could not save appointment request", error instanceof Error ? error.message : "unknown error");
    return failure("Não foi possível registrar agora. Seus dados continuam preenchidos; tente novamente em instantes.", 503);
  }
}
