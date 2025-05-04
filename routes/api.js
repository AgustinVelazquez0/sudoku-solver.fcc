"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  // Ruta para verificar una colocación de número en una posición
  app.route("/api/check").post((req, res) => {
    // Aceptar tanto puzzle como puzzleString para mayor compatibilidad
    const puzzleString = req.body.puzzle || req.body.puzzleString;
    const { coordinate, value } = req.body;

    // Validar que los campos no estén vacíos
    if (!puzzleString || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    // Validar el formato de la coordenada
    if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    // Validar el valor
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    // Validar el puzzle
    const puzzleValidation = solver.validate(puzzleString);
    if (puzzleValidation) {
      return res.json({ error: puzzleValidation });
    }

    const row = coordinate[0];
    const col = coordinate[1];

    // Calcular la posición en el string
    const rows = "ABCDEFGHI";
    const rowIndex = rows.indexOf(row.toUpperCase());
    const colIndex = parseInt(col) - 1;
    const position = rowIndex * 9 + colIndex;

    // Verificar si el valor ya está en esa posición
    if (puzzleString[position] === value) {
      return res.json({ valid: true });
    }

    // Verificar conflictos
    const conflict = [];
    if (!solver.checkRowPlacement(puzzleString, row, col, value)) {
      conflict.push("row");
    }
    if (!solver.checkColPlacement(puzzleString, row, col, value)) {
      conflict.push("column");
    }
    if (!solver.checkRegionPlacement(puzzleString, row, col, value)) {
      conflict.push("region");
    }

    // Si hay conflictos, devolverlos
    if (conflict.length > 0) {
      return res.json({ valid: false, conflict });
    }

    // Si no hay conflictos, es válido
    return res.json({ valid: true });
  });

  // Ruta para resolver el Sudoku
  app.route("/api/solve").post((req, res) => {
    // Aceptar tanto puzzle como puzzleString para mayor compatibilidad
    const puzzleString = req.body.puzzle || req.body.puzzleString;

    // Validar que se haya enviado el puzzleString
    if (!puzzleString) {
      return res.json({ error: "Required field missing" });
    }

    // Validar el puzzle
    const validation = solver.validate(puzzleString);
    if (validation) {
      return res.json({ error: validation });
    }

    try {
      // Resolver el Sudoku
      const solution = solver.solve(puzzleString);

      // Si no se puede resolver, devolver error
      if (solution === "Puzzle cannot be solved") {
        return res.json({ error: "Puzzle cannot be solved" });
      }

      // Devolver la solución
      return res.json({ solution });
    } catch (error) {
      console.error("Error al resolver el puzzle:", error);
      return res.json({ error: "Puzzle cannot be solved" });
    }
  });
};
