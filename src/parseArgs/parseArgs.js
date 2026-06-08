const path = require("path");

function parseArgs(args) {
  const data = {};
  args.forEach((i, ind, arr) => {
    if (i.startsWith("-") || i.startsWith("--")) {
      const key = i.replace(/^--?/, "");
      const next = arr[ind + 1];
      if (next?.startsWith("-") || next?.startsWith("--")) {
        data[key] = true;
      } else {
        data[key] = next;
      }
    }
  });
  return data;
}

function buildPathInfo(pathParts) {
  const fullPath = path.join(...pathParts);
  const isAbsolute = path.isAbsolute(fullPath);
  return { fullPath, isAbsolute }
}

// Примеры для тестирования
const testPaths1 = ["home", "user", "documents", "file.txt"];
const testPaths2 = ["/", "var", "log", "app.log"];
const testPaths3 = ["..", "parent", "folder"];
