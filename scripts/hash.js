async function generateHash() {
  const { default: bcrypt } = await import("bcryptjs");
  const password = "SuperSecure123"; // change if you want
  const hash = await bcrypt.hash(password, 10);
  console.log("\nYour hashed password:\n");
  console.log(hash);
}

generateHash();
