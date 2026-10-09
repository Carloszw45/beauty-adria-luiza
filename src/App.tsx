"use client";

import { useState } from "react";
import { Clock3, Heart, MessageCircle, Sparkles } from "lucide-react";
import { services, type Service } from "@/lib/catalog";

const contactPhone = { label: "(31) 9314-7285", href: "https://wa.me/553193147285" };
function quoteHref(name: string) {
  return `${contactPhone.href}?text=${encodeURIComponent(`Olá! Gostaria de consultar o valor de ${name} na Sindy_Designer.`)}`;
}
function BrandName() {
  return <>Sindy<span className="brand-separator">_</span>Designer</>;
}

function ServicePhoto({ service, className = "" }: { service: Service; className?: string }) {
  if (service.photoTop === null) return <div className={`monogram ${className}`} aria-hidden="true"><span>SD</span><small>LASH DESIGNER</small></div>;
  return <div className={`photo-circle ${className}`}><img src={`${import.meta.env.BASE_URL}assets/service-reference.jpg`} alt={service.alt} width="691" height="1536" style={{ top: `${-(service.photoTop / 218) * 100}%` }} /></div>;
}
export default function Home() {
  const [motion, setMotion] = useState(true);
  return (
    <div className={`site ${motion ? "" : "motion-paused"}`}>
      <div className="botanical-background" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/flower.webp`} width="1024" height="1536" alt="" /></div>
      <a className="skip-link" href="#catalogo">Ir para o catálogo</a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Sindy_Designer, início"><span><BrandName /></span><small>LASH DESIGNER</small></a>
        <nav aria-label="Menu principal"><a href="#catalogo">Catálogo</a><a className="nav-booking" href={contactPhone.href} target="_blank" rel="noopener noreferrer">Consultar valores</a></nav>
      </header>
      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">BELEZA · ELEGÂNCIA · AUTOESTIMA</p>
            <h1 id="hero-title"><BrandName /></h1>
            <h2>Seu olhar,<br /><em>sua essência.</em></h2>
            <p className="hero-description">Realce sua beleza com um atendimento delicado e um olhar pensado para você.</p>
            <a className="button primary hero-button" href="#catalogo">Ver catálogo <Sparkles size={17} strokeWidth={1.5} /></a>
            <div className="hero-note"><span /> Cílios, sobrancelhas &amp; buquês</div>
            <a className="contact-link hero-contact" href={contactPhone.href} target="_blank" rel="noopener noreferrer" aria-label={`Conversar pelo WhatsApp com Sindy_Designer: ${contactPhone.label}`}><MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> WhatsApp: {contactPhone.label}</a>
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
          <div className="section-heading"><p className="eyebrow">ESCOLHA SEU CUIDADO</p><h2 id="catalog-title">Meu catálogo</h2><p>Cuidados de beleza e detalhes para presentear.</p></div>
          <div className="service-grid">
            {services.map((service, index) => <article className={`service-card card-${service.id}`} key={service.id}>
              <div className="service-visual"><ServicePhoto service={service} /><span className="service-category">{service.category}</span></div>
              <div className="service-body"><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p><div className="service-duration"><Clock3 size={14} strokeWidth={1.5} />{service.duration}</div><div className="service-bottom"><strong>Sob consulta</strong><a className="button primary" href={quoteHref(service.name)} target="_blank" rel="noopener noreferrer" aria-label={`Consultar o valor de ${service.name} pelo WhatsApp`}><MessageCircle size={15} aria-hidden="true" /> Consultar valor</a></div></div>
            </article>)}
            <article className="service-card card-buque-personalizado" aria-labelledby="bouquet-title">
              <div className="service-visual"><div className="bouquet-art"><img src={`${import.meta.env.BASE_URL}assets/bouque.svg`} alt="Ilustração de um buquê de flores" width="280" height="300" loading="lazy" /></div><span className="service-category">BUQUÊS</span></div>
              <div className="service-body"><span className="service-number">06</span><h3 id="bouquet-title">Buquê personalizado</h3><p>Um presente especial, com flores e detalhes escolhidos do seu jeito.</p><div className="service-duration"><MessageCircle size={14} strokeWidth={1.5} /> Personalização a combinar</div><div className="service-bottom"><strong>Sob consulta</strong><a className="button primary" href={quoteHref("Buquê personalizado")} target="_blank" rel="noopener noreferrer" aria-label="Consultar o valor do Buquê personalizado pelo WhatsApp"><MessageCircle size={15} aria-hidden="true" /> Consultar valor</a></div></div>
            </article>
          </div>
          <p className="catalog-footnote"><MessageCircle size={16} strokeWidth={1.5} /> Todos os valores são sob consulta. Fale pelo WhatsApp.</p>
        </section>
        <section className="care-note" aria-label="Informações sobre o atendimento"><Heart size={23} strokeWidth={1.2} /><div><h2>Um momento só seu.</h2><p>Consulte valores e disponibilidade pelo WhatsApp. Cada detalhe será combinado com você.</p></div></section>
      </main>
      <footer className="site-footer"><a className="brand" href="#inicio"><span><BrandName /></span><small>LASH DESIGNER</small></a><div className="footer-contact"><p>Beleza que respeita a sua essência.</p><a className="contact-link" href={contactPhone.href} target="_blank" rel="noopener noreferrer" aria-label={`Conversar pelo WhatsApp com Sindy_Designer: ${contactPhone.label}`}><MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" /> WhatsApp: {contactPhone.label}</a></div><button className="motion-toggle" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? "Pausar" : "Ativar"} animação da flor</button></footer>
    </div>
  );
}
