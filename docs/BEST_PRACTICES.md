# 📋 Best Practices - Sorteador de Times

## 🎯 Padrões de Arquitetura

### 1. Separação de Camadas
```
src/
├── services/        # Camada de domínio (business logic)
│   ├── PlayerService.js
│   └── TeamService.js
├── controllers/     # Camada de apresentação (UI logic)
│   └── AppController.js
├── models/          # Entidades e tipos (futuro)
├── utils/           # Funções utilitárias (futuro)
└── assets/          # Static assets (CSS, images)
```

### 2. Padrão Service-Controller
- **Services**: Regras de negócio, validação, manipulação de dados
- **Controllers**: Orquestração de fluxo, eventos DOM, estado

### 3. Módulos IIFE/Revelação
```javascript
// Padrão para JavaScript puro
const ModuleName = (function() {
    'use strict';
    
    // Variáveis privadas
    let privateVar = '';
    
    // Funções públicas
    function publicMethod() {}
    
    return { publicMethod };
})();
```

---

## 📝 Documentação de Código

### JSDoc Obrigatório para:
```javascript
/**
 * @fileoverview Descrição do arquivo (o que faz)
 * @version 1.0.0
 * @author Nome
 * @since 2024-01
 */

/**
 * Descrição da função
 * @param {Type} paramName - Descrição
 * @returns {Type} Descrição do retorno
 * @throws {Error} Quando lança exceção
 * @example
 * // Exemplo de uso
 */
```

---

## 🔒 Segurança

### Never Trust User Input
```javascript
// ❌ Ruim
const userInput = document.getElementById('input').value;
eval(userInput); // NUNCA!

// ✅ Bom
const sanitized = DOMPurify.sanitize(userInput);
// ou
const cleaned = escapeHtml(userInput);
```

### XSS Prevention
```javascript
// ✅ Sempre escape conteúdo dinâmico
element.textContent = userInput; // Safe
element.innerText = userInput;   // Safe

// ❌ Nunca use innerHTML com dados do usuário
element.innerHTML = userInput;   // Dangerous!
```

---

## ⚡ Performance

### DOM Manipulation
```javascript
// ❌ Ruim - múltiplas reflows
for (let i = 0; i < 100; i++) {
    container.appendChild(createElement());
}

// ✅ Bom - DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    fragment.appendChild(createElement());
}
container.appendChild(fragment);

// ✅ Bom - innerHTML único
container.innerHTML = items.map(item => `<div>${item}</div>`).join('');
```

### Event Delegation
```javascript
// ❌ Ruim - um listener por item
items.forEach((item, i) => {
    item.addEventListener('click', handleClick);
});

// ✅ Bom - delegate no container
container.addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handleClick(e.target);
    }
});
```

---

## 🧪 Testabilidade

### Functions Pure
```javascript
// ✅ Função pura - fácil de testar
function add(a, b) {
    return a + b;
}

// ❌ Função impura - difícil de testar
function getRandom() {
    return Math.random(); // Depende de estado externo
}
```

### Dependency Injection
```javascript
// ✅ Injeta dependências
class UserService {
    constructor(userRepository, logger) {
        this.repository = userRepository;
        this.logger = logger;
    }
}
```

---

## 🎨 Estilo de Código

### Constantes como Enum
```javascript
// ✅ Enum para estados
const AppState = Object.freeze({
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
});

// ✅ Constantes no topo do arquivo
const CONFIG = {
    MAX_ITEMS: 100,
    TIMEOUT: 5000,
    API_URL: 'https://api.example.com'
};
```

### Early Return Pattern
```javascript
// ✅ Early returns para validação
function processUser(user) {
    if (!user) {
        throw new Error('User required');
    }
    
    if (!user.email) {
        throw new Error('Email required');
    }
    
    // Lógica principal...
    return process(user);
}
```

---

## 📦 Git Workflow

### Commits Semânticos
```
feat: adiciona funcionalidade de exportação
fix: corrige bug no sortimento de times
docs: atualiza documentação de API
refactor: reorganiza estrutura de arquivos
style: ajusta formatação CSS
test: adiciona testes unitários
```

### Branch Strategy
```
main (produção)
  ├── develop (integração)
  │   ├── feature/sorteio-multiplo
  │   ├── feature/export-csv
  │   └── bugfix/validation-error
  └── hotfix/critical-bug
```

---

## 🚀 Checklist de Pull Request

- [ ] Código formatação OK (Prettier)
- [ ] Sem console.log em produção
- [ ] Documentação atualizada
- [ ] Testes passando
- [ ] Performance considerada
- [ ] Segurança revisada
- [ ] Nome de branches semânticos

---

## 📚 Recursos Adicionais

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [MDN Web Docs](https://developer.mozilla.org/pt-BR/)

