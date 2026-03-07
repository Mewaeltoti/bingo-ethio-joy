import fs from "fs";

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function pickNumbers(min, max, count) {
  const nums = [];
  for (let i = min; i <= max; i++) nums.push(i);
  return shuffle(nums).slice(0, count);
}

function generateCartela(id) {
  const B = pickNumbers(1, 15, 5);
  const I = pickNumbers(16, 30, 5);
  const N = pickNumbers(31, 45, 4);
  const G = pickNumbers(46, 60, 5);
  const O = pickNumbers(61, 75, 5);

  return {
    id: id.toString(),
    numbers: [
      [B[0], I[0], N[0], G[0], O[0]],
      [B[1], I[1], N[1], G[1], O[1]],
      [B[2], I[2], 0,    G[2], O[2]], // FREE space
      [B[3], I[3], N[2], G[3], O[3]],
      [B[4], I[4], N[3], G[4], O[4]],
    ],
    is_used: false
  };
}

const TOTAL = 1000; // change later

const cartelas = [];

for (let i = 1; i <= TOTAL; i++) {
  cartelas.push(generateCartela(i));
}

fs.writeFileSync(
  "./src/data/cartelas.json",
  JSON.stringify(cartelas, null, 2)
);

console.log(`✅ ${TOTAL} casino-style cartelas generated`);