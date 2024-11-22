export type ObjectiveType = "minimize" | "maximize";

export class TransportationProblem {
  private costMatrix: number[][];
  private supply: number[];
  private demand: number[];
  private plan: number[][];
  objective: ObjectiveType;

  constructor(costMatrix: number[][], supply: number[], demand: number[], objective: ObjectiveType) {
    this.costMatrix = costMatrix;
    this.supply = supply;
    this.demand = demand;
    this.plan = this.initializePlanLeastCost();
    this.objective = objective;
  }

  private initializePlanLeastCost(): number[][] {
    const rows = this.supply.length;
    const cols = this.demand.length;
    const plan = Array.from({ length: rows }, () => Array(cols).fill(0));
    const supplyCopy = [...this.supply];
    const demandCopy = [...this.demand];

    while (supplyCopy.some((s) => s > 0)) {
      let minCost = Infinity;
      let minRow = -1;
      let minCol = -1;

      //Find cell with minimum cost among available cells
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (supplyCopy[i] > 0 && demandCopy[j] > 0 && this.costMatrix[i][j] < minCost) {
            minCost = this.costMatrix[i][j];
            minRow = i;
            minCol = j;
          }
        }
      }

      if (minRow === -1) {
        break; //Exit if no suitable cell is found
      }

      //Allocate as much as possible to the cell
      const allocation = Math.min(supplyCopy[minRow], demandCopy[minCol]);
      plan[minRow][minCol] = allocation;
      supplyCopy[minRow] -= allocation;
      demandCopy[minCol] -= allocation;
    }
    return plan;
  }

  private calculatePotentials(): { u: number[]; v: number[] } {
    const n = this.plan.length;
    const m = this.plan[0].length;

    const u = new Array(n).fill(0); // Initialize u to 0
    const v = new Array(m).fill(0); // Initialize v to 0

    u[0] = 0; // Set u[0] to 0 (starting point)

    //Error handling (if calculation fails to converge)
    if (u.some(val => isNaN(val) || !isFinite(val)) || v.some(val => isNaN(val) || !isFinite(val))) {
      throw new Error("Error: Potentials calculation failed to converge.");
    }

    return { u, v };
  }


  private findCycle(row: number, col: number): { row: number; col: number }[] | null {
    const rows = this.plan.length;
    const cols = this.plan[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path: { row: number; col: number }[] = [];
    let currentRow = row;
    let currentCol = col;

    function findNextCell(r: number, c: number, plan: number[][]): { row: number; col: number } | null {
      for (let i = 0; i < rows; i++) {
        if (i !== r && plan[i][c] > 0 && !visited[i][c]) {
          return { row: i, col: c };
        }
      }
      for (let j = 0; j < cols; j++) {
        if (j !== c && plan[r][j] > 0 && !visited[r][j]) {
          return { row: r, col: j };
        }
      }
      return null;
    }

    while (true) {
      visited[currentRow][currentCol] = true;
      path.push({ row: currentRow, col: currentCol });
      const nextCell = findNextCell(currentRow, currentCol, this.plan);
      if (nextCell) {
        currentRow = nextCell.row;
        currentCol = nextCell.col;
      } else if (path.some((cell) => cell.row === row && cell.col === col)) { // Cycle found
        return path.slice(path.findIndex((cell) => cell.row === row && cell.col === col));
      } else { // No cycle found
        return null;
      }
    }
  }


  private calculateCycleFlow(cycle: { row: number; col: number }[]): number {
    let minFlow = Infinity;
    for (let i = 0; i < cycle.length; i++) {
      const { row, col } = cycle[i];
      const flow = this.plan[row][col];
      minFlow = Math.min(minFlow, flow); //Find minimum flow in the cycle
    }
    return minFlow;
  }


  private updatePlanWithCycle(cycle: { row: number; col: number }[], flow: number): void {
    console.log("Flow: ", flow)
    for (let i = 0; i < cycle.length; i++) {
      const { row, col } = cycle[i];
      if (i % 2 === 0) { //Even indices: subtract flow
        this.plan[row][col] -= flow;
      } else { //Odd indices: add flow
        this.plan[row][col] += flow;
      }
    }
  }


  private improvePlan(): boolean {
    const { u, v } = this.calculatePotentials();
    for (let i = 0; i < this.supply.length; i++) {
      for (let j = 0; j < this.demand.length; j++) {
        if (this.plan[i][j] === 0) {
          const reducedCost = this.costMatrix[i][j] - u[i] - v[j];
          if ((this.objective === "minimize" && reducedCost < -1e-6) || (this.objective === "maximize" && reducedCost > 1e-6)) {
            const cycle = this.findCycle(i, j);
            if (cycle) {
              const minFlow = this.calculateCycleFlow(cycle);
              this.updatePlanWithCycle(cycle, minFlow);
              return true;
            }
          }
        }
      }
    }
    return false;
  }


  private validateData() {
    // Проверяем, что матрица plan и costMatrix не пустые и все значения в них валидны
    if (this.plan.length === 0 || this.costMatrix.length === 0) {
      throw new Error("Матрицы пусты! Проверьте входные данные.");
    }

    for (let i = 0; i < this.plan.length; i++) {
      for (let j = 0; j < this.plan[i].length; j++) {
        if (this.plan[i][j] === undefined || this.plan[i][j] === null) {
          throw new Error(
            `Матрица планов содержит неопределённые значения в ячейке [${i}][${j}]`
          );
        }
        if (this.plan[i][j] < 0) {
          throw new Error(
            `Матрица планов содержит отрицательное значение в ячейке [${i}][${j}]`
          );
        }
      }
    }

    for (let i = 0; i < this.costMatrix.length; i++) {
      for (let j = 0; j < this.costMatrix[i].length; j++) {
        if (
          this.costMatrix[i][j] === undefined ||
          this.costMatrix[i][j] === null
        ) {
          throw new Error(
            `Матрица стоимостей содержит неопределённые значения в ячейке [${i}][${j}]`
          );
        }
        if (this.costMatrix[i][j] < 0) {
          throw new Error(
            `Матрица стоимостей содержит отрицательное значение в ячейке [${i}][${j}]`
          );
        }
      }
    }

    console.log("Данные валидны!");
  }

  public solve(): { plan: number[][]; objectiveValue: number } {
    // Итеративно улучшаем план, пока не получим оптимальное решение
    let improvement = true;
    while (improvement) {
      this.validateData();
      improvement = this.improvePlan();
    }

    // Вычисляем общие затраты и доходы
    let totalCost = 0;

    for (let i = 0; i < this.supply.length; i++) {
      for (let j = 0; j < this.demand.length; j++) {
        totalCost += this.costMatrix[i][j] * this.plan[i][j];
      }
    }

    const objectiveValue = totalCost; // Минимальные затраты

    return { plan: this.plan, objectiveValue }; // Возвращаем план и значение цели
  }
}