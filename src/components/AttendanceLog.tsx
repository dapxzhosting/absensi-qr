import type { AttendanceRecord, AttStatus } from '../lib/types'
import s from './AttendanceLog.module.css'

interface Props {
  records: AttendanceRecord[]
  loading: boolean
}

const statusStyle: Record<AttStatus, { bg: string; color: string }> = {
  Hadir: { bg: '#dcfce7', color: '#16a34a' },
  Izin:  { bg: '#fef9c3', color: '#ca8a04' },
  Sakit: { bg: '#dbeafe', color: '#1d4ed8' },
  Alpha: { bg: '#fee2e2', color: '#dc2626' },
}

const AVATAR_COLORS = [
  '#3B82F6','#EC4899','#10B981','#F59E0B','#8B5CF6',
  '#EF4444','#06B6D4','#84CC16','#F97316','#6366F1',
]

function avatarColor(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function AttendanceLog({ records, loading }: Props) {
  if (loading) {
    return <div className={s.empty}>Memuat data...</div>
  }

  if (!records.length) {
    return (
      <div className={s.empty}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 8, color: '#d1d5db' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
        </svg>
        Belum ada absensi hari ini.<br />Scan QR siswa untuk memulai.
      </div>
    )
  }

  return (
    <div className={s.list}>
      {records.map((r, i) => {
        const st = r.status as AttStatus
        const color = avatarColor(r.studentName)
        return (
          <div key={r.id ?? i} className={s.item}>
            <div className={s.avatar} style={{ background: color + '22', color }}>
              {initials(r.studentName)}
            </div>
            <div className={s.info}>
              <div className={s.name}>{r.studentName}</div>
              <div className={s.sub}>{r.studentNisn} · {r.kelas}</div>
              {r.catatan && <div className={s.catatan}>{r.catatan}</div>}
            </div>
            <span className={s.badge} style={statusStyle[st]}>{r.status}</span>
            <span className={s.time}>{r.time}</span>
          </div>
        )
      })}
    </div>
  )
}
