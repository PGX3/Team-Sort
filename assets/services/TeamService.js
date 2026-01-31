/**
 * @fileoverview TeamService - Camada de domínio responsável pela lógica de 
 * criação e distribuição de times. Implementa algoritmos de shuffle e 
 * particionamento.
 * 
 * @version 1.0.0
 * @author Tech Lead
 * @since 2024-01
 */

/**
 * Representa um time formado.
 * @typedef {Object} Team
 * @property {string} name - Nome do time (Time A, B, C...)
 * @property {string[]} members - Nomes dos jogadores
 * @property {string} color - Cor do time em hex
 */

/**
 * TeamService - Serviço de domínio para operações com times.
 * Centraliza lógica de randomização e distribuição de jogadores.
 */
const TeamService = (function() {
    'use strict';

    /**
     * Paleta de cores para diferenciação visual dos times.
     * @constant
     */
    const TEAM_COLORS = Object.freeze([
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
    ]);

    /**
     * Algoritmo Fisher-Yates para shuffle verdadeiramente aleatório.
     * Complexidade: O(n) - Otimizado para performance.
     * 
     * @param {T[]} array - Array a ser embaralhado
     * @returns {T[]} Nova cópia do array embaralhado
     * 
     * @example
     * const shuffled = TeamService.shuffle([1, 2, 3, 4, 5]);
     */
    function shuffle(array) {
        const shuffled = [...array];
        let currentIndex = shuffled.length;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            const temp = shuffled[currentIndex];
            shuffled[currentIndex] = shuffled[randomIndex];
            shuffled[randomIndex] = temp;
        }

        return shuffled;
    }

    /**
     * Distribui jogadores em times igualmente.
     * O último time pode ter menos membros se necessário.
     * 
     * @param {string[]} players - Array de nomes de jogadores
     * @param {number} playersPerTeam - Quantidade por time
     * @returns {Object[]} Estrutura com teams, totalTeams e playersPerTeam
     * 
     * @example
     * const result = TeamService.distribute(['A', 'B', 'C', 'D', 'E'], 2);
     * // { teams: [['A','D'], ['B','E'], ['C']], totalTeams: 3, playersPerTeam: 2 }
     */
    function distribute(players, playersPerTeam) {
        if (!players?.length || playersPerTeam < 1) {
            throw new Error('Parâmetros inválidos para distribuição');
        }

        const shuffledPlayers = shuffle(players);
        const totalTeams = Math.ceil(shuffledPlayers.length / playersPerTeam);
        const teams = [];

        let currentIndex = 0;

        for (let teamIndex = 0; teamIndex < totalTeams; teamIndex++) {
            const isLastTeam = teamIndex === totalTeams - 1;
            const teamSize = isLastTeam 
                ? shuffledPlayers.length - currentIndex 
                : playersPerTeam;

            const team = shuffledPlayers.slice(currentIndex, currentIndex + teamSize);
            teams.push(team);
            currentIndex += teamSize;
        }

        return {
            teams,
            totalTeams,
            playersPerTeam
        };
    }

    /**
     * Retorna configuração de cor para um time específico.
     * Cicla através das cores disponíveis.
     * 
     * @param {number} teamIndex - Índice do time (0-based)
     * @returns {Object} Configuração de cor
     */
    function getTeamColor(teamIndex) {
        return TEAM_COLORS[teamIndex % TEAM_COLORS.length];
    }

    // API pública do módulo
    return {
        shuffle,
        distribute,
        getTeamColor,
        TEAM_COLORS
    };

})();

// Export para uso em ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamService;
}

