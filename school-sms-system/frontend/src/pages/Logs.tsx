import { useEffect, useState } from 'react';
import axios from '../utils/api';

interface Log {
  id: number;
  messageType: string;
  messageContent: string;
  dateTime: string;
  success: boolean;
  student: { firstName: string; lastName: string };
  sentBy: { username: string };
}

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filters, setFilters] = useState({ studentId: '', sentById: '' });

  useEffect(() => {
    axios.get('/api/logs', { params: filters }).then(res => setLogs(res.data));
  }, [filters]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">صفحه گزارشات SMS</h1>
      <input placeholder="فیلتر بر اساس شناسه دانش آموز" value={filters.studentId} onChange={e => setFilters({...filters, studentId: e.target.value})} className="border p-2" />
      <input placeholder="فیلتر بر اساس شناسه معاون" value={filters.sentById} onChange={e => setFilters({...filters, sentById: e.target.value})} className="border p-2" />
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th>نوع</th>
            <th>محتوا</th>
            <th>تاریخ</th>
            <th>موفقیت</th>
            <th>دانش آموز</th>
            <th>ارسال کننده</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.messageType}</td>
              <td>{l.messageContent}</td>
              <td>{l.dateTime}</td>
              <td>{l.success ? 'بله' : 'خیر'}</td>
              <td>{l.student.firstName} {l.student.lastName}</td>
              <td>{l.sentBy.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}