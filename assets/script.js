// Elementos do DOM
const pasteSection = document.getElementById('paste-section');
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

// Cores para os times
const teamColors = [
    { border: '#007aff', name: 'Time A' },
    { border: '#ff3b30', name: 'Time B' },
    { border: '#34c759', name: 'Time C' },
    { border: '#ff9500', name: 'Time D' },
    { border: '#5856d6', name: 'Time E' },
    { border: '#ff2d55', name: 'Time F' },
    { border: '#00c7be', name: 'Time G' },
    { border: '#ffcc00', name: 'Time H' },
    { border: '#af52de', name: 'Time I' },
    { border: '#ff6b6b', name: 'Time J' },
    { border: '#5ac8fa', name: 'Time K' },
    { border: '#64d2ff', name: 'Time L' }
];

// Função para obter cor do time
function getTeamColor(index) {
    return teamColors[index % teamColors.length];
}

// Função para extrair nome de uma linha
function extractName(line) {
    let name = line.replace(/^[\d]+[\.\-\)\s]*[\d\-]*/, '').trim();
    name = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    name = name.replace(/\s*\[[^\]]*\]\s*/g, '').trim();
    name = name.replace(/\s*[\-–—]\s*.*$/, '').trim();
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
    
    playersPerTeamInput.value = '';
    verifySection.classList.add('hidden');
    configSection.classList.remove('hidden');
    totalPlayersSpan.textContent = confirmedPlayers.length;
    
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
        alert(`Você só tem ${confirmedPlayers.length} jogadores confirmados.`);
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
    const playerNames = confirmedPlayers.map(p => p.name);
    const shuffledPlayers = shuffleArray(playerNames);
    
    numberOfTeams = Math.ceil(shuffledPlayers.length / playersPerTeam);
    
    const teams = [];
    let currentIndex = 0;
    
    for (let i = 0; i < numberOfTeams; i++) {
        const teamSize = (i === numberOfTeams - 1) 
            ? shuffledPlayers.length - currentIndex
            : playersPerTeam;
        
        const team = shuffledPlayers.slice(currentIndex, currentIndex + teamSize);
        teams.push(team);
        currentIndex += teamSize;
    }
    
    renderMultipleTeams(teams);
    configSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

// Função para renderizar múltiplos times
function renderMultipleTeams(teams) {
    teamsContainer.innerHTML = '';
    
    totalTeamsSpan.textContent = teams.length;
    playersPerTeamResultSpan.textContent = playersPerTeam;
    
    teams.forEach((teamMembers, teamIndex) => {
        const color = getTeamColor(teamIndex);
        
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.style.animationDelay = `${teamIndex * 0.1}s`;
        
        const title = document.createElement('h3');
        title.textContent = color.name;
        title.style.color = color.border;
        title.style.borderColor = color.border;
        teamDiv.appendChild(title);
        
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

