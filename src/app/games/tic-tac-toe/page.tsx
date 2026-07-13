"use client"

import { useState, useEffect } from "react"
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

function getAvailableMoves(board: Cell[]): number[] {
  return board.reduce<number[]>((acc, c, i) => (c === null ? [...acc, i] : acc), [])
}

function aiMove(board: Cell[], ai: Player, human: Player): number {
  const available = getAvailableMoves(board)

  // 1. Win if possible
  for (const i of available) {
    const test = [...board]
    test[i] = ai
    if (checkWinner(test) === ai) return i
  }

  // 2. Block opponent win
  for (const i of available) {
    const test = [...board]
    test[i] = human
    if (checkWinner(test) === human) return i
  }

  // 3. Take center
  if (available.includes(4)) return 4

  // 4. Take random corner
  const corners = available.filter((i) => [0, 2, 6, 8].includes(i))
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]

  // 5. Take random side
  return available[Math.floor(Math.random() * available.length)]
}

export default function TicTacToePage() {
  const [phase, setPhase] = useState<"pick" | "play" | "done">("pick")
  const [humanPlayer, setHumanPlayer] = useState<Player>("X")
  const [computerPlayer, setComputerPlayer] = useState<Player>("O")
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  function pickSide(side: Player) {
    setHumanPlayer(side)
    setComputerPlayer(side === "X" ? "O" : "X")
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setPhase("play")
  }

  function handleCellClick(i: number) {
    if (board[i] || winner || isComputerThinking || phase !== "play") return
    if (currentPlayer !== humanPlayer) return

    const newBoard = [...board]
    newBoard[i] = humanPlayer
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result)
      setPhase("done")
      return
    }

    setCurrentPlayer(computerPlayer)
  }

  useEffect(() => {
    if (currentPlayer === computerPlayer && !winner && phase === "play") {
      setIsComputerThinking(true)
      const timer = setTimeout(() => {
        const move = aiMove(board, computerPlayer, humanPlayer)
        const newBoard = [...board]
        newBoard[move] = computerPlayer
        setBoard(newBoard)

        const result = checkWinner(newBoard)
        if (result) {
          setWinner(result)
          setPhase("done")
        } else {
          setCurrentPlayer(humanPlayer)
        }
        setIsComputerThinking(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, computerPlayer, humanPlayer, board, winner, phase])

  function reset() {
    setPhase("pick")
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setIsComputerThinking(false)
  }

  function playAgain() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setIsComputerThinking(false)
    setPhase("play")
  }

  function getStatus() {
    if (phase === "pick") return ""
    if (winner === "draw") return "It's a draw!"
    if (winner) {
      const w = winner === humanPlayer ? "You" : "Computer"
      return `${w} win${w === "You" ? "" : "s"}!`
    }
    if (isComputerThinking) return "Computer is thinking..."
    if (currentPlayer === humanPlayer) return "Your turn"
    return "..."
  }

  const statusColor = winner === humanPlayer
    ? "text-emerald-600"
    : winner === computerPlayer
    ? "text-red-600"
    : "text-gray-900"

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="mb-6">
        <Link href="/games" className="text-sm text-violet-600 hover:text-violet-700">&larr; Back to Games</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Phone Tic-Tac-Toe</h1>
      <p className="mt-2 text-gray-500">You vs Computer — iPhone vs Android</p>

      {phase === "pick" && (
        <div className="mt-10">
          <p className="text-sm font-medium text-gray-600 mb-6">Pick your side:</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => pickSide("X")}
              className="group flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-2 border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100 hover:scale-105 transition-all"
            >
              <span className="text-4xl font-bold">✕</span>
              <span className="mt-1 text-xs font-semibold">iPhone</span>
            </button>
            <button
              onClick={() => pickSide("O")}
              className="group flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100 hover:scale-105 transition-all"
            >
              <span className="text-4xl font-bold">◯</span>
              <span className="mt-1 text-xs font-semibold">Android</span>
            </button>
          </div>
        </div>
      )}

      {phase !== "pick" && (
        <>
          <div className={`mt-6 text-lg font-semibold ${statusColor}`}>{getStatus()}</div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="text-violet-600 font-bold">✕</span> You ({humanPlayer === "X" ? "iPhone" : "Android"})</span>
            <span className="text-gray-300">VS</span>
            <span className="flex items-center gap-1"><span className="text-emerald-600 font-bold">◯</span> Computer ({computerPlayer === "O" ? "Android" : "iPhone"})</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 mx-auto max-w-xs">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                className={`h-20 sm:h-24 rounded-xl text-3xl sm:text-4xl font-bold transition-all duration-200 ${
                  cell === "X"
                    ? "bg-violet-100 text-violet-700"
                    : cell === "O"
                    ? "bg-emerald-100 text-emerald-700"
                    : currentPlayer === humanPlayer && !winner && !isComputerThinking
                    ? "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:shadow-sm hover:scale-105"
                    : "bg-gray-50"
                }`}
                disabled={!!cell || !!winner || isComputerThinking || currentPlayer !== humanPlayer}
              >
                {cell === "X" ? "✕" : cell === "O" ? "◯" : ""}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {winner ? (
              <button
                onClick={playAgain}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                Play Again
              </button>
            ) : null}
            <button
              onClick={reset}
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              {winner ? "Change Side" : "Reset"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
