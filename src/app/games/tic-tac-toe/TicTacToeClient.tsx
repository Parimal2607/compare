"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"

type Player = "A" | "B"
type Cell = Player | null

interface PhoneOption {
  name: string
  slug: string
  image: string
}

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
  for (const i of available) {
    const test = [...board]; test[i] = ai
    if (checkWinner(test) === ai) return i
  }
  for (const i of available) {
    const test = [...board]; test[i] = human
    if (checkWinner(test) === human) return i
  }
  if (available.includes(4)) return 4
  const corners = available.filter((i) => [0, 2, 6, 8].includes(i))
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]
  return available[Math.floor(Math.random() * available.length)]
}

export default function TicTacToeClient({ products }: { products: PhoneOption[] }) {
  const [phase, setPhase] = useState<"pick-phones" | "pick-side" | "play" | "done">("pick-phones")
  const [phoneA, setPhoneA] = useState<PhoneOption | null>(null)
  const [phoneB, setPhoneB] = useState<PhoneOption | null>(null)
  const [searchA, setSearchA] = useState("")
  const [searchB, setSearchB] = useState("")
  const [showDropA, setShowDropA] = useState(false)
  const [showDropB, setShowDropB] = useState(false)
  const [humanSide, setHumanSide] = useState<Player>("A")
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("A")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const filterA = useMemo(() => {
    if (!searchA.trim()) return []
    const q = searchA.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q) && p.slug !== phoneB?.slug)
  }, [products, searchA, phoneB])

  const filterB = useMemo(() => {
    if (!searchB.trim()) return []
    const q = searchB.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q) && p.slug !== phoneA?.slug)
  }, [products, searchB, phoneA])

  function selectPhoneA(p: PhoneOption) {
    setPhoneA(p)
    setSearchA("")
    setShowDropA(false)
  }

  function selectPhoneB(p: PhoneOption) {
    setPhoneB(p)
    setSearchB("")
    setShowDropB(false)
  }

  function goToPickSide() {
    if (phoneA && phoneB) setPhase("pick-side")
  }

  function startGame(side: Player) {
    setHumanSide(side)
    setBoard(Array(9).fill(null))
    setCurrentPlayer("A")
    setWinner(null)
    setPhase("play")
  }

  function handleCellClick(i: number) {
    if (board[i] || winner || isComputerThinking || phase !== "play") return
    if (currentPlayer !== humanSide) return
    const newBoard = [...board]
    newBoard[i] = humanSide
    setBoard(newBoard)
    const result = checkWinner(newBoard)
    if (result) { setWinner(result); setPhase("done"); return }
    setCurrentPlayer(humanSide === "A" ? "B" : "A")
  }

  useEffect(() => {
    const computerSide = humanSide === "A" ? "B" : "A"
    if (currentPlayer === computerSide && !winner && phase === "play") {
      setIsComputerThinking(true)
      const timer = setTimeout(() => {
        const move = aiMove(board, computerSide, humanSide)
        const newBoard = [...board]
        newBoard[move] = computerSide
        setBoard(newBoard)
        const result = checkWinner(newBoard)
        if (result) { setWinner(result); setPhase("done") }
        else { setCurrentPlayer(humanSide) }
        setIsComputerThinking(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, humanSide, board, winner, phase])

  function resetAll() {
    setPhase("pick-phones")
    setPhoneA(null); setPhoneB(null)
    setBoard(Array(9).fill(null))
    setWinner(null)
  }

  function playAgain() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("A")
    setWinner(null)
    setPhase("play")
  }

  function getStatus() {
    if (winner === "draw") return "It's a draw!"
    if (winner) {
      const w = winner === humanSide ? "You" : "Computer"
      return `${w} win${w === "You" ? "" : "s"}!`
    }
    if (isComputerThinking) return "Computer is thinking..."
    if (currentPlayer === humanSide) return "Your turn"
    return "..."
  }

  const statusColor = winner === humanSide ? "text-emerald-600"
    : winner && winner !== humanSide ? "text-red-600"
    : "text-gray-900"

  const computerSide = humanSide === "A" ? "B" : "A"

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="mb-6">
        <Link href="/games" className="text-sm text-violet-600 hover:text-violet-700">&larr; Back to Games</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Phone Tic-Tac-Toe</h1>
      <p className="mt-2 text-gray-500">Pick two phones and battle the computer!</p>

      {phase === "pick-phones" && (
        <div className="mt-8 space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 block text-left mb-1">Phone A (Your piece)</label>
            <input
              type="text" value={searchA}
              onChange={(e) => { setSearchA(e.target.value); setShowDropA(true) }}
              onFocus={() => setShowDropA(true)}
              onBlur={() => setTimeout(() => setShowDropA(false), 200)}
              placeholder="Search phones..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
            />
            {showDropA && filterA.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-40 overflow-y-auto">
                {filterA.map((p) => (
                  <button key={p.slug} onMouseDown={() => selectPhoneA(p)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            {phoneA && (
              <div className="mt-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 text-left">
                Selected: {phoneA.name}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-xs font-medium text-gray-500 block text-left mb-1">Phone B (Computer&apos;s piece)</label>
            <input
              type="text" value={searchB}
              onChange={(e) => { setSearchB(e.target.value); setShowDropB(true) }}
              onFocus={() => setShowDropB(true)}
              onBlur={() => setTimeout(() => setShowDropB(false), 200)}
              placeholder="Search phones..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
            />
            {showDropB && filterB.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-40 overflow-y-auto">
                {filterB.map((p) => (
                  <button key={p.slug} onMouseDown={() => selectPhoneB(p)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            {phoneB && (
              <div className="mt-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 text-left">
                Selected: {phoneB.name}
              </div>
            )}
          </div>

          <button
            onClick={goToPickSide}
            disabled={!phoneA || !phoneB}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next: Choose Your Side
          </button>
        </div>
      )}

      {phase === "pick-side" && phoneA && phoneB && (
        <div className="mt-10">
          <p className="text-sm font-medium text-gray-600 mb-6">Which phone do you want to play as?</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => startGame("A")}
              className="group flex flex-col items-center rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 hover:border-violet-400 hover:bg-violet-100 hover:scale-105 transition-all"
            >
              <span className="text-2xl font-bold text-violet-700 mb-1">✕</span>
              <span className="text-sm font-semibold text-violet-800">{phoneA.name}</span>
              <span className="text-xs text-violet-500 mt-1">You</span>
            </button>
            <button
              onClick={() => startGame("B")}
              className="group flex flex-col items-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 hover:border-emerald-400 hover:bg-emerald-100 hover:scale-105 transition-all"
            >
              <span className="text-2xl font-bold text-emerald-700 mb-1">◯</span>
              <span className="text-sm font-semibold text-emerald-800">{phoneB.name}</span>
              <span className="text-xs text-emerald-500 mt-1">You</span>
            </button>
          </div>
          <button onClick={resetAll} className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            &larr; Pick different phones
          </button>
        </div>
      )}

      {(phase === "play" || phase === "done") && phoneA && phoneB && (
        <>
          <div className={`mt-6 text-lg font-semibold ${statusColor}`}>{getStatus()}</div>

          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-violet-600 font-bold">✕</span>
              {humanSide === "A" ? "You: " : "Computer: "}
              {humanSide === "A" ? phoneA.name : phoneB.name}
            </span>
            <span className="text-gray-300">VS</span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-bold">◯</span>
              {humanSide === "B" ? "You: " : "Computer: "}
              {humanSide === "B" ? phoneB.name : phoneA.name}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 mx-auto max-w-xs">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                className={`h-20 sm:h-24 rounded-xl text-3xl sm:text-4xl font-bold transition-all duration-200 ${
                  cell === "A"
                    ? "bg-violet-100 text-violet-700"
                    : cell === "B"
                    ? "bg-emerald-100 text-emerald-700"
                    : currentPlayer === humanSide && !winner && !isComputerThinking
                    ? "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:shadow-sm hover:scale-105"
                    : "bg-gray-50"
                }`}
                disabled={!!cell || !!winner || isComputerThinking || currentPlayer !== humanSide}
              >
                {cell === "A" ? "✕" : cell === "B" ? "◯" : ""}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {winner && (
              <button onClick={playAgain}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                Play Again
              </button>
            )}
            <button onClick={resetAll}
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              New Phones
            </button>
          </div>
        </>
      )}
    </div>
  )
}
