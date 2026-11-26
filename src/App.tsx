import React, { useState } from 'react';
const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';
​export function App() {
const [customerName, setCustomerName] = useState('');
const [phone, setPhone] = useState('');
const [notes, setNotes] = useState('');
const [loading, setLoading] = useState(false);
const [statusMessage, setStatusMessage] = useState('');
async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setStatusMessage('');​
if (!customerName.trim() || !phone.trim()) {
setStatusMessage('يرجى إدخال اسم العميل ورقم الهاتف.');
return;
}
​setLoading(true);
​try {
const response = await fetch(${SUPABASE_URL}/rest/v1/orders, {
method: 'POST',
headers: {
apikey: SUPABASE_KEY,
Authorization: Bearer ${SUPABASE_KEY},
'Content-Type': 'application/json',
Prefer: 'return=representation',
},
body: JSON.stringify({
customer_name: customerName.trim(),
phone: phone.trim(),
notes: notes.trim() || null,
status: 'new',
}),
});
​if (!response.ok) {
const errorText = await response.text();
throw new Error(errorText || HTTP ${response.status});
}
setCustomerName('');
setPhone('');
setNotes('');
setStatusMessage('تم إرسال الطلب وحفظه بنجاح.');
} catch (err) {
const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الإرسال';
setStatusMessage(تعذر إرسال الطلب: ${msg});
} finally {
setLoading(false);
}
}
​return (
<div dir="rtl" className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
<div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
<h1 className="text-xl font-bold text-slate-800">زاد لينك — إرسال طلب</h1>
​<form onSubmit={handleSubmit} className="space-y-3">
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
اسم العميل
</label>
<input
type="text"
value={customerName}
onChange={(e) => setCustomerName(e.target.value)}
placeholder="مثال: أحمد محمود"
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
/>
</div>
​<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
رقم الهاتف
</label>
<input
type="tel"
value={phone}
onChange={(e) => setPhone(e.target.value)}
placeholder="01xxxxxxxxx"
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
/>
</div>
​<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
ملاحظات / العنوان
</label>
<textarea
rows={2}
value={notes}
onChange={(e) => setNotes(e.target.value)}
placeholder="العنوان أو تفاصيل الطلب..."
className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
/>
</div>
​<button
type="submit"
disabled={loading}
className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition"
>
{loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
</button>
</form>
​{statusMessage && (
<div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-800">
{statusMessage}
</div>
)}
</div>
</div>
);
}
​export default App;
