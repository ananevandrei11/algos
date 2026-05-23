export function isValidParentheses(s: string): boolean {
  if (s.length % 2 !== 0) {
    return false;
  }
  const mapSymbols: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  const opened: string[] = [];

  for (let i = 0; i < s.length; i++) {
    console.log(opened);
    if (mapSymbols[s[i]]) {
      opened.push(s[i]);
    } else {
      if (mapSymbols[opened.pop()!] !== s[i]) return false;
    }
  }

  return opened.length === 0;
}

