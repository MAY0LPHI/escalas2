# Escalas 2.0 - Sistema de Gerenciamento de Escalas

Sistema completo de gerenciamento de escalas operacionais com cálculo automático e exportação para WhatsApp.

## 🚀 Funcionalidades

### ✨ Design e Layout
- **Paleta de Cores**: Tema "Deep Emerald & Slate" profissional
- **Tipografia**: Inter (Google Fonts) com hierarquia clara
- **Responsividade**: 
  - Desktop: Sidebar persistente
  - Mobile: Bottom Navigation otimizada (estilo App nativo)
- **Animações**: Transições suaves de entrada/saída

### 📊 Gerenciamento de Escalas
- **Cálculo Automático**: Suporte para ciclos 12x36, 6x1 e 5x1
- **Inteligência de Folguistas**: Alocação automática de substitutos
- **Sistema Auto-Montado**: Baseado em data de início e tipo de escala
- **Visualização Clara**: Separação por cargo e status

### 👥 Gerenciamento de Funcionários
- Cadastro completo de funcionários
- Definição de cargos e tipos de escala
- Marcação de folguistas (substitutos)
- Edição e exclusão de funcionários

### 📱 Exportação WhatsApp
- Geração automática de mensagem formatada
- Emojis específicos para identificação rápida:
  - 🚨 Plantão ativo
  - 🔄 Cobertura de folguista
  - 💤 Funcionários de folga
- Compartilhamento direto ou cópia de mensagem

### 💾 Persistência de Dados
- **LocalStorage**: Salvamento automático local
- **Backup JSON**: Exportação completa dos dados
- **Importação**: Restauração de backups

## 🛠️ Tecnologias

- **React 19** - Framework UI
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Estilização
- **Lucide React** - Ícones modernos
- **LocalStorage** - Persistência local

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Como Usar

1. **Adicionar Funcionários**
   - Navegue até "Funcionários"
   - Clique em "Adicionar Funcionário"
   - Preencha: nome, cargo, tipo de escala, data de início
   - Marque "Folguista" se for substituto

2. **Visualizar Escala**
   - Navegue até "Escala"
   - Use os botões para navegar entre datas
   - A escala é calculada automaticamente

3. **Exportar para WhatsApp**
   - Navegue até "WhatsApp"
   - Visualize a mensagem formatada
   - Clique em "Abrir no WhatsApp" ou "Copiar Mensagem"

4. **Backup/Restauração**
   - Use "Exportar JSON" para criar backup
   - Use "Importar JSON" para restaurar dados

## 📱 Tipos de Escala

- **12x36**: Trabalha 1 dia, folga 1 dia
- **6x1**: Trabalha 6 dias, folga 1 dia
- **5x1**: Trabalha 5 dias, folga 1 dia

## 🎨 Estrutura do Projeto

```
escalas2/
├── src/
│   ├── components/
│   │   ├── EmployeeManagement.jsx
│   │   ├── ScheduleView.jsx
│   │   └── WhatsAppExport.jsx
│   ├── utils/
│   │   ├── scheduleCalculator.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
└── package.json
```

## 🔐 Segurança

- Dados armazenados localmente no navegador
- Sem envio para servidores externos
- Backup manual controlado pelo usuário

## 📄 Licença

Este projeto está sob licença MIT.
