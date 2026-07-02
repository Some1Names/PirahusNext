export type GameTheme = {
  slug: string
  name: string
  color: string
  colorGlow: string
  gradient: string
  icon: string
  image?: string
}

export const games: GameTheme[] = [
  {
    slug: 'dungeon',
    name: 'Dungeon',
    color: '#00e5ff',
    colorGlow: '#00e5ff33',
    gradient: 'linear-gradient(135deg, #00e5ff, #00fff7, #0099cc)',
    icon: '⚔',
    image: '/images/dungeonimg.png',
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    color: '#ff8c42',
    colorGlow: '#ff8c4233',
    gradient: 'linear-gradient(135deg, #ff8c42, #ffb347, #ff5722)',
    icon: '⊞',
    image: '/images/sudokuimg.png',
  },
  {
    slug: 'trace',
    name: 'Trace',
    color: '#a78bfa',
    colorGlow: '#a78bfa33',
    gradient: 'linear-gradient(135deg, #a78bfa, #c084fc, #7c3aed)',
    icon: '▶',
    image: '/images/traceimg.png',
  },
  {
    slug: 'sorting',
    name: 'Sorting',
    color: '#f43f5e',
    colorGlow: '#f43f5e33',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb7185, #be123c)',
    icon: '▮',
    image: '/images/sortingimg.png',
  },
]