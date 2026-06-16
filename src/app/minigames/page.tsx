import Link from 'next/link'

function Lobby() {
  return (
    <div>
      <div>lobby</div>

      <Link href="/minigames/dungeon">
        <button>dungeon</button>
      </Link>
      <Link href="/minigames/mysterybox">
        <button>mystery box</button>
      </Link>
      <Link href="/minigames/sudoku">
        <button>sudoku</button>
      </Link>
    </div>
  )
}

export default Lobby