// Function to generate Excel-style column names (A, B, C, ..., Z, AA, AB, etc.)
const getExcelColumnName = (index) => {
  let result = "";
  let num = index;

  while (num >= 0) {
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26) - 1;
  }

  return result;
};

// Generate 150 blank columns with Excel-style naming
export const columns = Array.from({ length: 150 }, (_, index) => ({
  prop: `col${index + 1}`,
  name: getExcelColumnName(index), // Excel-style column names: A, B, C, ..., Z, AA, AB, etc.
  size: 120,
  filter: ["string", "selection"],
}));
