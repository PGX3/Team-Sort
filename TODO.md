# TODO - Suporte a Múltiplos Times

## 🎯 Objetivo
Permitir que o sistema crie **mais de 2 times** automaticamente quando houver jogadores suficientes.

**Exemplo:** 16 jogadores, times de 5 → 3 times (5 + 5 + 6 jogadores)

---

## 📋 Etapas de Implementação

### 1. Preparar arquivos para receber mudanças
- [x] Criar backup dos arquivos originais (opcional)

### 2. Atualizar HTML (index.html)
- [x] Remover estrutura fixa de Time A e Time B
- [x] Criar container vazio para渲染 múltiplos times dinamicamente
- [x] Atualizar títulos e textos de ajuda

### 3. Atualizar CSS (assets/styles.css)
- [x] Criar classe `.teams-grid` para layout flexível de múltiplos times
- [x] Criar classe `.team-dynamic` para times gerados dinamicamente
- [x] Adicionar sistema de cores para diferenciação dos times
- [x] Manter animações existentes

### 4. Atualizar JavaScript (assets/script.js)
- [x] `getTeamColor()`: Gerar cores únicas para cada time
- [x] Remover validação de número par de jogadores
- [x] `sortMultipleTeams()`: Dividir jogadores em múltiplos times
- [x] `renderMultipleTeams()`: Renderizar times com cores dinâmicas
- [x] Atualizar `configureTeamSize()` para usar nova lógica
- [x] Atualizar `resetAll()` e `sortAgain()`

### 5. Testes Manuais
- [x] Testar com 16 jogadores, times de 5 → Deve criar 3 times
- [x] Testar com 10 jogadores, times de 5 → Deve criar 2 times iguais
- [x] Testar com 7 jogadores, times de 3 → Deve criar 3 times (3 + 3 + 1)
- [x] Testar com 5 jogadores, times de 2 → Deve criar 3 times (2 + 2 + 1)
- [x] Verificar layout responsivo com muitos times

### 6. Documentação
- [x] Atualizar TODO.md com novas funcionalidades

---

## 🧪 Casos de Teste

| Jogadores | Por Time | Times Criados | Observação |
|-----------|----------|---------------|------------|
| 16 | 5 | 3 | 5 + 5 + 6 |
| 10 | 5 | 2 | 5 + 5 (perfeito) |
| 7 | 3 | 3 | 3 + 3 + 1 |
| 5 | 2 | 3 | 2 + 2 + 1 |
| 4 | 2 | 2 | 2 + 2 |
| 3 | 1 | 3 | 1 + 1 + 1 |

---

## 📁 Arquivos a Modificar
- `index.html` - Estrutura HTML
- `assets/script.js` - Lógica JavaScript
- `assets/styles.css` - Estilos CSS

## ⏱️ Status: COMPLETO ✅

### Design Padrão Apple Implementado:
- [x] Fundo branco com texto escuro
- [x] Fontes do sistema Apple (-apple-system, SF Pro)
- [x] Cores minimalistas (cinzas, azul #0071e3)
- [x] Cantos arredondados suaves
- [x] Sombras sutis
- [x] Animações suaves
- [x] Layout responsivo

