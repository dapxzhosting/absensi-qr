import { useState } from 'react'
import { upsertStudent } from '../lib/db'
import type { Student } from '../lib/types'

const DUMMY_STUDENTS: Student[] = [
  { id:'0054321789', nisn:'999999999', name:'Dafa Alfiansyah',     kelas:'X XPL 1',   gender:'Laki-laki',  ttl:'Jakarta, 20 Mei 2010',    alamat:'Jl. Ambatukam 3, Jakarta Pusat', noHp:'0888889999' },
  { id:'0054321790', nisn:'0054321790', name:'Bunga Sari',       kelas:'X-A',   gender:'Perempuan',  ttl:'Bandung, 5 Juli 2007',      alamat:'Jl. Melati No.12, Bandung',       noHp:'081234560002' },
  { id:'0054321791', nisn:'0054321791', name:'Candra Wijaya',    kelas:'XI-B',  gender:'Laki-laki',  ttl:'Surabaya, 22 Jan 2006',     alamat:'Jl. Anggrek No.3, Surabaya',      noHp:'081234560003' },
  { id:'0054321792', nisn:'0054321792', name:'Dewi Lestari',     kelas:'XI-B',  gender:'Perempuan',  ttl:'Medan, 8 September 2006',   alamat:'Jl. Kenanga No.7, Medan',         noHp:'081234560004' },
  { id:'0054321793', nisn:'0054321793', name:'Eko Santoso',      kelas:'XII-C', gender:'Laki-laki',  ttl:'Yogyakarta, 30 April 2005', alamat:'Jl. Dahlia No.9, Yogyakarta',     noHp:'081234560005' },
  { id:'0054321794', nisn:'0054321794', name:'Fitri Handayani',  kelas:'XII-C', gender:'Perempuan',  ttl:'Solo, 15 November 2005',    alamat:'Jl. Tulip No.2, Solo',            noHp:'081234560006' },
]

export default function SeedPage() {
  const [status, setStatus] = useState('')
  const [done, setDone] = useState(false)

  async function seed() {
    setStatus('Mengisi data siswa ke Firestore...')
    for (const s of DUMMY_STUDENTS) {
      await upsertStudent(s)
      setStatus(`Menambahkan: ${s.name}`)
    }
    setStatus('✅ Selesai! Semua siswa berhasil ditambahkan.')
    setDone(true)
  }

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 8 }}>Seed Data Siswa</h2>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Klik tombol di bawah untuk mengisi {DUMMY_STUDENTS.length} siswa contoh ke Firestore.
        Pastikan konfigurasi Firebase sudah benar di <code>src/lib/firebase.ts</code>.
      </p>
      <button
        onClick={seed}
        disabled={done}
        style={{
          padding: '10px 20px', background: done ? '#d1d5db' : '#3b82f6',
          color: '#fff', border: 'none', borderRadius: 8, cursor: done ? 'default' : 'pointer',
          fontWeight: 600, fontSize: 14
        }}
      >
        {done ? 'Sudah selesai' : 'Mulai Seed Data'}
      </button>
      {status && (
        <p style={{ marginTop: 16, color: '#374151', fontSize: 14 }}>{status}</p>
      )}
      {done && (
        <div style={{ marginTop: 20, padding: 14, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
          <strong>QR Code yang bisa dipakai untuk testing:</strong>
          <ul style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
            {DUMMY_STUDENTS.map(s => (
              <li key={s.id} style={{ marginBottom: 4 }}>
                <code style={{ background: '#e5e7eb', padding: '1px 6px', borderRadius: 4 }}>{s.nisn}</code>
                {' → '}{s.name} ({s.kelas})
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
            Generate QR dari NISN di: <a href="https://qr.io" target="_blank">qr.io</a> atau <a href="https://www.qrcode-monkey.com" target="_blank">qrcode-monkey.com</a>
          </p>
        </div>
      )}
    </div>
  )
}
