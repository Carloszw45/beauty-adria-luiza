"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, Clock3, CreditCard, Download, Heart, ShieldCheck, Sparkles, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { services, money, type Service } from "@/lib/catalog";

type Details = { name: string; phone: string; date: string; time: string };
type Receipt = { id: string; code: string; serviceId: string; serviceName: string; totalCents: number; name: string; date: string; time: string; status: string };

function localToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function displayDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(date) : "Data não informada";
}
function newRequestId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function ServicePhoto({ service, className = "" }: { service: Service; className?: string }) {
  if (service.photoTop === null) return <div className={`monogram ${className}`} aria-hidden="true"><span>AL</span><small>LASH DESIGNER</small></div>;
  return <div className={`photo-circle ${className}`}><img src={`${import.meta.env.BASE_URL}assets/service-reference.jpg`} alt={service.alt} width="691" height="1536" style={{ top: `${-(service.photoTop / 218) * 100}%` }} /></div>;
}
export default function Home() {
  const [selected, setSelected] = useState<Service | null>(null);
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const [details, setDetails] = useState<Details>({ name: "", phone: "", date: "", time: "" });
  const [requestId, setRequestId] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [motion, setMotion] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => { dialogRef.current?.scrollTo({ top: 0 }); }, [step, selected]);
  const openCheckout = useCallback((service: Service) => {
    const id = newRequestId();
    setSelected(service); setStep("details"); setReceipt(null); setError(""); setRequestId(id);
  }, []);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options: { signal: AbortSignal }) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: "start_service_checkout",
        title: "Escolher serviço da Beauty Adria Luíza",
        description: "Abre o checkout de um serviço. A cliente precisa preencher os dados e enviar a solicitação; esta ação não faz reserva nem cobrança.",
        inputSchema: { type: "object", properties: { serviceId: { type: "string", enum: services.map(s => s.id) } }, required: ["serviceId"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input: unknown) => {
          if (!input || typeof input !== "object" || !("serviceId" in input)) throw new Error("Informe um serviço válido.");
          const service = services.find(s => s.id === (input as { serviceId: unknown }).serviceId);
          if (!service) throw new Error("Serviço não encontrado.");
          openCheckout(service);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { serviceId: service.id, serviceName: service.name, totalCents: service.price, status: "checkout_aberto" };
        }
      }, { signal: controller.signal })).catch(() => {});
    } catch { /* Regular checkout remains available in unsupported browsers. */ }
    return () => controller.abort();
  }, [openCheckout]);
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const value = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | null)?.value || "";
    const current = { name: value("customer-name"), phone: value("customer-phone"), date: value("booking-date"), time: value("booking-time") };
    if (!/^(?:55)?\d{10,11}$/.test(current.phone.replace(/\D/g, ""))) { setError("Informe um WhatsApp com DDD, por exemplo (31) 99999-9999."); return; }
    if (current.name.trim().length < 2) { setError("Informe seu nome para continuar."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(current.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(current.time)) { setError("Escolha uma data e um horário válidos."); return; }
    setDetails(current);
    setError(""); setStep("review");
  }
  async function submit() {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("https://aria-luiza-studio.chcruz.chatgpt.site/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, serviceId: selected.id, ...details }) });
      const result = await response.json() as { booking?: Receipt; error?: string };
      if (!response.ok || !result.booking) throw new Error(result.error || "Não foi possível enviar sua solicitação. Tente novamente.");
      setReceipt(result.booking); setStep("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível enviar. Seus dados continuam preenchidos."); }
    finally { setBusy(false); }
  }
  function downloadReceipt() {
    if (!receipt) return;
    const text = `BEAUTY ADRIA LUÍZA · LASH DESIGNER\nSOLICITAÇÃO DE ATENDIMENTO\n\nCódigo: ${receipt.code}\nCliente: ${receipt.name}\nServiço: ${receipt.serviceName}\nValor: ${money(receipt.totalCents)}\nData desejada: ${displayDate(receipt.date)}\nHorário desejado: ${receipt.time}\nPagamento: no atendimento\n\nStatus: aguardando confirmação do horário.\nEsta solicitação não é uma reserva confirmada nem um comprovante de pagamento.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `beauty-adria-luiza-${receipt.code}.txt`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={`site ${motion ? "" : "motion-paused"}`}>
      <div className="botanical-background" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/flower.webp`} width="1024" height="1536" alt="" /></div>
      <a className="skip-link" href="#catalogo">Ir para os serviços</a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Beauty Adria Luíza, início"><span>Beauty Adria Luíza</span><small>LASH DESIGNER</small></a>
        <nav aria-label="Menu principal"><a href="#catalogo">Serviços</a><a className="nav-booking" href="#catalogo">Agendar atendimento</a></nav>
      </header>
      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">BELEZA · ELEGÂNCIA · AUTOESTIMA</p>
            <h1 id="hero-title"><span className="hero-brand-prefix">Beauty</span> Adria Luíza</h1>
            <h2>Seu olhar,<br /><em>sua essência.</em></h2>
            <p className="hero-description">Realce sua beleza com um atendimento delicado e um olhar pensado para você.</p>
            <a className="button primary hero-button" href="#catalogo">Ver catálogo <Sparkles size={17} strokeWidth={1.5} /></a>
            <div className="hero-note"><span /> Cílios &amp; sobrancelhas</div>
          </div>
          <div className="hero-visual" aria-label="Detalhe do procedimento de extensão de cílios">
            <div className="hero-orbit" aria-hidden="true" />
            <ServicePhoto service={services[3]} className="hero-photo" />
            <div className="hero-seal"><Heart size={19} strokeWidth={1.3} /><span>beleza em<br />cada detalhe</span></div>
            <p className="photo-caption">Um cuidado feito para você.</p>
          </div>
        </section>
        <div className="signature-line" aria-hidden="true"><span /><Sparkles size={20} strokeWidth={1} /><span /></div>
        <section className="catalog" id="catalogo" aria-labelledby="catalog-title">
          <div className="section-heading"><p className="eyebrow">ESCOLHA SEU CUIDADO</p><h2 id="catalog-title">Meus serviços</h2><p>Seu próximo momento de beleza começa aqui.</p></div>
          <div className="service-grid">
            {services.map((service, index) => <article className={`service-card card-${service.id}`} key={service.id}>
              <div className="service-visual"><ServicePhoto service={service} /><span className="service-category">{service.category}</span></div>
              <div className="service-body"><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p><div className="service-duration"><Clock3 size={14} strokeWidth={1.5} />{service.duration}</div><div className="service-bottom"><strong>{money(service.price)}</strong><button className="button primary" onClick={() => openCheckout(service)} aria-label={`Quero agendar ${service.name}`}>Quero agendar</button></div></div>
            </article>)}
          </div>
          <p className="catalog-footnote"><CalendarDays size={16} strokeWidth={1.5} /> Escolha o serviço e envie sua preferência de horário.</p>
        </section>
        <section className="care-note" aria-label="Informações sobre o atendimento"><Heart size={23} strokeWidth={1.2} /><div><h2>Um momento só seu.</h2><p>Escolha seu procedimento com calma. O horário será combinado com você após a solicitação.</p></div></section>
      </main>
      <footer className="site-footer"><a className="brand" href="#inicio"><span>Beauty Adria Luíza</span><small>LASH DESIGNER</small></a><p>Beleza que respeita a sua essência.</p><button className="motion-toggle" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? "Pausar" : "Ativar"} animação da flor</button></footer>
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open && !busy) setSelected(null); }}>
        <DialogContent ref={dialogRef} className="checkout-dialog" showCloseButton={false} onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }} onInteractOutside={(event) => { if (busy) event.preventDefault(); }}>
          <DialogClose className="checkout-close" disabled={busy} aria-label="Fechar checkout"><X size={20} /></DialogClose>
          <div className="checkout-brand">Beauty Adria Luíza</div>
          <DialogTitle className="checkout-title">{step === "success" ? "Solicitação recebida" : step === "review" ? "Confira seu atendimento" : "Seu momento de beleza"}</DialogTitle>
          <DialogDescription className="checkout-description">{step === "success" ? "Seu horário ainda será confirmado." : step === "review" ? "Revise os detalhes antes de enviar." : "Preencha seus dados e escolha o horário desejado."}</DialogDescription>
          <div className="checkout-steps" aria-label="Etapas do checkout"><span className="active">1. Seus dados</span><i /><span className={step !== "details" ? "active" : ""}>2. Resumo</span><i /><span className={step === "success" ? "active" : ""}>3. Pronto</span></div>
          {step === "details" && selected && <form onSubmit={review} className="checkout-form">
            <div className="selected-service"><ServicePhoto service={selected} /><div><span>SEU PROCEDIMENTO</span><strong>{selected.name}</strong><small>{selected.duration}</small></div><b>{money(selected.price)}</b></div>
            <label htmlFor="customer-name">Seu nome<input id="customer-name" autoComplete="name" placeholder="Como podemos chamar você?" value={details.name} onChange={e => setDetails(previous => ({ ...previous, name: e.target.value }))} required minLength={2} maxLength={80} /></label>
            <label htmlFor="customer-phone">WhatsApp com DDD<input id="customer-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(31) 99999-9999" value={details.phone} onChange={e => setDetails(previous => ({ ...previous, phone: e.target.value }))} required maxLength={22} /></label>
            <div className="field-row"><label htmlFor="booking-date">Data desejada<input id="booking-date" type="date" onInput={e => { const value = e.currentTarget.value; setDetails(previous => ({ ...previous, date: value })); }} value={details.date} min={localToday()} onChange={e => setDetails(previous => ({ ...previous, date: e.target.value }))} required /></label><label htmlFor="booking-time">Horário desejado<input id="booking-time" type="time" onInput={e => { const value = e.currentTarget.value; setDetails(previous => ({ ...previous, time: value })); }} value={details.time} onChange={e => setDetails(previous => ({ ...previous, time: e.target.value }))} required /></label></div>
            <p className="field-hint">O horário está sujeito à confirmação.</p>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button type="submit" className="button primary checkout-submit">Continuar para o resumo</button>
            <p className="privacy-note"><ShieldCheck size={14} /> Seus dados serão usados para combinar este atendimento.</p>
          </form>}
          {step === "review" && selected && <div className="checkout-review">
            <div className="order-service"><span>Procedimento</span><strong>{selected.name}</strong></div>
            <dl className="order-details"><div><dt>Cliente</dt><dd>{details.name}</dd></div><div><dt>WhatsApp</dt><dd>{details.phone}</dd></div><div><dt>Data desejada</dt><dd>{displayDate(details.date)}</dd></div><div><dt>Horário desejado</dt><dd>{details.time}</dd></div></dl>
            <div className="payment-note"><CreditCard size={21} strokeWidth={1.5} /><div><strong>Pagamento no atendimento</strong><p>Nenhuma cobrança será feita agora.</p></div></div>
            <div className="order-total"><span>Total do serviço</span><strong>{money(selected.price)}</strong></div>
            <p className="field-hint">Ao enviar, você solicita este horário. A reserva depende de confirmação.</p>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="button primary checkout-submit" disabled={busy} onClick={submit}>{busy ? "Enviando solicitação…" : "Enviar solicitação"}</button>
            <button className="button text-button" disabled={busy} onClick={() => { setStep("details"); setError(""); }}>Editar meus dados</button>
          </div>}
          {step === "success" && receipt && <div className="checkout-success" aria-live="polite"><div className="success-icon"><Check size={30} strokeWidth={1.5} /></div><p>Obrigada, <strong>{receipt.name.split(" ")[0]}</strong>!</p><p className="success-copy">Sua preferência de atendimento foi registrada. Aguarde a confirmação do horário antes de comparecer.</p><div className="receipt-card"><span>SOLICITAÇÃO {receipt.code}</span><h3>{receipt.serviceName}</h3><p>{displayDate(receipt.date)} · {receipt.time}</p><strong>{money(receipt.totalCents)}</strong><small>Pagamento no atendimento</small></div><button className="button outline checkout-submit" onClick={downloadReceipt}><Download size={16} /> Salvar resumo</button><DialogClose className="button primary checkout-submit">Voltar ao catálogo</DialogClose></div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
