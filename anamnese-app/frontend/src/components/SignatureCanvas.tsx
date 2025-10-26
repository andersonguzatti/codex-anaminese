import React, { useEffect, useRef, useState } from 'react'

type Props = {
  height?: number
  onChange?: (dataUrl: string | null) => void
}

export default function SignatureCanvas({ height = 220, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const getCtx = () => canvasRef.current?.getContext('2d')!

  const resize = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    const ctx = getCtx()
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#111827'
    clear(false)
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const point = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return { x, y }
  }

  const start = (e: React.PointerEvent) => {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    const { x, y } = point(e)
    const ctx = getCtx()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const { x, y } = point(e)
    const ctx = getCtx()
    ctx.lineTo(x, y)
    ctx.stroke()
    if (isEmpty) setIsEmpty(false)
  }

  const end = (e: React.PointerEvent) => {
    if (!drawing.current) return
    drawing.current = false
    canvasRef.current?.releasePointerCapture(e.pointerId)
    onChange?.(canvasRef.current?.toDataURL('image/png') ?? null)
  }

  const clear = (notify = true) => {
    const ctx = getCtx()
    const canvas = canvasRef.current!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    if (notify) onChange?.(null)
    // draw a light guide line
    ctx.save()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(16, height - 40)
    ctx.lineTo(canvas.width, height - 40)
    ctx.stroke()
    ctx.restore()
  }

  return (
    <div>
      <div ref={containerRef} className="w-full border rounded-md bg-white">
        <canvas
          ref={canvasRef}
          className="touch-none block w-full"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-500">
          {isEmpty ? 'Assine no campo acima' : 'Toque em Limpar para refazer'}
        </span>
        <button
          type="button"
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          onClick={() => clear(true)}
        >
          Limpar
        </button>
      </div>
    </div>
  )
}

