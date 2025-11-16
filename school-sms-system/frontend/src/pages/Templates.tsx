import { useEffect, useState } from 'react';
import axios from '../utils/api';

interface Template {
  id: number;
  name: string;
  content: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    axios.get('/api/templates').then(res => setTemplates(res.data));
  }, []);

  const handleEdit = async () => {
    if (selected) {
      await axios.put(`/api/templates/${selected.id}`, selected);
      setTemplates(templates.map(t => t.id === selected.id ? selected : t));
    }
  };

  const updatePreview = (content: string) => {
    // Simple preview with dummy vars
    setPreview(content.replace(/{{(\w+)}}/g, '[مثال]'));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ویرایشگر الگوها</h1>
      <select onChange={e => {
        const temp = templates.find(t => t.id === parseInt(e.target.value));
        setSelected(temp || null);
        if (temp) updatePreview(temp.content);
      }}>
        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      {selected && (
        <>
          <textarea
            value={selected.content}
            onChange={e => {
              setSelected({...selected, content: e.target.value});
              updatePreview(e.target.value);
            }}
            className="border p-2 w-full h-32"
          />
          <button onClick={handleEdit} className="bg-blue-500 text-white p-2">ذخیره</button>
          <div className="mt-4">
            <h2>پیش نمایش:</h2>
            <p>{preview}</p>
          </div>
        </>
      )}
    </div>
  );
}