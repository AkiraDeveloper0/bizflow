export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";
export type EmpresaStatus = "ativa" | "inativa" | "em_formacao";
export type ViewMode = "kanban" | "list" | "timeline" | "board";

export type Area =
  | "Financeiro"
  | "Operacional"
  | "Marketing"
  | "Produtos"
  | "Administrativo"
  | "Desenvolvimento"
  | "Estratégia"
  | "Documentação";

export interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
  initials: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: Area;
  comments: number;
  attachments: number;
  daysLeft: number;
  progress: number;
  progressTotal: number;
  members: Member[];
  createdAt: string;
  dueDate: string;
  tags: string[];
}

export interface Project {
  id: string;
  empresaId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  deadline: string;
  members: Member[];
  tags: string[];
  taskCount: number;
  color: string;
  icon: string;
}

export interface Empresa {
  id: string;
  name: string;
  description: string;
  segment: string;
  status: EmpresaStatus;
  color: string;
  responsible: Member;
  projectCount: number;
  logo: string;
  initials: string;
}

export interface NavPage {
  id: string;
  label: string;
  href: string;
  icon: string;
}

// ─── Empresa Detail Types ─────────────────────────────────────────────────

export interface Nota {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color: string;
}

export interface EmpresaLogin {
  id: string;
  service: string;
  username: string;
  password: string;
  url: string;
}

export type IdeiaStatus = "nova" | "em_avaliacao" | "aprovada" | "descartada";

export interface Ideia {
  id: string;
  title: string;
  description: string;
  votes: number;
  createdAt: string;
  status: IdeiaStatus;
}

export interface FaturamentoEntry {
  id: string;
  month: string; // "YYYY-MM"
  receita: number;
  despesas: number;
  descricao: string;
}

// ─── Clientes / CRM Types ────────────────────────────────────────────────────

export type ClienteStatus =
  | "lead"
  | "contato_feito"
  | "proposta_enviada"
  | "negociacao"
  | "ativo"
  | "perdido";

export type ClienteTipo = "lead" | "prospect" | "cliente" | "parceiro";

export type InteracaoTipo = "ligacao" | "reuniao" | "email" | "mensagem";

export interface Interacao {
  id: string;
  tipo: InteracaoTipo;
  data: string; // "YYYY-MM-DD"
  anotacao: string;
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: ClienteTipo;
  responsavel: string;
  telefone: string;
  email: string;
  website: string;
  valorPotencial: number;
  status: ClienteStatus;
  observacoes: string;
  ultimoContato: string; // "YYYY-MM-DD"
  interacoes: Interacao[];
}

export interface EmpresaExtra {
  website: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  notas: Nota[];
  logins: EmpresaLogin[];
  ideias: Ideia[];
  faturamento: FaturamentoEntry[];
  clientes: Cliente[];
}

// ─── Calendário Event Types ───────────────────────────────────────────────────

export interface CalendarioEvent {
  id: string;
  title: string;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:MM"
  description: string;
  color: string;
  reminderMinutes: number; // notify X minutes before (0 = no reminder before)
}
