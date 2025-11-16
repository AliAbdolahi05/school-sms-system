import { useState } from 'react';
import axios from '../utils/api';

export default function SendMessage() {
  const [form, setForm] = useState({ studentId: '', type: '', customMessage: '', variables: {} });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/sms/send', form);
    alert('پیام ارسال شد');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ارسال پیام سفارشی</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="شناسه دانش آموز" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="border p-2" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="absence">غیبت</option>
          <option value="expulsion">اخراج از کلاس</option>
          <option value="meeting">یادآوری جلسه والدین</option>
          <option value="custom">سفارشی</option>
        </select>
        {form.type === 'custom' && (
          <textarea placeholder="پیام سفارشی" value={form.customMessage} onChange={e => setForm({...form, customMessage: e.target.value})} className="border p-2 w-full" />
        )}
        {/* Add fields for variables if needed */}
        <button type="submit" className="bg-green-500 text-white p-2">ارسال</button>
      </form>
    </div>
  );
}