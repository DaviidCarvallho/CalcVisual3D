
# CalcVisual 3D - Visualizador Interativo de Funções Matemáticas

![CalcVisual 3D](https://img.shields.io/badge/CalcVisual%203D-v1.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg?logo=vite)

## 📝 Descrição

CalcVisual 3D é uma aplicação web interativa desenvolvida para visualização de funções matemáticas, cálculo de integrais definidas, área entre curvas e geração de sólidos de revolução. A aplicação foi desenvolvida como trabalho acadêmico para a disciplina de Cálculo II, oferecendo uma interface intuitiva para estudantes e professores explorarem conceitos matemáticos complexos de forma visual.

## ✨ Principais Funcionalidades

### 🔢 Visualização de Funções
- **Gráficos 2D interativos** com suporte a múltiplas funções matemáticas
- **Suporte a funções complexas**: polinomiais, trigonométricas, exponenciais, logarítmicas
- **Sintaxe flexível**: x^2, sin(x), cos(x), exp(x), log(x), sqrt(x), etc.
- **Zoom e navegação** nos gráficos para análise detalhada

### 📊 Cálculo de Integrais
- **Integral definida** com limites configuráveis pelo usuário
- **Visualização da área** sob a curva destacada em verde
- **Cálculo numérico aproximado** usando método de Riemann
- **Linhas de referência** mostrando os limites de integração

### 📐 Área Entre Curvas
- **Cálculo automático** da área entre duas funções
- **Detecção de interseções** entre as curvas
- **Visualização colorida** da região delimitada
- **Cálculo preciso** considerando as mudanças de sinal

### 🎭 Sólidos de Revolução 3D
- **Geração de sólidos** pela rotação de funções em torno do eixo X
- **Visualização 3D interativa** com controles de rotação e zoom
- **Superfícies diferenciadas**: externa (vermelha) e interna (azul)
- **Controles de visibilidade** para cada elemento do sólido
- **Renderização realística** com materiais e iluminação

### 🤖 Assistente Virtual (Calculinho)
- **Chatbot especializado** em matemática integrado
- **Respostas contextualizadas** sobre cálculo e funções
- **Explicações educativas** de conceitos matemáticos
- **Suporte em português** com linguagem clara e objetiva

## 🛠️ Tecnologias Utilizadas

### Frontend Framework
- **React 18.3.1** - Biblioteca principal para construção da interface
- **TypeScript** - Superset do JavaScript para tipagem estática
- **Vite** - Build tool moderna e rápida para desenvolvimento

### Visualização e Gráficos
- **Recharts 2.12.7** - Biblioteca para gráficos 2D responsivos
- **React Three Fiber 8.18.0** - Wrapper React para Three.js
- **Three.js 0.177.0** - Biblioteca para renderização 3D
- **@react-three/drei 9.122.0** - Utilitários para React Three Fiber

### Interface do Usuário
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Shadcn/UI** - Componentes de interface pré-construídos
- **Radix UI** - Primitivos acessíveis para componentes complexos
- **Lucide React 0.462.0** - Biblioteca de ícones SVG

### Processamento Matemático
- **Math.js 14.5.2** - Biblioteca para expressões e cálculos matemáticos
- **Parser personalizado** - Sistema próprio para interpretação de funções

### Inteligência Artificial
- **Google Generative AI 0.24.1** - Integração com Gemini para o chatbot
- **@tanstack/react-query 5.56.2** - Gerenciamento de estado e cache

### Utilitários e Ferramentas
- **React Router DOM 6.26.2** - Roteamento da aplicação
- **React Hook Form 7.53.0** - Gerenciamento de formulários
- **Class Variance Authority** - Utilitário para classes CSS condicionais
- **Date-fns 3.6.0** - Manipulação de datas
- **Zod 3.23.8** - Validação de schemas TypeScript

## 🚀 Como Executar a Aplicação

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** como gerenciador de pacotes
- **Git** para controle de versão

### Instalação
```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Navegue até o diretório do projeto
cd calcvisual-3d

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Configure as variáveis de ambiente (se necessário)
# Crie um arquivo .env.local com sua chave da API do Google Gemini
VITE_GOOGLE_AI_API_KEY=sua_chave_aqui

# 5. Execute a aplicação em modo de desenvolvimento
npm run dev
# ou
yarn dev

# 6. Acesse a aplicação
# A aplicação estará disponível em http://localhost:5173
```

### Build para Produção
```bash
# Gerar build otimizado
npm run build
# ou
yarn build

# Preview do build de produção
npm run preview
# ou
yarn preview
```

## 📖 Como Usar a Aplicação

### 1. Entrada de Funções
- Digite sua função no campo "Função f(x)" usando a sintaxe matemática padrão
- Para área entre curvas, adicione uma segunda função em "Segunda função g(x)"
- Ajuste o domínio definindo os valores de x mínimo e máximo
- Configure os limites de integração nos campos específicos

### 2. Exemplos de Funções Suportadas
```
Polinomiais: x^2, x^3, 2*x + 1
Trigonométricas: sin(x), cos(x), tan(x)
Exponenciais: exp(x), 2^x
Logarítmicas: log(x), ln(x)
Raízes: sqrt(x), x^(1/3)
Combinadas: x^2 + sin(x), exp(-x^2)
```

### 3. Visualização 2D
- O gráfico mostra as funções plotadas no domínio especificado
- A área da integral definida aparece destacada em verde
- Linhas tracejadas indicam os limites de integração
- Para duas funções, a área entre elas é destacada

### 4. Sólidos de Revolução 3D
- Clique em "Gerar Sólido de Revolução" para criar a visualização 3D
- Use os controles de mouse para rotacionar e fazer zoom
- Ative/desative elementos usando os switches de controle
- A superfície externa (vermelha) e interna (azul) podem ser controladas independentemente

### 5. Assistente Virtual
- Use o chat para tirar dúvidas sobre matemática
- Pergunte sobre conceitos de cálculo e funções
- O Calculinho responde em português com explicações educativas

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios
```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/              # Componentes de interface (Shadcn/UI)
│   ├── Chart2D.tsx      # Componente do gráfico 2D
│   ├── Revolution3D.tsx # Componente do sólido 3D
│   ├── FunctionInput.tsx# Entrada de funções
│   ├── ChatBot.tsx      # Chatbot integrado
│   └── Header.tsx       # Cabeçalho da aplicação
├── pages/               # Páginas principais
│   └── Index.tsx        # Página principal
├── services/            # Serviços externos
│   └── geminiService.ts # Integração com Google AI
├── utils/               # Utilitários e helpers
│   ├── mathParser.ts    # Parser de expressões matemáticas
│   ├── areaCalculations.ts # Cálculos de área
│   └── intersectionCalculator.ts # Cálculo de interseções
└── lib/                 # Configurações e bibliotecas
    └── utils.ts         # Utilitários gerais
```

### Componentes Principais

#### Chart2D
- Renderiza gráficos 2D usando Recharts
- Calcula e exibe integrais definidas
- Mostra área entre curvas
- Sistema de tooltip interativo

#### Revolution3D
- Gera geometrias 3D usando Three.js
- Implementa algoritmo de revolução
- Controla materiais e iluminação
- Gerencia interatividade 3D

#### FunctionInput
- Interface para entrada de funções
- Validação de sintaxe matemática
- Exemplos pré-definidos
- Controles de domínio e limites

## 🧮 Algoritmos Matemáticos

### Parser de Expressões
O sistema utiliza uma combinação de Math.js e parsing personalizado para interpretar expressões matemáticas complexas, convertendo notação matemática comum em código JavaScript executável.

### Cálculo de Integrais
Implementa o método de Riemann com subdivisões adaptativas para aproximação numérica de integrais definidas, ajustando a precisão baseada na complexidade da função.

### Detecção de Interseções
Algoritmo de busca binária refinada para encontrar pontos de interseção entre duas funções, essencial para o cálculo correto de áreas entre curvas.

### Geração de Sólidos 3D
Algoritmo de revolução que gera malhas triangulares representando superfícies de revolução, com otimizações para performance e qualidade visual.

## 🎨 Design e UX

### Sistema de Cores
- **Azul**: Função principal e elementos de interface
- **Vermelho**: Segunda função e superfície externa
- **Verde**: Áreas de integração e cálculos
- **Roxo**: Interseções e pontos especiais

### Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Componentes redimensionáveis
- Interface otimizada para diferentes tamanhos de tela

### Acessibilidade
- Componentes Radix UI com suporte a leitores de tela
- Contraste adequado entre cores
- Navegação por teclado suportada

## 🚧 Desenvolvimento e Contribuição

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting do código
npm run type-check   # Verificação de tipos TypeScript
```

### Padrões de Código
- **ESLint** para linting e formatação
- **TypeScript** para tipagem estática
- **Prettier** para formatação consistente
- **Componentes funcionais** com hooks React

## 📚 Conceitos Matemáticos Cobertos

### Cálculo Diferencial e Integral
- Visualização de funções contínuas
- Cálculo de integrais definidas
- Áreas entre curvas
- Conceitos de limite e continuidade

### Geometria Analítica
- Sistemas de coordenadas cartesianas
- Interseções de curvas
- Transformações geométricas

### Geometria Espacial
- Sólidos de revolução
- Volumes por integração
- Visualização 3D de objetos matemáticos

## 🎓 Aplicações Educacionais

### Para Estudantes
- Visualização intuitiva de conceitos abstratos
- Experimentação com diferentes funções
- Verificação de cálculos manuais
- Compreensão espacial de sólidos de revolução

### Para Professores
- Ferramenta de demonstração em sala de aula
- Geração rápida de exemplos visuais
- Suporte para explicação de conceitos complexos
- Recurso interativo para engajamento

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```env
# .env.local
VITE_GOOGLE_AI_API_KEY=sua_chave_da_api_gemini
```

### Configuração do TypeScript
O projeto usa configuração TypeScript estrita com verificação de tipos em tempo de build e desenvolvimento.

### Configuração do Tailwind
Classes utilitárias personalizadas e tema consistente definido em `tailwind.config.ts`.

## 📄 Licença e Créditos

### Autores
- **Murilo Leal** - Desenvolvimento e implementação
- **David Carvalho** - Desenvolvimento e implementação

### Finalidade Acadêmica
Este projeto foi desenvolvido como trabalho de avaliação para a disciplina de Cálculo II, sob orientação da Professora Janaina.

### Tecnologias de Terceiros
Agradecimentos às comunidades open-source das bibliotecas utilizadas, especialmente React, Three.js, Recharts e Tailwind CSS.

---

## 🚀 Deploy e Produção

A aplicação pode ser facilmente deployada em plataformas como:
- **Vercel** (recomendado para projetos Vite/React)
- **Netlify**
- **GitHub Pages**
- **Heroku**

Para deploy personalizado, execute `npm run build` e sirva os arquivos da pasta `dist/`.

---

**CalcVisual 3D** - Transformando matemática em experiência visual! 📊✨
