const COIN_KEY = "pirahus_coins";
const STARTING_COINS = 3;

export function getCoins(): number {
  const stored = localStorage.getItem(COIN_KEY);
  if (stored === null) {
    localStorage.setItem(COIN_KEY, String(STARTING_COINS));
    return STARTING_COINS;
  }
  return parseInt(stored, 10);
}

export function spendCoin(): boolean {
  const coins = getCoins();
  if (coins <= 0) return false;
  localStorage.setItem(COIN_KEY, String(coins - 1));
  return true;
}

export function addCoins(amount: number): void {
  const coins = getCoins();
  localStorage.setItem(COIN_KEY, String(coins + amount));
}