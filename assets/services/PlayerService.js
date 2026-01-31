/**
 * @fileoverview PlayerService - Camada de domínio responsável pela lógica de negócios
 * relacionada a jogadores. Implementa padrão Service Layer para separação de responsabilidades.
 * 
 * @version 1.0.0
 * @author Tech Lead
 * @since 2024-01
 */

/**
 * Representa um jogador no sistema.
 * @typedef {Object} Player
 * @property {number} id - Identificador único do jogador
 * @property {string} name - Nome do jogador
 * @property {boolean} selected - Status de seleção
 */

/**
 * PlayerService - Serviço de domínio para operações com jogadores.
 * Centraliza validação, parsing e manipulação de dados de jogadores.
 */
class PlayerService {
    /**
     * Padrão regex para limpeza de nomes.
     * Remove números, parênteses, colchetes e observações.
     * @private
     */
    static CLEANUP_PATTERNS = {
        PREFIX_NUMBER: /^[\d]+[\.\-\)\s]*[\d\-]*/,
        PARENTHESES: /\s*\([^)]*\)\s*/g,
        BRACKETS: /\s*\[[^\]]*\]\s*/g,
        DASH_CONTENT: /\s*[\-–—]\s*.*$/,
        SUFFIX_NUMBER: /\s*\d+\s*$/,
        WHITESPACE: /\s+/g
    };

    /**
     * Processa uma lista crua de texto e extrai nomes válidos de jogadores.
     * 
     * @param {string} rawText - Texto bruto contendo lista de jogadores
     * @returns {Player[]} Array de jogadores processados
     * @throws {Error} Se o texto estiver vazio
     * 
     * @example
     * const players = PlayerService.parseFromText("1- João\n2- Maria");
     * // [{id: 0, name: "João", selected: true}, ...]
     */
    static parseFromText(rawText) {
        if (!rawText?.trim()) {
            throw new Error('Texto vazio não permitido');
        }

        const lines = rawText.split('\n');
        const players = [];

        lines.forEach((line, index) => {
            const cleanName = this._extractCleanName(line);
            
            if (cleanName && cleanName.length > 0) {
                players.push({
                    id: index,
                    name: cleanName,
                    selected: true
                });
            }
        });

        if (players.length === 0) {
            throw new Error('Nenhum nome válido encontrado');
        }

        return players;
    }

    /**
     * Aplica regex de limpeza sequencialmente para extrair nome puro.
     * @private
     * @param {string} line - Linha bruta
     * @returns {string} Nome limpo
     */
    static _extractCleanName(line) {
        let name = line
            .replace(this.CLEANUP_PATTERNS.PREFIX_NUMBER, '')
            .replace(this.CLEANUP_PATTERNS.PARENTHESES, '')
            .replace(this.CLEANUP_PATTERNS.BRACKETS, '')
            .replace(this.CLEANUP_PATTERNS.DASH_CONTENT, '')
            .replace(this.CLEANUP_PATTERNS.SUFFIX_NUMBER, '')
            .replace(this.CLEANUP_PATTERNS.WHITESPACE, ' ')
            .trim();

        return name;
    }

    /**
     * Filtra jogadores selecionados.
     * @param {Player[]} players - Array de jogadores
     * @returns {Player[]} Array com apenas jogadores selecionados
     */
    static filterSelected(players) {
        return players.filter(p => p.selected);
    }

    /**
     * Valida quantidade mínima de jogadores.
     * @param {Player[]} players - Array de jogadores
     * @param {number} minCount - Quantidade mínima
     * @returns {boolean} True se válido
     */
    static validateMinCount(players, minCount = 2) {
        return players.length >= minCount;
    }

    /**
     * Sugere número ideal de jogadores por time.
     * @param {number} totalPlayers - Total de jogadores
     * @returns {number} Sugestão de jogadores por time
     */
    static suggestPlayersPerTeam(totalPlayers) {
        return Math.ceil(totalPlayers / 2);
    }
}

// Export para uso em ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerService;
}

