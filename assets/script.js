// Elementos do DOM
gitconst pasteSection = document.getElementById('paste-section');
const verifySection = document.getElementById('verify-section');
const configSection = document.getElementById('config-section');
const resultSection = document.getElementById('result-section');

const namesTextarea = document.getElementById('names-textarea');
const btnProcess = document.getElementById('btn-process');

const namesCountSpan = document.getElementById('names-count');
const namesPreviewDiv = document.getElementById('names-preview');
const btnConfirmNames = document.getElementById('btn-confirm-names');
const btnBackPaste = document.getElementById('btn-back-paste');

const playersPerTeamInput = document.getElementById('players-per-team');
const totalPlayersSpan = document.getElementById('total-players');
const btnConfig = document.getElementById('btn-config');

const teamsContainer = document.getElementById('teams-container');
const totalTeamsSpan = document.getElementById('total-teams');
const playersPerTeamResultSpan = document.getElementById('players-per-team-result');
const btnSortAgain = document.getElementById('btn-sort-again');
const btnReset = document.getElementById('btn-reset');

// Variáveis de estado
let allPlayers = [];
let confirmedPlayers = [];
let playersPerTeam = 0;
let numberOfTeams = 0;

// Cores para os times (cores vibrantes e distintas)
const teamColors = [
    { bg: '#667eea', border: '#667eea', name: 'Time A' },
    { bg: '#f5576c', border: '#f5576c', name: 'Time B' },
    { bg: '#2ed573', border: '#2ed573', name: 'Time C' },
    { bg: '#ffa502', border: '#ffa502', name: 'Time D' },
    { bg: '#3742fa', border: '#3742fa', name: 'Time E' },
    { bg: '#ff4757', border: '#ff4757', name: 'Time F' },
    { bg: '#1dd1a1', border: '#1dd1a1', name: 'Time G' },
    { bg: '#ff9f43', border: '#ff9f43', name: 'Time H' },
    { bg: '#5f27cd', border: '#5f27cd', name: 'Time I' },
    { bg: '#ee5253', border: '#ee5253', name: 'Time J' },
    { bg: '#10ac84', border: '#10ac84', name: 'Time K' },
    { bg: '#ff6b81', border: '#ff6b81', name: 'Time L' }
];

// Função para obter cor do time
function getTeamColor(index) {
    return teamColors[index % teamColors.length];
}

// Função para extrair nome de uma linha
function extractName(line) {
    // Remove números no início (1-, 1., 1 , etc.)
    let name = line.replace(/^[\d]+[\.\-\)\s]*[\d\-]*/, '').trim();
    
    // Remove parênteses e tudo dentro (se for as 19h), (19h), etc.
    name = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    
    // Remove colchetes e tudo dentro
    name = name.replace(/\s*\[[^\]]*\]\s*/g, '').trim();
    
    // Remove traços e conteúdo após (ex: "Nome - observação")
    name = name.replace(/\s*[\-–—]\s*.*$/, '').trim();
    
    // Remove números no final
    name = name.replace(/\s*\d+\s*$/, '').trim();
    
    return name;
}

// Função para processar a lista de nomes
function processNames() {
    const text = namesTextarea.value;
    
    if (!text.trim()) {
        alert('Por favor, cole a lista de jogadores');
        return;
    }
    
    // Divide por linhas e filtra
    const lines = text.split('\n');
    allPlayers = [];
    
    lines.forEach((line, index) => {
        const name = extractName(line);
        if (name && name.length > 0) {
            allPlayers.push({
                id: index,
                name: name,
                selected: true
            });
        }
    });
    
    if (allPlayers.length === 0) {
        alert('Nenhum nome encontrado! Verifique o formato da lista.');
        return;
    }
    
    confirmedPlayers = [...allPlayers];
    
    showVerifySection();
}

// Função para mostrar a seção de verificação
function showVerifySection() {
    pasteSection.classList.add('hidden');
    verifySection.classList.remove('hidden');
    configSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    
    namesCountSpan.textContent = confirmedPlayers.length;
    renderNamesPreview();
}

// Função para renderizar o preview dos nomes
function renderNamesPreview() {
    namesPreviewDiv.innerHTML = '';
    
    confirmedPlayers.forEach((player, index) => {
        const chip = document.createElement('span');
        chip.className = 'name-chip';
        chip.textContent = player.name;
        chip.onclick = () => togglePlayer(index);
        chip.title = 'Clique para remover';
        namesPreviewDiv.appendChild(chip);
    });
}

// Função para alternar seleção do jogador
function togglePlayer(index) {
    confirmedPlayers[index].selected = !confirmedPlayers[index].selected;
    
    // Atualizar visual
    const chips = namesPreviewDiv.querySelectorAll('.name-chip');
    if (confirmedPlayers[index].selected) {
        chips[index].classList.remove('removed');
    } else {
        chips[index].classList.add('removed');
    }
}

// Função para confirmar nomes e ir para configuração
function confirmNames() {
    confirmedPlayers = confirmedPlayers.filter(p => p.selected);
    
    if (confirmedPlayers.length < 2) {
        alert('É necessário pelo menos 2 jogadores!');
        return;
    }
    
    // Reset input
    playersPerTeamInput.value = '';
    
    verifySection.classList.add('hidden');
    configSection.classList.remove('hidden');
    
    totalPlayersSpan.textContent = confirmedPlayers.length;
    
    // Sugerir número de jogadores por time baseado no total
    const suggestedPlayers = Math.ceil(confirmedPlayers.length / 2);
    playersPerTeamInput.value = suggestedPlayers;
}

// Função para configurar número de jogadores por time
function configureTeamSize() {
    const value = parseInt(playersPerTeamInput.value);
    
    if (isNaN(value) || value < 1) {
        alert('Por favor, digite um número válido');
        return;
    }
    
    if (value > confirmedPlayers.length) {
        alert(`Você só tem ${confirmedPlayers.length} jogadores confirmados. O máximo por time é ${confirmedPlayers.length}.`);
        return;
    }
    
    playersPerTeam = value;
    sortMultipleTeams();
}

// Função Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Função para sortear múltiplos times
function sortMultipleTeams() {
    // Extrai apenas os nomes
    const playerNames = confirmedPlayers.map(p => p.name);
    
    // Embaralhar jogadores
    const shuffledPlayers = shuffleArray(playerNames);
    
    // Calcular número de times necessários
    numberOfTeams = Math.ceil(shuffledPlayers.length / playersPerTeam);
    
    // Dividir jogadores em times
    const teams = [];
    let currentIndex = 0;
    
    for (let i = 0; i < numberOfTeams; i++) {
        const teamSize = (i === numberOfTeams - 1) 
            ? shuffledPlayers.length - currentIndex  // Último time pode ter menos
            : playersPerTeam;
        
        const team = shuffledPlayers.slice(currentIndex, currentIndex + teamSize);
        teams.push(team);
        currentIndex += teamSize;
    }
    
    // Renderizar times
    renderMultipleTeams(teams);
    
    // Mostrar resultado
    configSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

// Função para renderizar múltiplos times
function renderMultipleTeams(teams) {
    teamsContainer.innerHTML = '';
    
    // Atualizar informações
    totalTeamsSpan.textContent = teams.length;
    playersPerTeamResultSpan.textContent = playersPerTeam;
    
    teams.forEach((teamMembers, teamIndex) => {
        const color = getTeamColor(teamIndex);
        
        // Criar elemento do time
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.style.animationDelay = `${teamIndex * 0.1}s`;
        
        // Título do time
        const title = document.createElement('h3');
        title.textContent = color.name;
        title.style.color = color.border;
        title.style.borderColor = color.border;
        teamDiv.appendChild(title);
        
        // Lista de jogadores
        const ul = document.createElement('ul');
        
        teamMembers.forEach((member, memberIndex) => {
            const li = document.createElement('li');
            li.textContent = member;
            li.style.animationDelay = `${memberIndex * 0.1}s`;
            ul.appendChild(li);
        });
        
        teamDiv.appendChild(ul);
        teamsContainer.appendChild(teamDiv);
    });
}

// Função para sortear novamente
function sortAgain() {
    sortMultipleTeams();
}

// Função para resetar tudo
function resetAll() {
    namesTextarea.value = '';
    playersPerTeamInput.value = '';
    allPlayers = [];
    confirmedPlayers = [];
    playersPerTeam = 0;
    numberOfTeams = 0;
    
    pasteSection.classList.remove('hidden');
    verifySection.classList.add('hidden');
    configSection.classList.add('hidden');
    resultSection.classList.add('hidden');
}

// Voltar para paste
function backToPaste() {
    verifySection.classList.add('hidden');
    pasteSection.classList.remove('hidden');
}

// Event Listeners
btnProcess.addEventListener('click', processNames);
btnBackPaste.addEventListener('click', backToPaste);
btnConfirmNames.addEventListener('click', confirmNames);
btnConfig.addEventListener('click', configureTeamSize);
btnSortAgain.addEventListener('click', sortAgain);
btnReset.addEventListener('click', resetAll);

// Suporte a Enter no textarea
namesTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        processNames();
    }
});

