import { useState } from 'react';
import { ShoppingBag, Phone, CheckCircle2, Truck, ShieldCheck, Sparkles, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  price: number;
  badge?: string;
  image?: string;

}

const PRODUCTS: Product[] = [
  { id: 1, name: 'أرز بسمتي هندي درجة أولى', category: 'حبوب وأرز', unit: 'شيكارة 25 كجم', price: 1450, badge: 'الأكثر طلباً', image: './rice.jpg.png' },
  { id: 2, name: 'زيت طعام نقي عباد الشمس', category: 'زيوت وسمن', unit: 'جركن 18 لتر', price: 1280, badge: 'عرض مميز' },
  { id: 3, name: 'مكرونة متنوعة جملة', category: 'مكرونات', unit: 'كرتونة 20 كيس', price: 360 },
  { id: 4, name: 'سكر أبيض مكرر ناعم', category: 'أساسيات', unit: 'شيكارة 50 كجم', price: 1750 },
  { id: 5, name: 'صلصة طماطم مركزة', category: 'معلبات', unit: 'كرتونة 24 عبوة', price: 540 },
  { id: 6, name: 'دقيق فاخر للمخبوزات والحلويات', category: 'حبوب وأرز', unit: 'شيكارة 25 كجم', price: 620 },
];

const CATEGORIES = ['الكل', 'حبوب وأرز', 'زيوت وسمن', 'مكرونات', 'أساسيات', 'معلبات'];

export function App() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderSent, setOrderSent] = useState(false);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = item.name.includes(searchQuery.trim());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setOrderSent(false);
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const handleCheckout = () => {
    if (totalItems === 0) return;
    setOrderSent(true);
    setCart({});
  };

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ز
            </div>
            <div>
              <span className="font-bold text-lg text-stone-900 block leading-tight">زاد لينك | ZadLink</span>
              <span className="text-xs text-emerald-700 font-medium">توريد غذائي وتوزيع جملة</span>
            </div>
          </div>

          <a
            href="#order-summary"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-sm font-medium transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلب ({totalItems})</span>
          </a>
        </div>
      </header>

      {/* Banner Section */}
      <div className="mx-auto max-w-6xl w-full px-4 pt-4">
        <img
          src="./banner.png"
          alt="زاد لينك - ZadLink للتوريد الغذائي"
          className="w-full h-52 sm:h-72 md:h-96 object-cover rounded-2xl shadow-md bg-stone-200"
        />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl w-full px-4 py-8 flex-1 space-y-10">
        {/* Hero Intro */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>توريد منتظم وجودة مضمونة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              منصة زاد لينك للتوريد الغذائي وتجهيز المنشآت والمحلات
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              تصفح الأصناف الأساسية، اختر الكميات المناسبة لنشاطك، وأرسل قائمة طلبك بسهولة وسرعة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-sm font-medium text-stone-700">فحص جودة ومطابقة المواصفات</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-sm font-medium text-stone-700">توصيل منظم وجدولة توريد</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-sm font-medium text-stone-700">متابعة مباشرة للطلبات</span>
            </div>
          </div>
        </section>

        {/* Search & Categories */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-stone-900">قائمة الأصناف</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صنف..."
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-sm hover:shadow transition"
              >
               {product.image && (
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-40 object-cover rounded-xl mb-3"
  />
)}
 
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-stone-500">{product.category}</span>
                    {product.badge && (
                      <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-stone-900">{product.name}</h3>
                  <p className="text-xs text-stone-500">العبوة: {product.unit}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-emerald-800">{product.price}</span>
                    <span className="text-xs text-stone-500 mr-1">ج.م</span>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="rounded-xl bg-stone-900 hover:bg-emerald-700 text-white text-sm font-medium px-3.5 py-2 transition"
                  >
                    أضف للطلب {cart[product.id] ? `(${cart[product.id]})` : ''}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section id="order-summary" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-3">ملخص الطلب</h2>

          {orderSent && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>تم تسجيل طلبك بنجاح! سنقوم بمراجعة الأصناف والتواصل معك.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-sm text-stone-700">
              <p>عدد الوحدات المختارة: <strong className="text-stone-900">{totalItems}</strong></p>
              <p>الإجمالي التقديري: <strong className="text-emerald-800 text-base">{totalPrice} ج.م</strong></p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={totalItems === 0}
              className="rounded-xl bg-emerald-700 disabled:bg-stone-300 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 text-sm transition"
            >
              تأكيد الطلب
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-6 mt-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} زاد لينك | ZadLink — جميع الحقوق محفوظة</span>
          <span>توريد غذائي موثوق</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
