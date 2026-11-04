import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SudaneseEmblem } from '../components/SudaneseEmblem';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSent(false);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div className="border-b border-[#D9B56D]/30 pb-6 text-center sm:text-right space-y-2">
        <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          تواصل مع هيئة التحرير
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans-ar leading-relaxed">
          نرحب بمقترحاتكم واستفساراتكم الأدبية، وملاحظاتكم التوثيقية حول شعراء وقصائد السودان.
        </p>
      </div>

      <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs">
        {sent ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
            <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">تم إرسال رسالتك بنجاح</h3>
            <p className="text-xs text-stone-500">شكراً لتواصلك، ستقوم هيئة التحرير بالرد في أقرب وقت.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الاسم الكريم *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك الكامل"
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">موضوع الرسالة</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="اقتراح / استفسار أدبي / توثيق"
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الرسالة *</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send size={14} />
              <span>إرسال الرسالة</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
