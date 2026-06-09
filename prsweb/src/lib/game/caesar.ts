export function caesarEncrypt(text: string, shift: number): string {
  return text
    .split("")
    .map((c) => {
      if (/[a-z]/.test(c)) {
        const base = "a".charCodeAt(0);
        return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
      }
      return c;
    })
    .join("");
}

export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}