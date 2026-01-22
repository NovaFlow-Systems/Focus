# Tecnologias e Ferramentas

## Stack Principal

### Frontend Framework

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript para maior segurança e produtividade

### Estilização

- **Tailwind CSS v4** - Framework CSS utility-first para estilização rápida e responsiva
- Design system com tokens CSS customizados em `/styles/globals.css`
- Tema escuro/claro com suporte a `dark:` classes do Tailwind

### Gerenciamento de Estado

- **React Hooks** - useState, useEffect, useRef para estado local
- **localStorage** - Persistência de dados no navegador (habits, todos, notes, layout, configurações)

### Drag & Drop

- **react-dnd** - Biblioteca para funcionalidade de arrastar e soltar
- **react-dnd-html5-backend** - Backend HTML5 para react-dnd

### Ícones

- **lucide-react** - Biblioteca de ícones minimalistas

### Audio

- **Web Audio API** - API nativa do navegador para geração de sons (notificações do Pomodoro)

## Arquitetura de Componentes

### Estrutura de Pastas

```
/
├── App.tsx                         # Componente principal, gerenciamento global
├── components/
│   ├── Calendar.tsx                # Calendário mensal com visualização de hábitos
│   ├── HabitTracker.tsx            # Lista de hábitos
│   ├── HabitCard.tsx               # Card individual de hábito
│   ├── TodoList.tsx                # Lista de tarefas
│   ├── PomodoroTimer.tsx           # Timer Pomodoro configurável
│   ├── Sidebar.tsx                 # Sidebar direita (deprecated após refatoração)
│   ├── DraggableSection.tsx        # Wrapper para seções arrastáveis
│   ├── LayoutControl.tsx           # Menu de controle de layout
│   └── sections/
│       ├── AddHabitSection.tsx     # Formulário de adicionar hábito
│       ├── TodoSection.tsx         # Seção de tarefas
│       └── NotesSection.tsx        # Seção de anotações por dia
└── styles/
    └── globals.css                  # Estilos globais e tokens CSS
```

## Funcionalidades Principais

### 1. Habit Tracker

- Criação, exclusão e visualização de hábitos
- Cada hábito tem cor própria e datas de conclusão
- Barra de progresso semanal
- Persistência em localStorage

### 2. Calendário

- Visualização mensal
- Indicadores visuais de hábitos completados por dia
- Seleção de dias para marcar/desmarcar hábitos
- Lista de hábitos do dia (colapsável)
- Barra de progresso diário

### 3. Sistema de Tarefas (To-Do)

- Adicionar, completar e deletar tarefas
- Checkbox para marcar como concluída
- Persistência em localStorage

### 4. Anotações por Dia

- Área de texto vinculada ao dia selecionado no calendário
- Cada dia tem sua própria anotação independente
- Salvo automaticamente no localStorage

### 5. Timer Pomodoro

- Três modos: Foco, Pausa Curta, Pausa Longa
- Configurável:
  - Duração de cada modo (minutos)
  - Número de ciclos antes da pausa longa
  - Auto-iniciar pausas e focos
- Sistema de ciclos automático
- Troca automática entre modos
- Notificações sonoras diferentes para foco e pausa
- Indicador visual de progresso circular
- Cores diferentes por modo (azul/verde/roxo)
- Persistência de configurações em localStorage

### 6. Layout Personalizável (Drag & Drop)

- Sistema de 3 colunas (esquerda, centro, direita)
- 6 seções arrastáveis:
  - Hábitos
  - Calendário
  - Novo Hábito
  - Tarefas do Dia
  - Anotações
  - Pomodoro
- Controles por seção:
  - Arrastar entre colunas e reordenar
  - Esconder/mostrar
  - Bloquear/desbloquear (previne movimento acidental)
- Menu global de controle de layout
- Botão de resetar layout ao padrão
- Persistência total do layout em localStorage

## Persistência de Dados

Todos os dados são salvos automaticamente no localStorage do navegador:

- `darkMode` - Preferência de tema (claro/escuro)
- `habits` - Array de hábitos com datas completadas
- `todos` - Array de tarefas
- `dailyNotes` - Objeto com anotações por data (formato: { 'YYYY-MM-DD': 'conteúdo' })
- `pomodoroSettings` - Configurações do timer Pomodoro
- `layout` - Configuração de layout (posição, visibilidade, bloqueio de seções)

## Formato de Dados

### Habit

```typescript
{
  id: string;
  name: string;
  completedDates: string[]; // formato: 'YYYY-MM-DD'
  color: string; // hex color
}
```

### Todo

```typescript
{
  id: string;
  text: string;
  completed: boolean;
}
```

### DailyNotes

```typescript
{
  [date: string]: string; // 'YYYY-MM-DD': 'conteúdo da anotação'
}
```

### SectionConfig (Layout)

```typescript
{
  id: string;
  title: string;
  columnId: "left" | "center" | "right";
  isVisible: boolean;
  isLocked: boolean;
  order: number;
}
```

### PomodoroSettings

```typescript
{
  pomodoro: number; // minutos
  shortBreak: number; // minutos
  longBreak: number; // minutos
  cyclesBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}
```

## Design System

### Cores Padrão dos Hábitos

- Verde: `#10b981`
- Azul: `#3b82f6`
- Roxo: `#8b5cf6`
- Laranja: `#f59e0b`
- Vermelho: `#ef4444`
- Rosa: `#ec4899`

### Tema

- Modo escuro por padrão
- Suporte completo a dark mode com Tailwind CSS
- Baixo contraste para evitar fadiga visual
- Tipografia padrão do sistema (Inter, SF Pro)

## Performance

- Componentes funcionais com React Hooks
- Re-renderizações otimizadas com estado local
- Persistência assíncrona em localStorage
- Sem dependências pesadas de UI (biblioteca de componentes)

## Compatibilidade

- Navegadores modernos com suporte a:
- ES6+
- localStorage
- Web Audio API
- HTML5 Drag and Drop API
  - Desktop-first, mas responsivo
  - Não requer backend ou servidor

## Desenvolvimento

### Ambiente

- Hot reload automático
- TypeScript com type checking

### Padrões de Código

- Componentes funcionais
- TypeScript strict mode
- Tailwind CSS para toda estilização
- Sem CSS modules ou styled-components
- Estrutura de pastas modular

## Limitações Conhecidas

- Dados armazenados apenas localmente (sem sincronização em nuvem)
- Sem autenticação ou multi-usuário
- Limite de armazenamento do localStorage (~5-10MB dependendo do navegador)
- Sons gerados sinteticamente (Web Audio API) sem arquivos de áudio externos