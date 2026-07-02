import { Question } from "./types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMCQ(answer: string, wrongs: string[]): string[] {
  return shuffle([answer, ...wrongs.slice(0, 3)]);
}

export const QUESTION_POOL: Question[] = [
  // easy
  { language: "python", type: "type", timeBonus: 8, code: `x = 5\ny = 3\nprint(x + y)`, answer: "8" },
  { language: "python", type: "type", timeBonus: 8, code: `a = 10\nb = a // 3\nprint(b)`, answer: "3" },
  { language: "python", type: "type", timeBonus: 8, code: `x = 7\nif x > 5:\n    print("big")\nelse:\n    print("small")`, answer: "big" },
  { language: "python", type: "type", timeBonus: 8, code: `s = "hello"\nprint(len(s))`, answer: "5" },
  { language: "python", type: "type", timeBonus: 8, code: `x = 2\ny = x ** 3\nprint(y)`, answer: "8" },
  { language: "python", type: "type", timeBonus: 8, code: `items = [1, 2, 3, 4]\nprint(items[-1])`, answer: "4" },
  { language: "python", type: "type", timeBonus: 8, code: `x = 9\ny = 4\nprint(x % y)`, answer: "1" },
  { language: "python", type: "type", timeBonus: 8, code: `s = "code"\nprint(s.upper())`, answer: "CODE" },
  { language: "python", type: "type", timeBonus: 8, code: `nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))`, answer: "4" },
  { language: "python", type: "type", timeBonus: 8, code: `x = True\ny = False\nprint(x and y)`, answer: "False" },
  { language: "python", type: "type", timeBonus: 8, code: `a = "ab"\nb = "cd"\nprint(a + b)`, answer: "abcd" },
  { language: "python", type: "type", timeBonus: 8, code: `x = 3\nx += 4\nprint(x)`, answer: "7" },

  // medium
  { language: "python", type: "type", timeBonus: 12, code: `total = 0\nfor i in range(4):\n    total += i\nprint(total)`, answer: "6" },
  { language: "python", type: "type", timeBonus: 12, code: `x = 1\nwhile x < 16:\n    x *= 2\nprint(x)`, answer: "16" },
  { language: "python", type: "type", timeBonus: 12, code: `def f(n):\n    return n * 2 + 1\n\nprint(f(f(3)))`, answer: "15" },
  { language: "python", type: "type", timeBonus: 12, code: `count = 0\nfor i in range(10):\n    if i % 3 == 0:\n        count += 1\nprint(count)`, answer: "4" },
  { language: "python", type: "type", timeBonus: 12, code: `a = [1, 2, 3]\nb = a[::-1]\nprint(b[0])`, answer: "3" },
  { language: "python", type: "type", timeBonus: 12, code: `x = 5\nresult = 1\nfor i in range(1, x):\n    result *= i\nprint(result)`, answer: "24" },
  { language: "python", type: "type", timeBonus: 12, code: `def mystery(a, b):\n    if a > b:\n        return a - b\n    return b - a\n\nprint(mystery(3, 8))`, answer: "5" },
  { language: "python", type: "type", timeBonus: 12, code: `d = {"a": 1, "b": 2}\nd["c"] = 3\nprint(len(d))`, answer: "3" },
  { language: "python", type: "type", timeBonus: 12, code: `def f(x):\n    return x[::2]\n\nprint(f("abcdef"))`, answer: "ace" },
  { language: "python", type: "type", timeBonus: 12, code: `total = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        total += i\nprint(total)`, answer: "6" },
  { language: "python", type: "type", timeBonus: 12, code: `nums = [3, 1, 4, 1, 5]\nprint(sorted(nums)[2])`, answer: "3" },
  { language: "python", type: "type", timeBonus: 12, code: `x = 2\ny = 3\nz = x * y + x ** 2\nprint(z)`, answer: "10" },
  { language: "python", type: "type", timeBonus: 12, code: `def f(n, acc=1):\n    if n <= 1:\n        return acc\n    return f(n - 1, acc * n)\n\nprint(f(4))`, answer: "24" },

  // hard
  { language: "python", type: "mcq", timeBonus: 18, code: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(6))`, answer: "8", choices: makeMCQ("8", ["6", "13", "5"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `def f(lst, n):\n    if n == 0:\n        return 0\n    return lst[n-1] + f(lst, n-1)\n\nprint(f([1,2,3,4,5], 4))`, answer: "10", choices: makeMCQ("10", ["15", "4", "6"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `x = [[i*j for j in range(3)]\n      for i in range(3)]\nprint(x[2][2])`, answer: "4", choices: makeMCQ("4", ["6", "2", "9"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `def count(s, c):\n    return sum(1 for ch in s if ch == c)\n\nprint(count("mississippi", "s"))`, answer: "4", choices: makeMCQ("4", ["3", "5", "2"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `stack = []\nfor i in [1,2,3,4]:\n    stack.append(i)\nstack.pop()\nstack.pop()\nprint(stack[-1])`, answer: "2", choices: makeMCQ("2", ["3", "1", "4"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `def g(n, acc=0):\n    if n == 0:\n        return acc\n    return g(n-1, acc+n)\n\nprint(g(5))`, answer: "15", choices: makeMCQ("15", ["10", "20", "5"]) },
  { language: "python", type: "mcq", timeBonus: 20, code: `memo = {}\ndef dp(n):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = dp(n-1) + dp(n-2)\n    return memo[n]\n\nprint(dp(7))`, answer: "13", choices: makeMCQ("13", ["8", "21", "12"]) },
  { language: "python", type: "mcq", timeBonus: 20, code: `def mystery(n):\n    if n == 1: return 0\n    if n % 2 == 0:\n        return 1 + mystery(n // 2)\n    return 1 + mystery(3*n + 1)\n\nprint(mystery(6))`, answer: "8", choices: makeMCQ("8", ["6", "9", "7"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `def swap_pairs(lst):\n    for i in range(0, len(lst) - 1, 2):\n        lst[i], lst[i+1] = lst[i+1], lst[i]\n    return lst\n\nprint(swap_pairs([1,2,3,4,5,6])[3])`, answer: "4", choices: makeMCQ("4", ["3", "5", "6"]) },
  { language: "python", type: "mcq", timeBonus: 18, code: `def f(n):\n    result = []\n    while n > 0:\n        result.append(n % 2)\n        n //= 2\n    return result\n\nprint(f(13))`, answer: "[1, 0, 1, 1]", choices: makeMCQ("[1, 0, 1, 1]", ["[1, 1, 0, 1]", "[0, 1, 0, 1]", "[1, 0, 1, 0]"]) },
  { language: "python", type: "mcq", timeBonus: 20, code: `def merge(a, b):\n    result = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] < b[j]:\n            result.append(a[i]); i += 1\n        else:\n            result.append(b[j]); j += 1\n    return result + a[i:] + b[j:]\n\nprint(merge([1,3,5], [2,4])[2])`, answer: "3", choices: makeMCQ("3", ["2", "4", "5"]) },
  { language: "python", type: "mcq", timeBonus: 20, code: `def f(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 2: return 1\n    memo[n] = f(n-1, memo) + f(n-2, memo)\n    return memo[n]\n\nprint(f(8))`, answer: "13", choices: makeMCQ("13", ["21", "8", "11"]) },
];

export function buildQuestionSet(): Question[] {
  const easy   = shuffle(QUESTION_POOL.filter((q) => q.type === "type" && q.timeBonus === 8));
  const medium = shuffle(QUESTION_POOL.filter((q) => q.type === "type" && q.timeBonus === 12));
  const hard   = shuffle(QUESTION_POOL.filter((q) => q.type === "mcq"));
  return [...easy.slice(0, 3), ...medium.slice(0, 3), ...hard.slice(0, 4)];
}