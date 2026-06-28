import {
  collection, doc, getDoc, getDocs,
  addDoc, setDoc, updateDoc, query,
  where
} from 'firebase/firestore'
import { db } from './firebase'
import type { Student, AttendanceRecord, AttStatus } from './types'
import { format } from 'date-fns'

export async function getStudent(id: string): Promise<Student | null> {
  const snap = await getDoc(doc(db, 'students', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Student
}

export async function getAllStudents(): Promise<Student[]> {
  const snap = await getDocs(collection(db, 'students'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student))
}

export async function upsertStudent(student: Student): Promise<void> {
  await setDoc(doc(db, 'students', student.id), student)
}

const today = () => format(new Date(), 'yyyy-MM-dd')

export async function getTodayRecord(studentId: string): Promise<AttendanceRecord | null> {
  const q = query(
    collection(db, 'attendance'),
    where('studentId', '==', studentId),
    where('date', '==', today())
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as AttendanceRecord
}

export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
  const q = query(
    collection(db, 'attendance'),
    where('date', '==', today())
  )
  const snap = await getDocs(q)
  const records = snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord))
  return records.sort((a, b) => b.createdAt - a.createdAt)
}

export async function markAttendance(
  student: Student,
  status: AttStatus,
  catatan?: string
): Promise<AttendanceRecord> {
  const existing = await getTodayRecord(student.id)
  const now = new Date()
  const record: AttendanceRecord = {
    studentId: student.id,
    studentName: student.name,
    studentNisn: student.nisn,
    kelas: student.kelas,
    status,
    date: today(),
    time: format(now, 'HH:mm'),
    createdAt: now.getTime(),
    catatan,
  }

  if (existing?.id) {
    await updateDoc(doc(db, 'attendance', existing.id), { status, catatan, time: record.time })
    return { ...record, id: existing.id }
  } else {
    const ref = await addDoc(collection(db, 'attendance'), record)
    return { ...record, id: ref.id }
  }
}

export async function getMonthlyStats(studentId: string, yearMonth: string) {
  const q = query(
    collection(db, 'attendance'),
    where('studentId', '==', studentId),
    where('date', '>=', `${yearMonth}-01`),
    where('date', '<=', `${yearMonth}-31`)
  )
  const snap = await getDocs(q)
  const records = snap.docs.map(d => d.data() as AttendanceRecord)
  return {
    hadir: records.filter(r => r.status === 'Hadir').length,
    izin:  records.filter(r => r.status === 'Izin').length,
    sakit: records.filter(r => r.status === 'Sakit').length,
    alpha: records.filter(r => r.status === 'Alpha').length,
    total: records.length,
  }
}
