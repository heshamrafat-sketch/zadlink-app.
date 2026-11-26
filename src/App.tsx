import React, { useState } from 'react';
​const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';
​export function App() {
const [customerName, setCustomerName] = useState('');
const [phone, setPhone] = useState('');
const [notes, setNotes] = useState('');
const [loading, setLoading] = useState(false);
const [statusMessage, setStatusMessage] = useState('');
​async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setStatusMessage('');
​if (!customerName.trim() || !phone.trim()) {
setStatusMessage('يرجى إدخال اسم العميل ورقم الهاتف');
return;
}
​setLoading(true);
try {
const response = await fetch(${SUPABASE_URL}/rest/v1/orders, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: SUPABASE_KEY,
Authorization: Bearer ${SUPABASE_KEY},
Prefer: 'return=minimal',
},
body: JSON.stringify({
customer_name: customerName.trim(),
phone: phone.trim(),
notes: notes.trim() || null,
}),
});
​if (!response.ok) {
const errorText = await response.text();
throw new Error(errorText || 'فشل إرسال الطلب');
}
​setCustomerName('');
setPhone('');
setNotes('');
setStatusMessage('تم إرسال الطلب بنجاح');
} catch (error) {
const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
setStatusMessage(خطأ: ${message});
} finally {
setLoading(false);
}
}
​return (
<div dir="rtl" className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
<form
onSubmit={handleSubmit}
className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl"
>
<h1 className="text-xl font-bold text-center">إرسال طلب جديد</h1>
​<div>
<label className="block text-sm mb-1 text-slate-300">اسم العميل</label>
<input
type="text"
value={customerName}
onChange={(e) => setCustomerName(e.target.value)}
placeholder="اكتب اسم العميل"
className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
/>
</div>
​<div>
<label className="block text-sm mb-1 text-slate-300">رقم الهاتف</label>
<input
type="tel"
value={phone}
onChange={(e) => setPhone(e.target.value)}
placeholder="01xxxxxxxxx"
className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
/>
</div>
​<div>
<label className="block text-sm mb-1 text-slate-300">ملاحظات</label>
<textarea
value={notes}
onChange={(e) => setNotes(e.target.value)}
placeholder="أي ملاحظات إضافية"
rows={3}
className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
/>
</div>
​<button
type="submit"
disabled={loading}
className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-2.5 font-semibold transition"
>
{loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
</button>
​{statusMessage && (
<div className="text-center text-sm pt-2 text-emerald-300">{statusMessage}</div>
)}
</form>
</div>
);
}
​export default App;
