class SudokuSolver {
  // Logic handles a valid puzzle string of 81 characters
  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  // Logic handles a puzzle string that is not 81 characters in length
  validate(puzzleString) {
    if (!puzzleString) {
      return "Required field missing";
    }

    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }

    return null;
  }

  // Logic handles a valid row placement
  checkRowPlacement(puzzleString, row, column, value) {
    // Convertir row a mayúsculas para asegurar consistencia
    row = row.toUpperCase();

    const rows = "ABCDEFGHI";
    const rowIndex = rows.indexOf(row);

    if (rowIndex === -1) return false;

    // Calculamos la posición en el puzzle
    const rowStart = rowIndex * 9;
    const colIndex = parseInt(column) - 1;
    const position = rowStart + colIndex;

    // Si el valor ya está en esa posición, es válido
    if (puzzleString[position] === value) {
      return true;
    }

    // Verificamos si el valor ya existe en esa fila
    const start = rowIndex * 9;
    const end = start + 9;
    const rowValues = puzzleString.slice(start, end);

    // Si el valor ya existe en la fila, la colocación no es válida
    return !rowValues.includes(value);
  }

  // Logic handles a valid column placement
  checkColPlacement(puzzleString, row, column, value) {
    // Convertir row a mayúsculas para asegurar consistencia
    row = row.toUpperCase();

    const rows = "ABCDEFGHI";
    const rowIndex = rows.indexOf(row);

    if (rowIndex === -1) return false;

    // Convertir column a número
    const colIndex = parseInt(column) - 1;

    if (colIndex < 0 || colIndex > 8) return false;

    // Calculamos la posición en el puzzle
    const position = rowIndex * 9 + colIndex;

    // Si el valor ya está en esa posición, es válido
    if (puzzleString[position] === value) {
      return true;
    }

    // Para cada fila, extraemos el valor en esa columna
    for (let i = 0; i < 9; i++) {
      // Calculamos la posición en la cadena del puzzle
      const currentPos = i * 9 + colIndex;

      // Si encontramos el valor en la columna, no se puede colocar
      if (puzzleString[currentPos] === value) {
        return false;
      }
    }

    return true;
  }

  // Logic handles a valid region (3x3 grid) placement
  checkRegionPlacement(puzzleString, row, column, value) {
    // Convertir row a mayúsculas para asegurar consistencia
    row = row.toUpperCase();

    const rows = "ABCDEFGHI";
    const rowIndex = rows.indexOf(row);

    if (rowIndex === -1) return false;

    // Convertir column a número
    const colIndex = parseInt(column) - 1;

    if (colIndex < 0 || colIndex > 8) return false;

    // Calculamos la posición en el puzzle
    const position = rowIndex * 9 + colIndex;

    // Si el valor ya está en esa posición, es válido
    if (puzzleString[position] === value) {
      return true;
    }

    // Identificamos el bloque 3x3 al que pertenece
    const startRow = Math.floor(rowIndex / 3) * 3; // fila inicial del bloque 3x3
    const startCol = Math.floor(colIndex / 3) * 3; // columna inicial del bloque 3x3

    // Recorremos las 9 posiciones de la región 3x3
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        const currentPos = i * 9 + j; // Calculamos la posición en el string del puzzle
        if (puzzleString[currentPos] === value) {
          return false; // Si encontramos el valor, la colocación es inválida
        }
      }
    }

    return true; // Si no hay conflictos, la colocación es válida
  }

  solve(puzzleString) {
    // Validar el puzzle primero
    const validation = this.validate(puzzleString);
    if (validation) {
      return validation;
    }

    // Convertimos el puzzle en un arreglo de 81 celdas
    let board = puzzleString.split("");
    const rows = "ABCDEFGHI"; // Definimos la constante rows
    const self = this; // Guardamos referencia a this para usar dentro de solveBoard

    // Validar que el puzzle tenga una solución única
    // Verificamos que no haya conflictos iniciales en el puzzle
    for (let i = 0; i < 81; i++) {
      if (board[i] !== ".") {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const value = board[i];

        // Guardamos el valor actual
        const temp = board[i];
        board[i] = ".";

        // Verificamos si hay conflictos con ese valor en esa posición
        if (
          !self.checkRowPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            value
          ) ||
          !self.checkColPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            value
          ) ||
          !self.checkRegionPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            value
          )
        ) {
          return "Puzzle cannot be solved";
        }

        // Restauramos el valor
        board[i] = temp;
      }
    }

    // Función para resolver el Sudoku usando backtracking
    function solveBoard() {
      // Encontramos la primera celda vacía (representada por un punto)
      const emptyCellIndex = board.indexOf(".");
      if (emptyCellIndex === -1) return true; // Si no hay celdas vacías, el puzzle está resuelto

      // Calculamos la fila y la columna de la celda vacía
      const row = Math.floor(emptyCellIndex / 9);
      const col = emptyCellIndex % 9;

      // Probamos todos los valores posibles para esa celda
      for (let value = 1; value <= 9; value++) {
        const valueStr = value.toString();

        // Verificamos si es válido colocar este valor en la celda
        if (
          self.checkRowPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            valueStr
          ) &&
          self.checkColPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            valueStr
          ) &&
          self.checkRegionPlacement(
            board.join(""),
            rows[row],
            (col + 1).toString(),
            valueStr
          )
        ) {
          // Colocamos el valor en la celda
          board[emptyCellIndex] = valueStr;

          // Continuamos resolviendo el resto del tablero
          if (solveBoard()) return true;

          // Si llegamos a un punto donde no podemos resolver, retrocedemos
          board[emptyCellIndex] = ".";
        }
      }

      return false; // Si no podemos resolver, retornamos falso
    }

    // Ejecutamos la función de solución
    try {
      if (solveBoard()) {
        return board.join(""); // Retornamos el puzzle resuelto
      } else {
        return "Puzzle cannot be solved"; // Si no se puede resolver, retornamos un mensaje de error
      }
    } catch (error) {
      console.error("Error al resolver el puzzle:", error);
      return "Puzzle cannot be solved";
    }
  }
}

module.exports = SudokuSolver;
