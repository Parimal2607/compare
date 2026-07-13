"use client"

import { useState } from "react"
import Link from "next/link"

type Player = "X" | "O"
type Cell = Player | null

const WINNERS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board: Cell[]): Player | "draw" | null {
  for (const [a, b, c] of WINNERS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  if (board.every((c) => c !== null)) return "draw"
  return null
}

export default function TicTacToePage() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)

  function handleClick(i: number) {
    if (board[i] || winner) return
    const newBoard = [...board]
    newBoard[i] = currentPlayer
    setBoard(newBoard)
    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
  }

  function getStatus() {
    if (winner === "draw") return "It's a draw!"
    if (winner) return `${winner === "X" ? "📱 iPhone" : "🤖 Android"} wins!`
    return `${currentPlayer === "X" ? "📱 iPhone (X)" : "🤖 Android (O)"}'s turn`
  }

  const statusColor = winner === "X" ? "text-violet-600" : winner === "O" ? "text-emerald-600" : "text-gray-900"

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="mb-6">
        <Link href="/games" className="text-sm text-violet-600 hover:text-violet-700">&larr; Back to Games</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Tic-Tac-Toe</h1>
      <p className="mt-2 text-gray-500">iPhone (X) vs Android (O)</p>

      <div className={`mt-2 text-lg font-semibold ${statusColor}`}>{getStatus()}</div>

      <div className="mt-6 grid grid-cols-3 gap-3 mx-auto max-w-xs">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-20 sm:h-24 rounded-xl text-3xl sm:text-4xl font-bold transition-all duration-200 ${
              cell === "X"
                ? "bg-violet-100 text-violet-700"
                : cell === "O"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:shadow-sm"
            } ${!cell && !winner ? "hover:scale-105" : ""}`}
            disabled={!!cell || !!winner}
          >
            {cell === "X" ? "✕" : cell === "O" ? "◯" : ""}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          Play Again
        </button>
        <Link
          href="/games"
          className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          More Games
        </Link>
      </div>
    </div>
  )
}
