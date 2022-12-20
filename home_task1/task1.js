process.stdin.on("data", (data) => {
  if (data.toString().trim() === "") return;

  const dataReversed = data.toString().trim().split("").reverse().join("");
  process.stdout.write(dataReversed + "\n");
  process.stdout.write("\n");
});
