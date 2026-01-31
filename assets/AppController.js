/**
 * @fileoverview AppController - Controlador principal com animações premium
 * Implementa efeitos de sorteio, confetes e interatividade avançada
 * 
 * @version 3.0.0
 * @author Creative Technologist
 * @since 2024-01
 */

/**
 * AppController - Controlador com UI/UX Premium
 * Adiciona animações de "cassino", confetes e feedback visual
 */
const AppController = (function() {
    'use strict';

    /**
     * Enum para estados da aplicação.
     */
    const AppState = Object.freeze({
        PASTE: 'PASTE',
        VERIFY: 'VERIFY',
        CONFIG: 'CONFIG',
        RESULT: 'RESULT',
        SORTING: 'SORTING'
    });

    /**
     * Configuração de animações.
     */
    const ANIMATION_CONFIG = Object.freeze({
        SORT_DURATION: 2000,      // 2 segundos de animação
        SORT_INTERVAL: 50,        // Troca nomes a cada 50ms
        CONFETTI_COUNT: 150,      // Quantidade de confetes
        CONFETTI_COLORS: [
            '#00f5ff', // Cyan
            '#ff00ff', // Magenta
            '#00ff88', // Green
            '#ff6b00', // Orange
            '#ffd000', // Yellow
            '#ff0080', // Pink
            '#0066ff'  // Blue
        ]
    });

    /**
     * Estado privado da aplicação.
     */
    let state = {
        allPlayers: [],
        confirmedPlayers: [],
        playersPerTeam: 0,
        numberOfTeams: 0,
        currentState: AppState.PASTE,
        isSorting: false
    };

    // ==========================================
    // DOM Element Cache
    // ==========================================
    
    const DOM = {
        sections: {
            paste: document.getElementById('paste-section'),
            verify: document.getElementById('verify-section'),
            config: document.getElementById('config-section'),
            result: document.getElementById('result-section')
        },
        inputs: {
            names: document.getElementById('names-textarea'),
            playersPerTeam: document.getElementById('players-per-team')
        },
        displays: {
            namesCount: document.getElementById('names-count'),
            totalPlayers: document.getElementById('total-players'),
            totalTeams: document.getElementById('total-teams'),
            playersPerTeamResult: document.getElementById('players-per-team-result'),
            namesPreview: document.getElementById('names-preview'),
            teamsContainer: document.getElementById('teams-container')
        },
        buttons: {
            process: document.getElementById('btn-process'),
            confirmNames: document.getElementById('btn-confirm-names'),
            backPaste: document.getElementById('btn-back-paste'),
            config: document.getElementById('btn-config'),
            sortAgain: document.getElementById('btn-sort-again'),
            reset: document.getElementById('btn-reset')
        }
    };

    // ==========================================
    // Confetti System
    // ==========================================

    /**
     * Cria explosão de confetes na tela.
     * @private
     */
    function _createConfetti() {
        // Remove confetes anteriores
        const existing = document.querySelector('.confetti-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        for (let i = 0; i < ANIMATION_CONFIG.CONFETTI_COUNT; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Posição aleatória
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            // Cor aleatória
            const color = ANIMATION_CONFIG.CONFETTI_COLORS[
                Math.floor(Math.random() * ANIMATION_CONFIG.CONFETTI_COLORS.length)
            ];
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            // Tamanho aleatório
            const size = Math.random() * 8 + 6;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            container.appendChild(confetti);
        }

        // Remove após animação
        setTimeout(() => {
            container.remove();
        }, 5000);
    }

    // ==========================================
    // State Management
    // ==========================================

    /**
     * Transiciona para novo estado da aplicação.
     * @param {AppState} newState - Novo estado
     * @private
     */
    function _transitionTo(newState) {
        // Hide all sections
        Object.values(DOM.sections).forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        DOM.sections[newState.toLowerCase()]?.classList.remove('hidden');
        
        state.currentState = newState;
    }

    /**
     * Reseta estado para valor inicial.
     * @private
     */
    function _resetState() {
        state.allPlayers = [];
        state.confirmedPlayers = [];
        state.playersPerTeam = 0;
        state.numberOfTeams = 0;
        state.isSorting = false;
    }

    // ==========================================
    // View Operations
    // ==========================================

    /**
     * Renderiza preview de nomes como chips interativos.
     * @private
     */
    function _renderNamesPreview() {
        const container = DOM.displays.namesPreview;
        container.innerHTML = '';

        state.confirmedPlayers.forEach((player, index) => {
            const chip = document.createElement('span');
            chip.className = `name-chip ${player.selected ? '' : 'removed'}`;
            chip.textContent = player.name;
            chip.dataset.index = index;
            
            chip.addEventListener('click', () => _togglePlayer(index));
            
            container.appendChild(chip);
        });
    }

    /**
     * Renderiza times na view de resultados.
     * @param {Object} distribution - Resultado da distribuição
     * @param {boolean} animate - Se deve usar animação de sortudo
     * @private
     */
    async function _renderTeams(distribution, animate = true) {
        if (animate) {
            await _animateSorting(distribution);
        } else {
            _displayTeams(distribution);
        }
    }

    /**
     * Exibe os times diretamente.
     * @param {Object} distribution - Resultado da distribuição
     * @private
     */
    function _displayTeams(distribution) {
        const container = DOM.displays.teamsContainer;
        container.innerHTML = '';

        DOM.displays.totalTeams.textContent = distribution.totalTeams;
        DOM.displays.playersPerTeamResult.textContent = distribution.playersPerTeam;

        distribution.teams.forEach((teamMembers, teamIndex) => {
            const color = TeamService.getTeamColor(teamIndex);
            
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team';
            teamDiv.style.setProperty('--team-color', color.border);
            
            const title = document.createElement('h3');
            title.textContent = color.name;
            title.style.color = color.border;
            title.style.borderColor = color.border;
            teamDiv.appendChild(title);
            
            const ul = document.createElement('ul');
            
            teamMembers.forEach((member, memberIndex) => {
                const li = document.createElement('li');
                li.textContent = member;
                ul.appendChild(li);
            });
            
            teamDiv.appendChild(ul);
            container.appendChild(teamDiv);
        });
    }

    /**
     * Animação de "sorteio" com nomes piscando.
     * @param {Object} distribution - Resultado final
     * @private
     */
    async function _animateSorting(distribution) {
        const container = DOM.displays.teamsContainer;
        const btnSort = DOM.buttons.config;
        
        // Disable button
        state.isSorting = true;
        btnSort.disabled = true;
        
        // Show loading
        container.innerHTML = `
            <div class="spinner-container" style="grid-column: 1 / -1;">
                <div class="spinner"></div>
                <p class="spinner-text">Sorteando...</p>
            </div>
        `;

        DOM.displays.totalTeams.textContent = '?';
        DOM.displays.playersPerTeamResult.textContent = distribution.playersPerTeam;

        // Get all possible members for random display
        const allMembers = state.confirmedPlayers.map(p => p.name);
        const numTeams = distribution.totalTeams;
        const playersPerTeam = distribution.playersPerTeam;

        // Animation loop
        const startTime = Date.now();
        const endTime = startTime + ANIMATION_CONFIG.SORT_DURATION;

        await new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / ANIMATION_CONFIG.SORT_DURATION;
                
                if (elapsed < ANIMATION_CONFIG.SORT_DURATION) {
                    // Create temporary teams with random members
                    const tempTeams = _createTempTeams(allMembers, numTeams, playersPerTeam);
                    _displayTeams(tempTeams);
                    
                    // Slow down towards the end
                    const interval = ANIMATION_CONFIG.SORT_INTERVAL + (progress * 100);
                    setTimeout(animate, interval);
                } else {
                    // Show final result
                    _displayTeams(distribution);
                    _createConfetti();
                    resolve();
                }
            };
            
            animate();
        });

        // Re-enable button
        state.isSorting = false;
        btnSort.disabled = false;
    }

    /**
     * Cria times temporários com nomes aleatórios para animação.
     * @private
     */
    function _createTempTeams(allMembers, numTeams, playersPerTeam) {
        const shuffled = TeamService.shuffle(allMembers);
        const teams = [];
        let index = 0;

        for (let i = 0; i < numTeams; i++) {
            const teamSize = (i === numTeams - 1)
                ? shuffled.length - index
                : playersPerTeam;
            teams.push(shuffled.slice(index, index + teamSize));
            index += teamSize;
        }

        return { teams, totalTeams: numTeams, playersPerTeam };
    }

    // ==========================================
    // Event Handlers
    // ==========================================

    /**
     * Processa lista de nomes informada pelo usuário.
     * @private
     */
    function _handleProcessNames() {
        const rawText = DOM.inputs.names.value;

        try {
            state.allPlayers = PlayerService.parseFromText(rawText);
            state.confirmedPlayers = [...state.allPlayers];
            
            DOM.displays.namesCount.textContent = state.confirmedPlayers.length;
            _renderNamesPreview();
            _transitionTo(AppState.VERIFY);
            
        } catch (error) {
            _showError(error.message);
        }
    }

    /**
     * Confirma seleção de nomes e avança para configuração.
     * @private
     */
    function _handleConfirmNames() {
        state.confirmedPlayers = PlayerService.filterSelected(state.confirmedPlayers);

        if (!PlayerService.validateMinCount(state.confirmedPlayers, 2)) {
            _showError('É necessário pelo menos 2 jogadores!');
            return;
        }

        DOM.inputs.playersPerTeam.value = '';
        DOM.displays.totalPlayers.textContent = state.confirmedPlayers.length;
        
        const suggestion = PlayerService.suggestPlayersPerTeam(state.confirmedPlayers.length);
        DOM.inputs.playersPerTeam.value = suggestion;

        _transitionTo(AppState.CONFIG);
    }

    /**
     * Configura tamanho dos times e executa sorteio com animação.
     * @private
     */
    async function _handleConfigureTeamSize() {
        const value = parseInt(DOM.inputs.playersPerTeam.value, 10);

        if (isNaN(value) || value < 1) {
            _showError('Por favor, digite um número válido');
            return;
        }

        if (value > state.confirmedPlayers.length) {
            _showError(`Você só tem ${state.confirmedPlayers.length} jogadores confirmados.`);
            return;
        }

        state.playersPerTeam = value;

        const playerNames = state.confirmedPlayers.map(p => p.name);
        const distribution = TeamService.distribute(playerNames, value);
        
        state.numberOfTeams = distribution.totalTeams;
        
        _transitionTo(AppState.SORTING);
        await _renderTeams(distribution, true);
        _transitionTo(AppState.RESULT);
    }

    /**
     * Alterna seleção de um jogador.
     * @param {number} index - Índice do jogador
     * @private
     */
    function _togglePlayer(index) {
        state.confirmedPlayers[index].selected = !state.confirmedPlayers[index].selected;
        
        const chip = DOM.displays.namesPreview.children[index];
        chip.classList.toggle('removed', !state.confirmedPlayers[index].selected);
    }

    /**
     * Volta para tela de cola de nomes.
     * @private
     */
    function _handleBackToPaste() {
        _transitionTo(AppState.PASTE);
    }

    /**
     * Executa novo sorteio mantendo configuração.
     * @private
     */
    async function _handleSortAgain() {
        if (state.isSorting) return;
        
        const playerNames = state.confirmedPlayers.map(p => p.name);
        const distribution = TeamService.distribute(playerNames, state.playersPerTeam);
        
        _transitionTo(AppState.SORTING);
        await _renderTeams(distribution, true);
        _transitionTo(AppState.RESULT);
    }

    /**
     * Reseta toda a aplicação para estado inicial.
     * @private
     */
    function _handleReset() {
        DOM.inputs.names.value = '';
        DOM.inputs.playersPerTeam.value = '';
        _resetState();
        _transitionTo(AppState.PASTE);
    }

    /**
     * Exibe erro para o usuário.
     * @param {string} message - Mensagem de erro
     * @private
     */
    function _showError(message) {
        alert(message);
    }

    /**
     * Configura todos os event listeners da aplicação.
     * @private
     */
    function _setupEventListeners() {
        DOM.buttons.process.addEventListener('click', _handleProcessNames);
        DOM.buttons.confirmNames.addEventListener('click', _handleConfirmNames);
        DOM.buttons.backPaste.addEventListener('click', _handleBackToPaste);
        DOM.buttons.config.addEventListener('click', _handleConfigureTeamSize);
        DOM.buttons.sortAgain.addEventListener('click', _handleSortAgain);
        DOM.buttons.reset.addEventListener('click', _handleReset);

        // Keyboard shortcut: Ctrl+Enter para processar
        DOM.inputs.names.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                _handleProcessNames();
            }
        });
    }

    /**
     * Inicializa a aplicação.
     * @public
     */
    function init() {
        _setupEventListeners();
        _transitionTo(AppState.PASTE);
    }

    // API pública
    return {
        init
    };

})();

// Auto-inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', AppController.init);

// Export para testes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}

