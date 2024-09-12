class RecintosZoo {
    constructor() {
        this.recintos = [
            { recinto: 1, bioma: 'savana', tamanho: 10, animais: ['MACACO'], espacoOcupado: 3 },
            { recinto: 2, bioma: 'floresta', tamanho: 5, animais: [], espacoOcupado: 0 },
            { recinto: 3, bioma: 'savana e rio', tamanho: 7, animais: ['GAZELA'], espacoOcupado: 2 },
            { recinto: 4, bioma: 'rio', tamanho: 8, animais: [], espacoOcupado: 0 },
            { recinto: 5, bioma: 'savana', tamanho: 9, animais: ['LEAO'], espacoOcupado: 3 }
        ];

        this.especiesPermitidas = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validação de espécie
        const especieInfo = this.especiesPermitidas[animal.toUpperCase()];
        if (!especieInfo) {
            return {
                recintosViaveis: undefined,
                erro: "Animal inválido"
            };
        }

        // Validação de quantidade
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return {
                recintosViaveis: undefined,
                erro: "Quantidade inválida"
            };
        }

        let recintosViaveis = [];

        // Percorre os recintos para verificar quais são viáveis
        this.recintos.forEach(recinto => {
            let espacoNecessario = especieInfo.tamanho * quantidade;
            const espacoDisponivel = recinto.tamanho - recinto.espacoOcupado;

            // Verifica compatibilidade de bioma
            if (!especieInfo.bioma.includes(recinto.bioma)) {
                return;
            }

            // Verifica regra de carnívoros
            const temCarnivoro = recinto.animais.some(a => this.especiesPermitidas[a.toUpperCase()]?.carnivoro);
            if (temCarnivoro && especieInfo.carnivoro && recinto.animais.some(a => a !== animal.toUpperCase())) {
                return;
            }
            if (temCarnivoro && !especieInfo.carnivoro) {
                return;
            }

            // Regras para hipopótamos
            if (animal.toUpperCase() === 'HIPOPOTAMO' && recinto.animais.length > 0 && !recinto.bioma.includes('savana') && !recinto.bioma.includes('rio')) {
                return;
            }

            // Espaço extra para mais de uma espécie
            if (recinto.animais.length > 0 && !especieInfo.carnivoro && !recinto.animais.every(a => a.toUpperCase() === animal.toUpperCase())) {
                espacoNecessario += 1;
            }

            // Verifica se há espaço suficiente
            if (espacoNecessario <= espacoDisponivel) {
                recintosViaveis.push({
                    recinto: recinto.recinto,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    espacoTotal: recinto.tamanho
                });
            }
        });

        // Ordena os recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.recinto - b.recinto);

        // Retorna a lista de recintos viáveis ou mensagem de erro
        if (recintosViaveis.length > 0) {
            return {
                recintosViaveis: recintosViaveis.map(recinto =>
                    // Ao apagar o espaço entre recinto e $ gera dois erros no teste, mas o  resultado deixa de ser undefined, encontrei o erro, mas infelizmente não consigo
                `Recinto ${recinto.recinto} (espaço livre: ${recinto.espacoLivre} total: ${recinto.espacoTotal})`
                ),
                erro: undefined
            };
        } else {
            return {
                erro: "Não há recinto viável"
            };
        }
    }
}

export { RecintosZoo };