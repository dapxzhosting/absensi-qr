import { useState } from 'react'
import type { Student, AttendanceRecord, AttStatus } from '../lib/types'
import s from './StudentCard.module.css'

interface Props {
  student: Student
  existing: AttendanceRecord | null
  onMark: (status: AttStatus, catatan?: string) => Promise<void>
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

const STATUS_OPTIONS: AttStatus[] = ['Hadir', 'Izin', 'Sakit', 'Alpha']

const statusStyle: Record<AttStatus, { bg: string; color: string }> = {
  Hadir: { bg: '#dcfce7', color: '#16a34a' },
  Izin:  { bg: '#fef9c3', color: '#ca8a04' },
  Sakit: { bg: '#dbeafe', color: '#1d4ed8' },
  Alpha: { bg: '#fee2e2', color: '#dc2626' },
}

export default function StudentCard({ student, existing, onMark }: Props) {
  const [loading, setLoading] = useState(false)
  const [catatan, setCatatan] = useState(existing?.catatan ?? '')
  const [activeStatus, setActiveStatus] = useState<AttStatus | null>(existing?.status ?? null)

  const color = avatarColor(student.name)

  async function handleMark(status: AttStatus) {
    setLoading(true)
    setActiveStatus(status)
    await onMark(status, catatan)
    setLoading(false)
  }

  return (
    <div className={s.card}>
      {/* Header siswa */}
      <div className={s.top}>
        {student.fotoUrl ? (
          <img src={student.fotoUrl} alt={student.name} className={s.avatar} />
        ) : (
          <div className={s.avatar} style={{ background: color + '22', color }}>
            {initials(student.name)}
          </div>
        )}
        <div>
          <div className={s.name}>{student.name}</div>
          <div className={s.sub}>NISN: {student.nisn}</div>
          <span className={s.kelas}>{student.kelas}</span>
        </div>
      </div>

      {/* Info grid */}
      <div className={s.infoGrid}>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>Jenis Kelamin</span>
          <span className={s.infoVal}>{student.gender}</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>Tempat, Tanggal Lahir</span>
          <span className={s.infoVal}>{student.ttl}</span>
        </div>
        <div className={s.infoItem} style={{ gridColumn: '1 / -1' }}>
          <span className={s.infoLabel}>Alamat</span>
          <span className={s.infoVal}>{student.alamat}</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>No. HP</span>
          <span className={s.infoVal}>{student.noHp}</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>Status hari ini</span>
          {activeStatus ? (
            <span
              className={s.statusBadge}
              style={statusStyle[activeStatus]}
            >
              {activeStatus}
            </span>
          ) : (
            <span className={s.infoVal} style={{ color: '#9ca3af' }}>Belum absen</span>
          )}
        </div>
      </div>

      {/* Catatan */}
      <div className={s.catatanWrap}>
        <label className={s.catatanLabel}>Catatan (opsional)</label>
        <input
          className={s.catatanInput}
          type="text"
          placeholder="Misal: sakit demam, izin acara keluarga..."
          value={catatan}
          onChange={e => setCatatan(e.target.value)}
        />
      </div>

      {/* Tombol status */}
      <div className={s.actions}>
        {STATUS_OPTIONS.map(st => (
          <button
            key={st}
            className={s.actBtn}
            style={activeStatus === st ? { ...statusStyle[st], fontWeight: 600 } : {}}
            disabled={loading}
            onClick={() => handleMark(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {existing && (
        <p className={s.lastTime}>
          Terakhir diperbarui pukul {existing.time}
        </p>
      )}
    </div>
  )
}
