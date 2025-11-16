import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';

interface Student {
  firstName: string;
  lastName: string;
  grade: string;
  parentPhone: string;
}

interface Absence {
  date: string;
  reason: string;
  sentSms: boolean;
}

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [absences, setAbsences] = useState<{ absences: Absence[]; count: number }>({ absences: [], count: 0 });

  useEffect(() => {
    axios.get(`/api/students/${id}`).then(res => setStudent(res.data));
    axios.get(`/api/absences/student/${id}`).then(res => setAbsences(res.data));
  }, [id]);

  if (!student) return <div>در حال بارگذاری...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">پروفایل {student.firstName} {student.lastName}</h1>
      <p>کلاس: {student.grade}</p>
      <p>تلفن والدین: {student.parentPhone}</p>
      <h2 className="text-xl mt-4">تاریخچه غیبت ها (تعداد: {absences.count})</h2>
      <ul>
        {absences.absences.map((a, i) => (
          <li key={i}>{a.date} - {a.reason} - SMS ارسال شده: {a.sentSms ? 'بله' : 'خیر'}</li>
        ))}
      </ul>
    </div>
  );
}