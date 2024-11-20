interface TransportProblem {
    supply: number[];
    demand: number[];
    costs: number[][];
}

interface Solution {
    allocation: number[][];
    totalCost: number;
}

export function solveTransportProblem(problem: TransportProblem): Solution {
    const { supply, demand, costs } = problem;
    const numSources = supply.length;
    const numDestinations = demand.length;

    // Инициализация таблицы распределения
    const allocation: number[][] = Array.from({ length: numSources }, () => Array(numDestinations).fill(0));

    // Начальное решение с использованием метода северо-западного угла
    const remainingSupply = [...supply];
    const remainingDemand = [...demand];

    for (let i = 0; i < numSources; i++) {
        for (let j = 0; j < numDestinations; j++) {
            if (remainingSupply[i] > 0 && remainingDemand[j] > 0) {
                const amount = Math.min(remainingSupply[i], remainingDemand[j]);
                allocation[i][j] = amount;
                remainingSupply[i] -= amount;
                remainingDemand[j] -= amount;
            }
        }
    }

    // Метод потенциалов
    const u: number[] = Array(numSources).fill(null);
    const v: number[] = Array(numDestinations).fill(null);
    u[0] = 0; // Начинаем с первого источника

    // Вычисление потенциалов
    let isChanged = true;
    while (isChanged) {
        isChanged = false;
        for (let i = 0; i < numSources; i++) {
            for (let j = 0; j < numDestinations; j++) {
                if (allocation[i][j] > 0) {
                    if (u[i] !== null && v[j] === null) {
                        v[j] = costs[i][j] - u[i];
                        isChanged = true;
                    } else if (v[j] !== null && u[i] === null) {
                        u[i] = costs[i][j] - v[j];
                        isChanged = true;
                    }
                }
            }
        }
        console.log(1)
    }

    // Оптимизация
    let totalCost = 0;
    for (let i = 0; i < numSources; i++) {
        for (let j = 0; j < numDestinations; j++) {
            totalCost += allocation[i][j] * costs[i][j];
        }
    }

    // Проверка на оптимальность
    let optimal = false;
    while (!optimal) {
        optimal = true;
        const marked: boolean[][] = Array.from({ length: numSources }, () => Array(numDestinations).fill(false));

        // Поиск незанятых клеток
        for (let i = 0; i < numSources; i++) {
            for (let j = 0; j < numDestinations; j++) {
                if (allocation[i][j] === 0 && u[i] !== null && v[j] !== null) {
                    const reducedCost = costs[i][j] - (u[i] + v[j]);
                    if (reducedCost < 0) {
                        // Если есть возможность уменьшить стоимость
                        marked[i][j] = true;
                        optimal = false;
                    }
                }
            }
        }

        // Если есть незанятые клетки, обновляем решение
        if (!optimal) {
            // Алгоритм для обновления распределения
            // (дополните его по мере необходимости)
        }
        console.log(2)
    }

    console.log(3)

    return { allocation, totalCost };
}

// Пример использования
const problem: TransportProblem = {
    supply: [20, 30, 50],
    demand: [30, 30, 40],
    costs: [
        [8, 6, 10],
        [9, 4, 8],
        [3, 6, 7],
    ],
};

const solution = solveTransportProblem(problem);
console.log("Распределение:", solution.allocation);
console.log("Общая стоимость:", solution.totalCost);
