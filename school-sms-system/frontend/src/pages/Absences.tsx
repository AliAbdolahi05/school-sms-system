import { useEffect, useState } from 'react';
import axios from '../utils/api';

interface Absence {
  id: number;
  date: string;
  reason: string;
  sentSms: boolean;
  student: { firstName: string; lastName: string };
}

export default function Absences() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [form, setForm] = useState({ studentId: '', date: '', reason: '', sendSms: false });

  useEffect(() => {
    axios.get('/api/absences').then(res => setAbsences(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/absences', form);
    // refresh
    axios.get('/api/absences').then(res => setAbsences(res.data));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">جدول غیبت ها</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input placeholder="شناسه دانش آموز" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="border p-2" />
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border p-2" />
        <input placeholder="دلیل" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="border p-2" />
        <label>
          ارسال SMS
          <input type="checkbox" checked={form.sendSms} onChange={e => setForm({...form, sendSms: e.target.checked})} />
        </label>
        <button type="submit" className="bg-green-500 text-white p-2">ثبت غیبت</button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th>دانش آموز</th>
            <th>تاریخ</th>
            <th>دلیل</th>
            <th>SMS ارسال شده</th>
          </tr>
        </thead>
        <tbody>
          {absences.map(a => (
            <tr key={a.id}>
              <td>{a.student.firstName} {a.student.lastName}</td>
              <td>{a.date}</td>
              <td>{a.reason}</td>
              <td>{a.sentSms ? 'بله' : 'خیر'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}