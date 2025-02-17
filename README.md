### Unidos Contra a Fome

Sistema web para gerenciamento e conexão de abrigos que auxiliam pessoas em situação de vulnerabilidade social.

### Sobre o Projeto

O Unidos Contra a Fome é uma plataforma que conecta abrigos, voluntários e pessoas que necessitam de auxílio. 
O sistema facilita o cadastro e gerenciamento de abrigos, permitindo que pessoas em situação de vulnerabilidade 
encontrem locais de acolhimento próximos a sua localização.

### Design do projeto
- Home https://csr-voluntarios.vercel.app/
- Entrar https://csr-voluntarios.vercel.app/entrar
- Cadastrar https://csr-voluntarios.vercel.app/cadastrar
- Perfil https://csr-voluntarios.vercel.app/perfil
- Abrigo https://csr-voluntarios.vercel.app/abrigo

### Tecnologias Utilizadas

- **Frontend:**
  - Next.js 15.1.6 (App Router)
  - React 19.0.0
  - Tailwind CSS 3.4.1
  - Lucide React 0.474.0 (ícones)

- **Backend:**
  - Node.js
  - API RESTful
  - Banco de dados (Supabse)

### Estrutura do Projeto Atual
```
📁 voluntarios-web/
├── 📁 src/
│   └── 📁 app/
│       ├── 📁 abrigo/
│       │   └── page.js
│       ├── 📁 cadastrar/
│       │   └── page.js
│       ├── 📁 entrar/
│       │   └── page.js
│       ├── 📁 perfil/
│       │   └── page.js
│       ├── 📁 components/
│       │   ├── Footer.js
│       │   ├── Header.js
│       │   ├── ImageGallery.js
│       │   ├── Sidebar.js
│       │   └── TestimonialCard.js
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── 📁 public/
├── 📁 node_modules/
├── package.json
├── package-lock.json
├── next.config.mjs
├── jsconfig.json
├── eslint.config.mjs
└── .gitignore


```
###  Funcionalidades Implementadas

- [x] Desenvolvida páginas Home, Entrar, Cadastrar, Perfil e Abrigo
- [x] Navegação bi-direcional entra as páginas Entrar e Cadastrar
- [x] Layout responsivo
- [x] Header dinâmico com controle de visibilidade
- [x] Sidebar para navegação
- [x] Formulário de cadastro de abrigos
- [ ] Desenvolver página Dashboard
- [ ] Desenvolver página Recuperação de Senha
- [ ] Validação de formulários
- [ ] Upload de imagens
- [ ] Integração com API
- [ ] Autenticação de usuários

### Design System

#### Cores
- Principal: Emerald 700 (`bg-emerald-700`)
- Secundária: Gray 800 (`bg-gray-800`)
- Backgrounds: Gray 50 (`bg-gray-50`)
- Texto: White (`text-white`)

#### Componentes Base
- **Header:** Altura fixa de 64px (`h-16`)
- **Botões:** Padding horizontal 16px, vertical 8px (`px-4 py-2`)
- **Containers:** Máximo de 1280px com padding horizontal (`container mx-auto px-4`)

### Como Executar o Projeto

1. Clone o repositório
```bash
git clone git@github.com:cesarssa/voluntarios-web.git
```

2. Instale as dependências
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento
```bash
npm run dev
```

4. Acesse `http://localhost:3000`

### Próximos Passos

1. Desenvolver dashboard
2. Implementar autenticação de usuários
3. Implementar validação de formulários
4. Desenvolver sistema de recuperação de senha ("Esqueceu sua senha?")
   - Criar página de solicitação de redefinição
   - Implementar envio de email com token
   - Desenvolver página de redefinição de senha
   - Integrar com sistema de autenticação
5. Desenvolver sistema de upload de imagens
6. Criar integração com API



### Estrutura do Projeto Proposta Final
```
📁 voluntarios-web/
├── 📁 app/
│   ├── 📁 (auth)/              # Grupo de rotas autenticadas
│   │   ├── 📁 dashboard/
│   │   │   └── page.js
│   │   ├── 📁 abrigo/         
│   │   │   └── page.js
│   │   ├── 📁 perfil/
│   │   │   └── page.js
│   │   └── layout.js
│   ├── 📁 (public)/            # Grupo de rotas públicas
│   │   ├── 📁 entrar/
│   │   │   └── page.js
│   │   ├── 📁 cadastrar/      
│   │   │   └── page.js
│   │   └── layout.js
│   │   └── page.js
│   ├── 📁 api/                 # Rotas de API
│   │   ├── 📁 auth/
│   │   │   ├── login.js
│   │   │   └── recover.js
│   │   └── 📁 abrigos/
│   │       └── route.js
│   ├── 📁 components/          # Componentes React
│   │   ├── 📁 auth/
│   │   │   ├── LoginForm.js
│   │   │   └── RecoverForm.js
│   │   ├── 📁 common/
│   │   │   ├── Button.js
│   │   │   └── Input.js
│   │   ├── 📁 layout/
│   │   │   ├── Header.js
│   │   │   ├── Footerr.js
│   │   │   └── Sidebar.js
│   │   └── 📁 forms/
│   │       └── AbrigoForm.js
│   ├── 📁 hooks/              # Custom Hooks
│   │   ├── useAuth.js
│   │   └── useForm.js
│   ├── 📁 lib/               # Utilitários e configurações
│   │   ├── 📁 config/
│   │   │   └── constants.js
│   │   └── 📁 utils/
│   │       ├── api.js
│   │       └── validation.js
│   ├── 📁 styles/            # Estilos globais
│   │   └── globals.css
│   ├── layout.js             # Layout raiz
│   └── page.js               # Página inicial
├── 📁 public/                # Arquivos estáticos
│   ├── 📁 images/
│   └── 📁 icons/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
````
![Última Atualização](https://img.shields.io/github/last-commit/cesarssa/voluntarios-web?label=última%20atualização&color=5F9EA0&style=flat-square&date_format=%Y-%m-%d%20%H:%M:%S)
