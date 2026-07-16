export function parseArgs(args: string[]): Record<string, string | boolean> {
  const data: Record<string, string | boolean> = {};
  args.forEach((i, ind, arr) => {
    if (i.startsWith("-") || i.startsWith("--")) {
      const key = i.replace(/^--?/, "");
      const next = arr[ind + 1];
      if (next?.startsWith("-") || next?.startsWith("--")) {
        data[key] = true;
      } else {
        data[key] = next || true;
      }
    }
  });
  return data;
}
