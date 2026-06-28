import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import QrScanner from '../components/QrScanner'
import StudentCard from '../components/StudentCard'
import AttendanceLog from '../components/AttendanceLog'
import { getStudent, getTodayRecord, getTodayAttendance, markAttendance } from '../lib/db'
import type { Student, AttendanceRecord, AttStatus } from '../lib/types'
import s from './Dashboard.module.css'

export default function Dashboard() {
  const [scanActive, setScanActive] = useState(false)
  const [scanning, setScanning] = useState(false)

  const [student, setStudent] = useState<Student | null>(null)
  const [existing, setExisting] = useState<AttendanceRecord | null>(null)
  const [studentError, setStudentError] = useState('')

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [logLoading, setLogLoading] = useState(true)

  const todayLabel = format(new Date(), 'EEEE, d MMMM yyyy', { locale: localeId })

  const stats = {
    hadir: records.filter(r => r.status === 'Hadir').length,
    izin:  records.filter(r => r.status === 'Izin' || r.status === 'Sakit').length,
    alpha: records.filter(r => r.status === 'Alpha').length,
  }

  async function loadLog(showLoading = true) {
    if (showLoading) setLogLoading(true)
    try {
      const data = await getTodayAttendance()
      setRecords(data)
    } catch (e) {
      console.error('loadLog error:', e)
    } finally {
      if (showLoading) setLogLoading(false)
    }
  }

  useEffect(() => { loadLog(true) }, [])

  const handleScan = useCallback(async (qrValue: string) => {
    if (scanning) return
    setScanning(true)
    setScanActive(false)
    setStudentError('')

    const stu = await getStudent(qrValue.trim())
    if (!stu) {
      setStudentError(`Siswa dengan ID "${qrValue}" tidak ditemukan di database.`)
      setStudent(null)
      setScanning(false)
      return
    }

    const rec = await getTodayRecord(stu.id)
    setStudent(stu)
    setExisting(rec)
    setScanning(false)
  }, [scanning])

  async function handleMark(status: AttStatus, catatan?: string) {
    if (!student) return
    const rec = await markAttendance(student, status, catatan)
    setExisting(rec)
    await loadLog(false)
  }

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.logo}>
          <div className={s.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M12 3L2 7l10 4 10-4-10-4z"/><path d="M2 17l10 4 10-4"/><path d="M2 12l10 4 10-4"/>
            </svg>
          </div>
          <div>
            <div className={s.logoText}>STM Ngawi 48</div>
            <div className={s.logoSub}>Sistem Absensi</div>
          </div>
        </div>
        <nav className={s.nav}>
          <a className={`${s.navItem} ${s.navActive}`} href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a className={s.navItem} href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><rect x="7" y="7" width="10" height="10"/></svg>
            Scan QR
          </a>
          <a className={s.navItem} href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            Data Siswa
          </a>
          <a className={s.navItem} href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Laporan
          </a>
        </nav>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <h1 className={s.topTitle}>Dashboard Absensi</h1>
          <span className={s.topDate}>{todayLabel}</span>
        </header>

        <div className={s.content}>
          <div className={s.left}>
            <div className={s.statsRow}>
              <div className={`${s.statCard} ${s.statHadir}`}>
                <div className={s.statLabel}>Hadir</div>
                <div className={s.statNum}>{stats.hadir}</div>
                <div className={s.statBar}>
                  <div className={s.statFill} style={{ width: records.length ? `${stats.hadir / records.length * 100}%` : '0%', background: '#16a34a' }} />
                </div>
              </div>
              <div className={`${s.statCard} ${s.statIzin}`}>
                <div className={s.statLabel}>Izin / Sakit</div>
                <div className={s.statNum}>{stats.izin}</div>
                <div className={s.statBar}>
                  <div className={s.statFill} style={{ width: records.length ? `${stats.izin / records.length * 100}%` : '0%', background: '#ca8a04' }} />
                </div>
              </div>
              <div className={`${s.statCard} ${s.statAlpha}`}>
                <div className={s.statLabel}>Alpha</div>
                <div className={s.statNum}>{stats.alpha}</div>
                <div className={s.statBar}>
                  <div className={s.statFill} style={{ width: records.length ? `${stats.alpha / records.length * 100}%` : '0%', background: '#dc2626' }} />
                </div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Log absensi hari ini</span>
                <span className={s.cardSub}>{records.length} entri</span>
              </div>
              <AttendanceLog records={records} loading={logLoading} />
            </div>
          </div>

          <div className={s.right}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.cardTitle}>Scanner QR</span>
              </div>

              {scanActive ? (
                <>
                  <QrScanner onScan={handleScan} active={scanActive} />
                  <button className={s.btnStop} onClick={() => setScanActive(false)}>
                    Hentikan Scanner
                  </button>
                </>
              ) : (
                <div className={s.scanPlaceholder} onClick={() => { setScanActive(true); setStudent(null); setStudentError('') }}>
                  <div className={s.scanFrame}>
                    <div className={`${s.corner} ${s.tl}`} />
                    <div className={`${s.corner} ${s.tr}`} />
                    <div className={`${s.corner} ${s.bl}`} />
                    <div className={`${s.corner} ${s.br}`} />
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3v0"/>
                    </svg>
                  </div>
                  <p className={s.scanHint}>Klik untuk mulai scan QR siswa</p>
                </div>
              )}

              {scanning && <p className={s.scanStatus}>Memuat data siswa...</p>}
              {studentError && <p className={s.scanError}>{studentError}</p>}
            </div>

            {student && (
              <StudentCard
                student={student}
                existing={existing}
                onMark={handleMark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
