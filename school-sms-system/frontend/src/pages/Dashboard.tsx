import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function Dashboard() {
  const { role, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl">داشبورد</h1>
        <button onClick={toggleDarkMode}>{darkMode ? 'حالت روشن' : 'حالت تاریک'}</button>
        <button onClick={logout}>خروج</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {role === 'ADMIN' && (
          <>
            <Card title="دانش آموزان"><Link to="/students">مدیریت دانش آموزان</Link></Card>
            <Card title="گزارشات"><Link to="/logs">مشاهده گزارشات</Link></Card>
          </>
        )}
        <Card title="غیبت ها"><Link to="/absences">مدیریت غیبت ها</Link></Card>
        <Card title="الگوها"><Link to="/templates">ویرایش الگوها</Link></Card>
        <Card title="ارسال پیام"><Link to="/send-message">ارسال پیام سفارشی</Link></Card>
      </div>
    </div>
  );
}