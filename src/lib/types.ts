export interface Student {
  id: string
  nisn: string
  name: string
  kelas: string
  gender: 'Laki-laki' | 'Perempuan'
  ttl: string
  alamat: string
  noHp: string
  fotoUrl?: string
}

export type AttStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'

export interface AttendanceRecord {
  id?: string
  studentId: string
  studentName: string
  studentNisn: string
  kelas: string
  status: AttStatus
  date: string
  time: string
  createdAt: number
  catatan?: string
}
