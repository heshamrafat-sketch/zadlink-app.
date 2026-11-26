import React, { useMemo, useState } from 'react';
​const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';
const CART_KEY = 'zadlink_cart_v1';
const ORDERS_KEY = 'zadlink_pending_orders';
​type Mode = 'wholesale' | 'retail';
​interface Category {
id: string;
title: string;
desc: string;
img: string;
}
​interface Product {
id: number;
cat: string;
name: string;
retailUnit: string;
wholesaleUnit: string;
retailPrice: number;
wholesalePrice: number;
badge?: string;
img: string;
}
​interface Receipt {
count: number;
total: number;
mode: Mode;
localOnly: boolean;
note?: string;
}
​const CATEGORIES: Category[] = [
{ id: 'oils-basics', title: 'زيوت وسمن وأساسيات', desc: 'زيوت، سمن، أرز، مكرونة، دقيق، سكر، طحينة، عسل، خل', img: './oil.png.png' },
{ id: 'frozen-meats', title: 'مجمدات ومصنعات لحوم', desc: 'بطاطس نصف مقلية، خضروات مجمدة، مثلجات، برجر، سجق، كبدة، كفتة، مفروم', img: './processed-meats.jpg.jpg' },
{ id: 'poultry-fish', title: 'دواجن وبيض وأسماك', desc: 'فراخ، بط، بيض، أسماك مجمدة، رنجة', img: './chicken.jpg.jpg' },
{ id: 'dairy-cheese', title: 'ألبان وأجبان', desc: 'ألبان متنوعة وأجبان بكافة أنواعها', img: './dairy.jpg.jpg' },
{ id: 'canned-sauces', title: 'معلبات وصوصات', desc: 'صلصة طماطم، صوصات، مربى وشوكولاتة دهن', img: './sauces.jpg.jpg' },
{ id: 'beverages', title: 'مشروبات وشاي وقهوة', desc: 'شاي، قهوة، نسكافية، عصائر ومشروبات، مياه', img: './juices-drinks.jpg.jpg' },
{ id: 'bakery-supplies', title: 'مخبوزات ومستلزمات خبز', desc: 'مخبوزات، بسكويت وكيك، خميرة وبيكنج باودر ونشا وكاكاو', img: './bakery.jpg.jpg' },
{ id: 'spices-salt', title: 'توابل وبهارات وملح', desc: 'فلفل أسود، كمون، كزبرة، بابريكا، كركم، سبع بهارات، ملح', img: './spices.jpg.jpg' },
{ id: 'fruits-veggies', title: 'فاكهة وخضار', desc: 'فاكهة وخضروات طازجة ومجمدة', img: './fruits.jpg.jpg' },
{ id: 'cleaning-paper', title: 'منظفات وورقيات', desc: 'مساحيق غسيل، منظفات سائلة وكلور، مناديل وفويل واسترتش وأكياس', img: './liquid-cleaners.jpg.jpg' },
];
​const PRODUCTS: Product[] = [
{ id: 1, cat: 'oils-basics', name: 'زيت طعام نقي', retailUnit: 'قطاعي: زجاجة 1 لتر', wholesaleUnit: 'جملة: جركن 18 لتر', retailPrice: 85, wholesalePrice: 1280, badge: 'عرض مميز', img: './oil.png.png' },
{ id: 2, cat: 'oils-basics', name: 'دقيق فاخر للمخبوزات والحلويات', retailUnit: 'قطاعي: كيس 1 كجم', wholesaleUnit: 'جملة: شيكارة 25 كجم', retailPrice: 28, wholesalePrice: 620, img: './flour.png.jpg' },
{ id: 3, cat: 'oils-basics', name: 'أرز', retailUnit: 'قطاعي: كيس 1 كجم', wholesaleUnit: 'جملة: شيكارة 25 كجم', retailPrice: 34, wholesalePrice: 800, badge: 'الأكثر طلباً', img: './rice.jpg.png' },
{ id: 4, cat: 'oils-basics', name: 'مكرونات', retailUnit: 'قطاعي: كيس 400 جم', wholesaleUnit: 'جملة: كرتونة (20 كيس)', retailPrice: 16, wholesalePrice: 290, img: './pasta.png.jpg' },
{ id: 5, cat: 'oils-basics', name: 'سكر', retailUnit: 'قطاعي: كيس 1 كجم', wholesaleUnit: 'جملة: شيكارة 50 كجم', retailPrice: 36, wholesalePrice: 1700, img: './sugar.png.jpg' },
{ id: 6, cat: 'oils-basics', name: 'طحينة', retailUnit: 'قطاعي: عبوة 500 جم', wholesaleUnit: 'جملة: جركن 5 كجم', retailPrice: 95, wholesalePrice: 860, img: './tahini.jpg.jpg' },
{ id: 7, cat: 'oils-basics', name: 'عسل نحل', retailUnit: 'قطاعي: برطمان 500 جم', wholesaleUnit: 'جملة: كرتونة (12 عبوة)', retailPrice: 120, wholesalePrice: 1320, img: './honey.jpg.jpg' },
{ id: 8, cat: 'oils-basics', name: 'عسل أسود', retailUnit: 'قطاعي: عبوة 1 كجم', wholesaleUnit: 'جملة: جركن 10 كجم', retailPrice: 45, wholesalePrice: 410, img: './molasses.jpg.jpg' },
{ id: 9, cat: 'oils-basics', name: 'خل أبيض', retailUnit: 'قطاعي: زجاجة 1 لتر', wholesaleUnit: 'جملة: كرتونة (12 زجاجة)', retailPrice: 18, wholesalePrice: 185, img: './vinegar.jpg.jpg' },
{ id: 10, cat: 'frozen-meats', name: 'مصنعات لحوم (برجر، سجق، كبدة، كفتة، لحم مفروم)', retailUnit: 'قطاعي: عبوة / كيلو', wholesaleUnit: 'جملة: كرتونة', retailPrice: 165, wholesalePrice: 0, img: './processed-meats.jpg.jpg' },
{ id: 11, cat: 'frozen-meats', name: 'بطاطس نصف مقلية', retailUnit: 'قطاعي: كيس 2.5 كجم', wholesaleUnit: 'جملة: كرتونة (4 × 2.5 كجم)', retailPrice: 135, wholesalePrice: 510, img: './frozen-fries.jpg.jpg' },
{ id: 12, cat: 'frozen-meats', name: 'خضروات مجمدة', retailUnit: 'قطاعي: كيس 400 جم', wholesaleUnit: 'جملة: كرتونة (20 كيس)', retailPrice: 25, wholesalePrice: 440, img: './frozen-veggies.jpg.jpg' },
{ id: 13, cat: 'frozen-meats', name: 'مثلجات', retailUnit: 'قطاعي: عبوة', wholesaleUnit: 'جملة: كرتونة', retailPrice: 45, wholesalePrice: 0, img: './ice-cream.jpg.jpg' },
{ id: 14, cat: 'poultry-fish', name: 'فراخ', retailUnit: 'قطاعي: كيلو', wholesaleUnit: 'جملة: كرتونة (10 كجم)', retailPrice: 95, wholesalePrice: 900, img: './chicken.jpg.jpg' },
{ id: 15, cat: 'poultry-fish', name: 'بط', retailUnit: 'قطاعي: كيلو', wholesaleUnit: 'جملة: كرتونة / بالوزن', retailPrice: 125, wholesalePrice: 0, img: './duck.jpg.jpg' },
{ id: 16, cat: 'poultry-fish', name: 'بيض', retailUnit: 'قطاعي: طبق (30 بيضة)', wholesaleUnit: 'جملة: كرتونة (6 أطباق)', retailPrice: 165, wholesalePrice: 960, img: './eggs.jpg.jpg' },
{ id: 17, cat: 'poultry-fish', name: 'أسماك مجمدة', retailUnit: 'قطاعي: كيلو', wholesaleUnit: 'جملة: كرتونة', retailPrice: 90, wholesalePrice: 0, img: './frozen-fish.jpg.jpg' },
{ id: 18, cat: 'poultry-fish', name: 'رنجة', retailUnit: 'قطاعي: كيلو', wholesaleUnit: 'جملة: صندوق / كرتونة', retailPrice: 130, wholesalePrice: 0, img: './herring.jpg.jpg' },
{ id: 19, cat: 'dairy-cheese', name: 'ألبان متنوعة', retailUnit: 'قطاعي: عبوة 1 لتر', wholesaleUnit: 'جملة: كرتونة (12 عبوة)', retailPrice: 42, wholesalePrice: 480, img: './dairy.jpg.jpg' },
{ id: 20, cat: 'dairy-cheese', name: 'أجبان متنوعة', retailUnit: 'قطاعي: عبوة / كيلو', wholesaleUnit: 'جملة: صفيحة / كرتونة', retailPrice: 85, wholesalePrice: 0, img: './cheese.jpg.jpg' },
{ id: 21, cat: 'canned-sauces', name: 'صلصة طماطم مركزة', retailUnit: 'قطاعي: برطمان / عبوة', wholesaleUnit: 'جملة: كرتونة 24 عبوة', retailPrice: 26, wholesalePrice: 540, img: './tomato-paste.jpg.jpg' },
{ id: 22, cat: 'canned-sauces', name: 'صوصات (كاتشب، مايونيز، مستردة، صوصات)', retailUnit: 'قطاعي: عبوة', wholesaleUnit: 'جملة: كرتونة / جركن', retailPrice: 48, wholesalePrice: 0, img: './sauces.jpg.jpg' },
{ id: 23, cat: 'canned-sauces', name: 'مربى وشوكولاتة قابلة للدهن', retailUnit: 'قطاعي: برطمان / عبوة', wholesaleUnit: 'جملة: كرتونة', retailPrice: 65, wholesalePrice: 0, img: './jam-spreads.jpg.jpg' },
{ id: 24, cat: 'beverages', name: 'شاي', retailUnit: 'قطاعي: عبوة 250 جم', wholesaleUnit: 'جملة: كرتونة', retailPrice: 68, wholesalePrice: 0, img: './tea.jpg.jpg' },
{ id: 25, cat: 'beverages', name: 'قهوة', retailUnit: 'قطاعي: عبوة 200 جم', wholesaleUnit: 'جملة: كرتونة', retailPrice: 140, wholesalePrice: 0, img: './coffee.jpg.jpg' },
{ id: 26, cat: 'beverages', name: 'نسكافية', retailUnit: 'قطاعي: باكت / عبوة', wholesaleUnit: 'جملة: كرتونة', retailPrice: 95, wholesalePrice: 0, img: './nescafe.jpg.jpg' },
{ id: 27, cat: 'beverages', name: 'عصائر ومشروبات', retailUnit: 'قطاعي: عبوة', wholesaleUnit: 'جملة: كرتونة (24 عبوة)', retailPrice: 15, wholesalePrice: 320, img: './juices-drinks.jpg.jpg' },
{ id: 28, cat: 'beverages', name: 'مياه', retailUnit: 'قطاعي: زجاجة كبيرة', wholesaleUnit: 'جملة: كرتونة (12 زجاجة)', retailPrice: 10, wholesalePrice: 95, img: './water.jpg.jpg' },
{ id: 29, cat: 'bakery-supplies', name: 'مخبوزات', retailUnit: 'قطاعي: عبوة / قطعة', wholesaleUnit: 'جملة: كرتونة', retailPrice: 35, wholesalePrice: 0, img: './bakery.jpg.jpg' },
{ id: 30, cat: 'bakery-supplies', name: 'بسكويت وكيك', retailUnit: 'قطاعي: باكت / عبوة', wholesaleUnit: 'جملة: كرتونة', retailPrice: 20, wholesalePrice: 0, img: './biscuits-cake.jpg.jpg' },
{ id: 31, cat: 'bakery-supplies', name: 'مستلزمات خبز (خميرة، بيكنج باودر، نشا، كاكاو)', retailUnit: 'قطاعي: عبوة', wholesaleUnit: 'جملة: كرتونة / شيكارة', retailPrice: 30, wholesalePrice: 0, img: './baking-supplies.jpg.jpg' },
{ id: 32, cat: 'spices-salt', name: 'توابل وبهارات', retailUnit: 'قطاعي: عبوة / وزن', wholesaleUnit: 'جملة: شيكارة / كرتونة', retailPrice: 45, wholesalePrice: 0, img: './spices.jpg.jpg' },
{ id: 33, cat: 'spices-salt', name: 'ملح طعام', retailUnit: 'قطاعي: كيس', wholesaleUnit: 'جملة: كرتونة (20 كيس)', retailPrice: 5, wholesalePrice: 85, img: './salt.jpg.jpg' },
{ id: 34, cat: 'fruits-veggies', name: 'فاكهة', retailUnit: 'قطاعي: كيلو', wholesaleUnit: 'جملة: قفص / كرتونة', retailPrice: 40, wholesalePrice: 0, img: './fruits.jpg.jpg' },
{ id: 35, cat: 'cleaning-paper', name: 'منظفات سائلة وكلور', retailUnit: 'قطاعي: عبوة 1 لتر', wholesaleUnit: 'جملة: جركن / كرتونة', retailPrice: 25, wholesalePrice: 0, img: './liquid-cleaners.jpg.jpg' },
{ id: 36, cat: 'cleaning-paper', name: 'مساحيق غسيل', retailUnit: 'قطاعي: كيس / عبوة', wholesaleUnit: 'جملة: شيكارة / كرتونة', retailPrice: 65, wholesalePrice: 0, img: './laundry-detergent.jpg.jpg' },
{ id: 37, cat: 'cleaning-paper', name: 'ورقيات وبلاستيكيات (مناديل، فويل، استرتش، أكياس)', retailUnit: 'قطاعي: رول / عبوة', wholesaleUnit: 'جملة: كرتونة / ربطة', retailPrice: 45, wholesalePrice: 0, img: './paper-wraps.jpg.jpg' },
];
​async function api(path: string, init?: RequestInit) {
const res = await fetch(${SUPABASE_URL}/rest/v1/${path}, {
...init,
headers: {
apikey: SUPABASE_KEY,
Authorization: Bearer ${SUPABASE_KEY},
'Content-Type': 'application/json',
Prefer: 'return=representation',
...(init?.headers || {}),
},
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}
​function readCart(): Record<number, number> {
try {
const raw = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
const out: Record<number, number> = {};
for (const [k, v] of Object.entries(raw)) {
const id = Number(k);
const qty = Number(v);
if (id > 0 && qty > 0) out[id] = qty;
}
return out;
} catch {
return {};
}
}
​function saveLocalOrder(data: Record<string, unknown>) {
try {
const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
list.push({ created_at: new Date().toISOString(), ...data });
localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
} catch {}
}
​export function App() {
const [mode, setMode] = useState<Mode>('wholesale');
const [catId, setCatId] = useState<string | null>(null);
const [search, setSearch] = useState('');
const [cart, setCart] = useState<Record<number, number>>(readCart);
const [drawerOpen, setDrawerOpen] = useState(false);
const [name, setName] = useState('');
const [phone, setPhone] = useState('');
const [notes, setNotes] = useState('');
const [sending, setSending] = useState(false);
const [receipt, setReceipt] = useState<Receipt | null>(null);
const [storeTitle, setStoreTitle] = useState('زاد لينك | ZadLink');
const [items, setItems] = useState<Product[]>(PRODUCTS);
​React.useEffect(() => {
try {
localStorage.setItem(CART_KEY, JSON.stringify(cart));
} catch {}
}, [cart]);
​React.useEffect(() => {
api('store_settings?select=*&limit=1')
.then((rows) => {
const row = rows?.[0];
if (row?.store_name) setStoreTitle(String(row.store_name));
if (row?.default_customer_type === 'retail' || row?.default_customer_type === 'wholesale') {
setMode(row.default_customer_type);
}
})
.catch(() => {});
​api('products?select=*')
.then((rows) => {
if (!Array.isArray(rows) || !rows.length) return;
const mapped = rows
.map((r: Record<string, unknown>, i: number) => ({
id: Number(r.id ?? i + 1),
cat: String(r.category_id ?? r.categoryId ?? 'oils-basics'),
name: String(r.name ?? ''),
retailUnit: String(r.retail_unit ?? 'قطاعي'),
wholesaleUnit: String(r.wholesale_unit ?? 'جملة'),
retailPrice: Number(r.retail_price ?? 0),
wholesalePrice: Number(r.wholesale_price ?? 0),
badge: r.badge ? String(r.badge) : undefined,
img: String(r.image ?? './oil.png.png'),
}))
.filter((p) => p.name);
if (mapped.length) setItems(mapped);
})
.catch(() => {});
}, []);
​const priceOf = (p: Product) => (mode === 'wholesale' ? p.wholesalePrice : p.retailPrice);
const unitOf = (p: Product) => (mode === 'wholesale' ? p.wholesaleUnit : p.retailUnit);
​const lines = useMemo(
() =>
Object.entries(cart)
.map(([id, qty]) => {
const p = items.find((x) => x.id === Number(id)) || PRODUCTS.find((x) => x.id === Number(id));
if (!p || qty <= 0) return null;
const unitPrice = priceOf(p);
return { p, qty, unitPrice, total: unitPrice * qty };
})
.filter((x): x is NonNullable<typeof x> => x !== null),
[cart, items, mode]
);
​const count = useMemo(() => lines.reduce((s, x) => s + x.qty, 0), [lines]);
const total = useMemo(() => lines.reduce((s, x) => s + x.total, 0), [lines]);
​const shownProducts = useMemo(() => {
const q = search.trim();
return items.filter((p) => {
const okCat = q ? true : catId ? p.cat === catId : false;
const okSearch = q ? p.name.includes(q) || p.retailUnit.includes(q) || p.wholesaleUnit.includes(q) : true;
return okCat && okSearch;
});
}, [items, catId, search]);
​const setQty = (id: number, qty: number) => {
setReceipt(null);
setCart((prev) => {
const next = { ...prev };
if (qty <= 0) delete next[id];
else next[id] = qty;
return next;
});
};
​const emptyCart = () => setCart({});
​const checkout = async (e: React.FormEvent) => {
e.preventDefault();
if (!lines.length || sending) return;
setSending(true);
​const payload = {
customer_type: mode,
customer_name: name.trim() || null,
customer_phone: phone.trim() || null,
notes: notes.trim() || null,
total_amount: total,
items_count: count,
items: lines.map(({ p, qty, unitPrice }) => ({
product_id: p.id,
name: p.name,
qty,
unit_price: unitPrice,
})),
};
​saveLocalOrder(payload);
​let summary: Receipt = { count, total, mode, localOnly: true, note: 'تم الحفظ على الجهاز' };
try {
await api('orders', { method: 'POST', body: JSON.stringify(payload) });
summary = { count, total, mode, localOnly: false };
} catch (err) {
summary.note = err instanceof Error ? err.message : 'تعذر الاتصال بالسيرفر';
} finally {
emptyCart();
setNotes('');
setDrawerOpen(false);
setReceipt(summary);
setSending(false);
}
};
​const activeCat = CATEGORIES.find((c) => c.id === catId);
​return (
<div dir="rtl" className="min-h-screen bg-[#f6f8f7] text-gray-900 pb-12">
<header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-xs">
<div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
<button
type="button"
onClick={() => {
setCatId(null);
setSearch('');
}}
className="flex items-center gap-2 text-right min-w-0"
>
<span className="w-10 h-10 rounded-xl bg-[#0b7a4b] text-white font-bold text-xl flex items-center justify-center shrink-0">
ز
</span>
<div className="min-w-0">
<div className="font-bold text-base truncate">{storeTitle}</div>
<div className="text-xs text-[#0b7a4b] truncate">
{mode === 'wholesale' ? 'أسعار الجملة للتجار والمطاعم' : 'أسعار القطاعي للأفراد'}
</div>
</div>
</button>
​<div className="flex items-center gap-2 shrink-0">
<button
type="button"
onClick={() => setDrawerOpen(true)}
className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-gray-300"
>
السلة ({count})
</button>
<button
type="button"
onClick={() => setDrawerOpen(true)}
className="bg-[#0b7a4b] hover:bg-[#09633c] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold"
>
استكمال الطلب{total > 0 ?  • ${total} ج.م : ''}
</button>
</div>
</div>
​<div className="max-w-4xl mx-auto mt-3 flex flex-col sm:flex-row gap-2">
<div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 border border-gray-200 shrink-0">
<button
type="button"
onClick={() => setMode('wholesale')}
className={px-3 py-1.5 rounded-lg text-xs font-bold ${ mode === 'wholesale' ? 'bg-[#0b7a4b] text-white' : 'text-gray-700' }}
>
تاجر (جملة)
</button>
<button
type="button"
onClick={() => setMode('retail')}
className={px-3 py-1.5 rounded-lg text-xs font-bold ${ mode === 'retail' ? 'bg-[#0b7a4b] text-white' : 'text-gray-700' }}
>
فرد (قطاعي)
</button>
</div>
​<input
type="text"
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="ابحث عن منتج أو عبوة..."
className="flex-1 rounded-xl border border-gray-300 bg-[#f9fbfa] px-4 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
/>
</div>
</header>
​<main className="max-w-4xl mx-auto px-4 mt-5">
{receipt && (
<div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-950 text-sm flex items-center justify-between gap-3">
<div>
<div className="font-bold">
{receipt.localOnly ? 'تم تسجيل طلبك وحفظه مؤقتاً على الجهاز!' : 'تم إرسال طلبك بنجاح إلى قاعدة البيانات!'}
</div>
<div className="text-xs mt-0.5">
الأصناف: {receipt.count} • الإجمالي: {receipt.total} ج.م • {receipt.mode === 'wholesale' ? 'جملة' : 'قطاعي'}
</div>
{receipt.localOnly && receipt.note && (
<div className="text-[11px] text-amber-800 mt-1">ملاحظة: {receipt.note}</div>
)}
</div>
<button
type="button"
onClick={() => setReceipt(null)}
className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200"
>
إغلاق
</button>
</div>
)}
​{search.trim() || catId ? (
<div>
<div className="flex items-center justify-between mb-4">
<div>
<h1 className="text-lg font-bold">{search.trim() ? نتائج: "${search.trim()}" : activeCat?.title}</h1>
{!search.trim() && activeCat && <p className="text-xs text-gray-500 mt-0.5">{activeCat.desc}</p>}
</div>
<button
type="button"
onClick={() => {
setCatId(null);
setSearch('');
}}
className="rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold"
>
← الأقسام الرئيسية
</button>
</div>
​{!shownProducts.length ? (
<div className="rounded-2xl bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">
لا توجد منتجات مطابقة.
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{shownProducts.map((p) => {
const price = priceOf(p);
const otherPrice = mode === 'wholesale' ? p.retailPrice : p.wholesalePrice;
const qty = cart[p.id] || 0;
​return (
<div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between">
<div>
<img src={p.img} alt={p.name} className="h-48 w-full object-cover bg-gray-100" />
<div className="p-4">
<div className="flex items-center justify-between gap-2 mb-1">
<span className="text-xs text-gray-500">{CATEGORIES.find((c) => c.id === p.cat)?.title}</span>
{p.badge && (
<span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
{p.badge}
</span>
)}
</div>
<h2 className="font-bold text-base">{p.name}</h2>
<p className="text-xs text-gray-700 mt-1">{unitOf(p)}</p>
<p className="text-[11px] text-gray-500 mt-0.5">
{mode === 'wholesale' ? 'القطاعي:' : 'الجملة:'} {otherPrice > 0 ? ${otherPrice} ج.م : 'حسب السعر'}
</p>
</div>
</div>
​<div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-gray-100">
{qty > 0 ? (
<div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
<button type="button" onClick={() => setQty(p.id, qty + 1)} className="w-8 h-8 rounded-lg bg-[#0b7a4b] text-white font-bold">
+
</button>
<span className="min-w-6 text-center text-sm font-bold">{qty}</span>
<button type="button" onClick={() => setQty(p.id, qty - 1)} className="w-8 h-8 rounded-lg bg-white border border-gray-300 font-bold">
-
</button>
</div>
) : (
<button
type="button"
onClick={() => setQty(p.id, 1)}
className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl"
>
أضف للطلب
</button>
)}
<div className="font-bold text-base">{price > 0 ? ${price} ج.م : 'حسب السعر'}</div>
</div>
</div>
);
})}
</div>
)}
</div>
) : (
<div>
<div className="mb-4">
<h1 className="text-lg font-bold">الأقسام الرئيسية</h1>
<p className="text-xs text-gray-500 mt-0.5">
اختر القسم لاستعراض المنتجات ({mode === 'wholesale' ? 'جملة' : 'قطاعي'})
</p>
</div>
​<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{CATEGORIES.map((c) => (
<button
key={c.id}
type="button"
onClick={() => setCatId(c.id)}
className="text-right bg-white rounded-2xl border border-gray-200 hover:border-[#0b7a4b] overflow-hidden"
>
<img src={c.img} alt={c.title} className="h-44 w-full object-cover bg-gray-100" />
<div className="p-4">
<div className="flex items-center justify-between gap-2">
<h2 className="font-bold text-base">{c.title}</h2>
<span className="text-xs font-semibold bg-emerald-50 text-[#0b7a4b] px-2.5 py-1 rounded-full">
{items.filter((p) => p.cat === c.id).length} صنف
</span>
</div>
<p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{c.desc}</p>
</div>
</button>
))}
</div>
</div>
)}
</main>
​{drawerOpen && (
<div className="fixed inset-0 z-40 bg-black/50 flex justify-end">
<div className="w-full max-w-md bg-white h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl">
<div>
<div className="flex items-center justify-between border-b border-gray-200 pb-3.5">
<div>
<h2 className="font-bold text-lg">سلة الطلب واستكمال الطلب</h2>
<p className="text-xs text-gray-500 mt-0.5">
{mode === 'wholesale' ? 'تاجر (جملة)' : 'فرد (قطاعي)'} • عدد العناصر: {count}
</p>
</div>
<button
type="button"
onClick={() => setDrawerOpen(false)}
className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold"
>
إغلاق ✕
</button>
</div>
​{!lines.length ? (
<div className="py-12 text-center text-gray-500 text-sm">
السلة فارغة حالياً. اختر قسماً وأضف المنتجات التي تريد طلبها.
</div>
) : (
<div className="mt-4 space-y-3">
{lines.map(({ p, qty, unitPrice, total: lineTotal }) => (
<div key={p.id} className="rounded-2xl border border-gray-200 p-3 flex items-center justify-between gap-3 bg-[#f9fbfa]">
<div className="min-w-0 flex-1">
<div className="font-bold text-sm truncate">{p.name}</div>
<div className="text-xs text-gray-500 mt-0.5">
{unitOf(p)} • {unitPrice} ج.م
</div>
<div className="text-xs font-bold text-[#0b7a4b] mt-1">الإجمالي: {lineTotal} ج.م</div>
</div>
<div className="flex items-center gap-1.5 shrink-0">
<button type="button" onClick={() => setQty(p.id, qty + 1)} className="w-7 h-7 rounded-lg bg-[#0b7a4b] text-white font-bold text-sm">
+
</button>
<span className="min-w-5 text-center text-xs font-bold">{qty}</span>
<button type="button" onClick={() => setQty(p.id, qty - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm">
-
</button>
</div>
</div>
))}
​<div className="flex items-center justify-between pt-2">
<button type="button" onClick={emptyCart} className="text-xs font-semibold text-red-600 hover:underline">
تفريغ السلة
</button>
<div className="text-sm font-bold">
إجمالي الطلب ({count} عنصر): {total} ج.م
</div>
</div>
</div>
)}
</div>
​{lines.length > 0 && (
<form onSubmit={checkout} className="mt-6 pt-4 border-t border-gray-200 space-y-3">
<div>
<label className="block text-xs font-semibold text-gray-700 mb-1">الاسم / اسم المنشأة</label>
<input
type="text"
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="مثال: مطعم البركة أو أ/ محمد"
className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm"
/>
</div>
<div>
<label className="block text-xs font-semibold text-gray-700 mb-1">رقم الهاتف / واتساب</label>
<input
type="tel"
value={phone}
onChange={(e) => setPhone(e.target.value)}
placeholder="01xxxxxxxxx"
className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm"
/>
</div>
<div>
<label className="block text-xs font-semibold text-gray-700 mb-1">ملاحظات التوصيل</label>
<textarea
rows={2}
value={notes}
onChange={(e) => setNotes(e.target.value)}
placeholder="العنوان أو موعد الاستلام..."
className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm"
/>
</div>
<button
type="submit"
disabled={sending}
className="w-full bg-[#0b7a4b] hover:bg-[#09633c] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm"
>
{sending ? 'جاري استكمال الطلب...' : استكمال الطلب (${total} ج.م)}
</button>
</form>
)}
</div>
</div>
)}
</div>
);
}
​export default App;
