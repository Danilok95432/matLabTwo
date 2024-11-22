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
            // Находим цикл
            const cycle = findCycle(allocation, marked, numSources, numDestinations);
            if (cycle) {
                // Определяем минимальное количество в цикле
                const minAmount = Math.min(...cycle.map(({ i, j }) => allocation[i][j] || Infinity));
                // Обновляем распределение
                for (const { i, j } of cycle) {
                    allocation[i][j] += (allocation[i][j] ? -minAmount : minAmount);
                }
            }
        }
    }

    return { allocation, totalCost };
}

// Функция для поиска цикла
function findCycle(allocation: number[][], marked: boolean[][], numSources: number, numDestinations: number) {
    const visited: boolean[][] = Array.from({ length: numSources }, () => Array(numDestinations).fill(false));
    const path: { i: number, j: number }[] = [];
    
    const dfs = (i: number, j: number): boolean => {
        if (visited[i][j]) return false;
        visited[i][j] = true;
        path.push({ i, j });

        // Проверка соседей
        for (let ni = 0; ni < numSources; ni++) {
            if (marked[ni][j] && (allocation[ni][j] > 0 || path.some(p => p.i === ni && p.j === j))) {
                if (dfs(ni, j)) return true;
            }
        }
        for (let nj = 0; nj < numDestinations; nj++) {
            if (marked[i][nj] && (allocation[i][nj] > 0 || path.some(p => p.i === i && p.j === nj))) {
                if (dfs(i, nj)) return true;
            }
        }

        path.pop();
        return false;
    };

    for (let i = 0; i < numSources; i++) {
        for (let j = 0; j < numDestinations; j++) {
            if (marked[i][j]) {
                path.length = 0; // Очистка пути
                if (dfs(i, j)) return path;
            }
        }
    }

    return null;
}
