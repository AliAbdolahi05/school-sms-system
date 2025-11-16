import { useEffect, useState } from 'react';
import axios from '../utils/api';
import { Link } from 'react-router-dom';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  parentPhone: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', grade: '', parentPhone: '' });

  useEffect(() => {
    axios.get('/api/students').then(res => setStudents(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/students', form);
    setStudents([...students, { ...form, id: Date.now() }]); // temp
    setForm({ firstName: '', lastName: '', grade: '', parentPhone: '' });
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/students/${id}`);
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">لیست دانش آموزان</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input placeholder="نام" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="border p-2" />
        <input placeholder="نام خانوادگی" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="border p-2" />
        <input placeholder="کلاس" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="border p-2" />
        <input placeholder="تلفن والدین" value={form.parentPhone} onChange={e => setForm({...form, parentPhone: e.target.value})} className="border p-2" />
        <button type="submit" className="bg-green-500 text-white p-2">اضافه کردن</button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th>نام</th>
            <th>نام خانوادگی</th>
            <th>کلاس</th>
            <th>تلفن</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.grade}</td>
              <td>{s.parentPhone}</td>
              <td>
                <Link to={`/student/${s.id}`} className="text-blue-500">پروفایل</Link>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 ml-2">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}