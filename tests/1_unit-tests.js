const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    const validPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    // Si el método valida correctamente, no debe devolver ningún error
    assert.equal(solver.validate(validPuzzle), undefined);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const invalidCharPuzzle =
      "1.5..2.84..63.12.7.2..5a....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    // El método probablemente devuelve un mensaje de error específico
    assert.equal(
      solver.validate(invalidCharPuzzle),
      "Invalid characters in puzzle"
    );
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const shortPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3";
    // El método probablemente devuelve un mensaje de error específico
    assert.equal(
      solver.validate(shortPuzzle),
      "Expected puzzle to be 81 characters long"
    );
  });

  test("Logic handles a valid row placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A"; // Usando letras para las filas
    const column = "2"; // Usando strings para las columnas
    const value = "3";
    assert.equal(solver.checkRowPlacement(puzzle, row, column, value), true);
  });

  test("Logic handles an invalid row placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = "2";
    const value = "1"; // 1 already exists in row A
    assert.equal(solver.checkRowPlacement(puzzle, row, column, value), false);
  });

  test("Logic handles a valid column placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = "2";
    const value = "3";
    assert.equal(solver.checkColPlacement(puzzle, row, column, value), true);
  });

  test("Logic handles an invalid column placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = "2";
    const value = "6"; // 6 already exists in column 2
    assert.equal(solver.checkColPlacement(puzzle, row, column, value), false);
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = "2";
    const value = "3";
    assert.equal(solver.checkRegionPlacement(puzzle, row, column, value), true);
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = "2";
    const value = "5"; // 5 already exists in the 3x3 region
    assert.equal(
      solver.checkRegionPlacement(puzzle, row, column, value),
      false
    );
  });

  test("Valid puzzle strings pass the solver", () => {
    const validPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const solution = solver.solve(validPuzzle);
    // Tu método solve devuelve directamente la solución como string
    assert.isString(solution);
    assert.lengthOf(solution, 81);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const invalidPuzzle =
      "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.solve(invalidPuzzle);
    // Tu método solve devuelve un mensaje de error como string
    assert.equal(result, "Puzzle cannot be solved");
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const expectedSolution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    const solution = solver.solve(puzzle);
    // Verificar que la solución es la esperada
    assert.equal(solution, expectedSolution);
  });
});
