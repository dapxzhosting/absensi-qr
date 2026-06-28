import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface Props {
  onScan: (value: string) => void
  active: boolean
}

export default function QrScanner({ onScan, active }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const startedRef = useRef(false)
  const elementId = 'qr-reader'

  useEffect(() => {
    if (!active) {
      stopScanner()
      return
    }
    startScanner()
    return () => { stopScanner() }
  }, [active])

  async function startScanner() {
    if (startedRef.current) return
    startedRef.current = true
    try {
      const scanner = new Html5Qrcode(elementId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => { onScan(decodedText) },
        undefined
      )
    } catch (err) {
      console.error('Scanner error:', err)
      startedRef.current = false
    }
  }

  async function stopScanner() {
    try {
      if (scannerRef.current && startedRef.current) {
        await scannerRef.current.stop()
        scannerRef.current = null
        startedRef.current = false
      }
    } catch (_) {}
  }

  return (
    <div
      id={elementId}
      style={{
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#000',
        minHeight: 220,
      }}
    />
  )
}
