import Link from "next/link";

export default function MinigamesPage() {
  return (
    <div className="lobby">
      <p className="lobby-title">Select Minigame</p>

      <div className="cards">
        <Link className="card dungeon" href="/minigames/dungeon">
          <div className="card-header">Dungeon</div>

          <div className="card-art">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>

            <div className="art-placeholder">
              <span className="art-icon">🗡</span>
              <span>your art here</span>
            </div>
          </div>

          <div className="card-footer">
            <div className="card-name">Dungeon</div>

            <div className="card-bottom">
              <div className="card-icon">⚔</div>
              <div className="card-play">PLAY ▶</div>
            </div>
          </div>
        </Link>

        <Link className="card mystery" href="/minigames/mysterybox">
          <div className="card-header">Mystery Box</div>

          <div className="card-art">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>

            <div className="art-placeholder">
              <span className="art-icon">✦</span>
              <span>your art here</span>
            </div>
          </div>

          <div className="card-footer">
            <div className="card-name">Mystery Box</div>

            <div className="card-bottom">
              <div className="card-icon">✦</div>
              <div className="card-play">PLAY ▶</div>
            </div>
          </div>
        </Link>

        <Link className="card sudoku" href="/minigames/sudoku">
          <div className="card-header">Sudoku</div>

          <div className="card-art">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>

            <div className="art-placeholder">
              <span className="art-icon">⊞</span>
              <span>your art here</span>
            </div>
          </div>

          <div className="card-footer">
            <div className="card-name">Sudoku</div>

            <div className="card-bottom">
              <div className="card-icon">⊞</div>
              <div className="card-play">PLAY ▶</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}