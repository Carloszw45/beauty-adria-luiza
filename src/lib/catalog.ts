export type Service = { id: string; name: string; category: string; description: string; duration: string; photoTop: number | null; alt: string };
export const services: Service[] = [
  { id: "remocao", name: "Remoção", category: "CUIDADO", description: "Procedimento rápido e delicado.", duration: "Remoção de extensão", photoTop: null, alt: "" },
  { id: "henna", name: "Design com Henna", category: "SOBRANCELHAS", description: "Definição e destaque para o seu olhar.", duration: "30 a 40 minutos", photoTop: 236, alt: "Sobrancelha com design e aplicação de henna" },
  { id: "natural", name: "Design Natural", category: "SOBRANCELHAS", description: "Leveza que valoriza sua beleza natural.", duration: "20 a 30 minutos", photoTop: 576, alt: "Detalhe de sobrancelha com design natural" },
  { id: "brasileiro", name: "Brasileiro", category: "EXTENSÃO DE CÍLIOS", description: "Um olhar marcante, com volume e leveza.", duration: "2h a 2h30", photoTop: 888, alt: "Detalhe dos cílios com volume brasileiro" },
  { id: "hollywood", name: "Hollywood", category: "EXTENSÃO DE CÍLIOS", description: "Mais volume para um olhar cheio de presença.", duration: "2h a 2h30", photoTop: 1212, alt: "Detalhe dos cílios com volume Hollywood" }
];

