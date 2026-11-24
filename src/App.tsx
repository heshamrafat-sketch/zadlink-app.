import { useState } from 'react';
import { ShoppingBag, Phone, CheckCircle2, Truck, ShieldCheck, Sparkles, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  wholesalePrice: number;
  retailPriceLabel: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  // الأرز
  { id: 1, name: 'أرز مصري فاخر عريض الحبة', category: 'الأرز', unit: 'شيكارة 25 كجم (28 ج/كجم)', wholesalePrice: 700, retailPriceLabel: 'القطاعي: 32 – 35 ج.م / كجم', badge: 'الأكثر طلباً' },
  { id: 2, name: 'أرز بسمتي هندي حبة طويلة', category: 'الأرز', unit: 'شيكارة 25 كجم (56 ج/كجم)', wholesalePrice: 1400, retailPriceLabel: 'القطاعي: 65 – 72 ج.م / كجم' },

  // البطاطس
  { id: 3, name: 'بطاطس طازجة فرز أول (تحمير/طبيخ)', category: 'البطاطس', unit: 'شيكارة 25 كجم (12 ج/كجم)', wholesalePrice: 300, retailPriceLabel: 'القطاعي: 16 – 20 ج.م / كجم', badge: 'سعر اليوم' },
  { id: 4, name: 'بطاطس نصف مقلية (فارم فريتس/جملة)', category: 'البطاطس', unit: 'كرتونة 10 كجم (58 ج/كجم)', wholesalePrice: 580, retailPriceLabel: 'القطاعي: 68 – 75 ج.م / كجم' },

  // الخضروات
  { id: 5, name: 'خضروات طازجة مشكلة (طماطم/خيار/فلفل)', category: 'الخضروات', unit: 'عداية / صندوق 15 كجم', wholesalePrice: 240, retailPriceLabel: 'القطاعي: 20 – 25 ج.م / كجم', badge: 'طازج يومياً' },
  { id: 6, name: 'خضار مجمد متنوع (بسلة/ملوخية/بامية)', category: 'الخضروات', unit: 'كرتونة 20 كيس × 400 جم', wholesalePrice: 460, retailPriceLabel: 'القطاعي: 28 – 34 ج.م / الكيس' },

  // الأسماك
  { id: 7, name: 'سمك بلطي طازج درجة أولى', category: 'الأسماك', unit: 'طاولة 20 كجم (72 ج/كجم)', wholesalePrice: 1440, retailPriceLabel: 'القطاعي: 85 – 95 ج.م / كجم' },
  { id: 8, name: 'فيليه سمك أبيض مجمد', category: 'الأسماك', unit: 'كرتونة 10 كجم (145 ج/كجم)', wholesalePrice: 1450, retailPriceLabel: 'القطاعي: 170 – 185 ج.م / كجم', badge: 'تجهيز مطاعم' },

  // الألبان
  { id: 9, name: 'حليب معبأ كامل الدسم (1 لتر)', category: 'الألبان', unit: 'كرتونة 12 عبوة (38 ج/عبوة)', wholesalePrice: 456, retailPriceLabel: 'القطاعي: 44 – 48 ج.م / لتر' },
  { id: 10, name: 'جبنة بيضاء فيتا / ثلاجة جملة', category: 'الألبان', unit: 'جردل 10 كجم (78 ج/كجم)', wholesalePrice: 780, retailPriceLabel: 'القطاعي: 95 – 110 ج.م / كجم' },

  // الفاكهة
  { id: 11, name: 'فاكهة موسمية طازجة (موز/برتقال/تفاح)', category: 'الفاكهة', unit: 'صندوق 15 كجم (22 ج/كجم)', wholesalePrice: 330, retailPriceLabel: 'القطاعي: 28 – 35 ج.م / كجم' },
  { id: 12, name: 'لب وقطع فواكه مجمدة للعصائر (مانجو/فراولة)', category: 'الفاكهة', unit: 'كرتونة 10 كجم (55 ج/كجم)', wholesalePrice: 550, retailPriceLabel: 'القطاعي: 68 – 75 ج.م / كجم' },

  // العصائر
  { id: 13, name: 'عصائر نكتار نكهات متنوعة (235 مل)', category: 'العصائر', unit: 'كرتونة 27 عبوة (8.5 ج/عبوة)', wholesalePrice: 230, retailPriceLabel: 'القطاعي: 11 – 12 ج.م / عبوة' },
  { id: 14, name: 'مركزات شراب وعصائر للمنشآت (5 لتر)', category: 'العصائر', unit: 'كرتونة 4 جراكن (240 ج/جركن)', wholesalePrice: 960, retailPriceLabel: 'القطاعي: 285 – 310 ج.م / جركن' },

  // الدواجن
  { id: 15, name: 'صدور دواجن مخلية (بانيه) مبرد/مجمد', category: 'الدواجن', unit: 'كرتونة 10 كجم (168 ج/كجم)', wholesalePrice: 1680, retailPriceLabel: 'القطاعي: 190 – 205 ج.م / كجم', badge: 'الأكثر طلباً' },
  { id: 16, name: 'دواجن بيضاء كاملة مجمدة (أوزان صافية)', category: 'الدواجن', unit: 'كرتونة 10 كجم (108 ج/كجم)', wholesalePrice: 1080, retailPriceLabel: 'القطاعي: 122 – 130 ج.م / كجم' },

  // البيض
  { id: 17, name: 'بيض مائدة أبيض مزارع', category: 'البيض', unit: 'كرتونة 12 طبق / 360 بيضة (145 ج/طبق)', wholesalePrice: 1740, retailPriceLabel: 'القطاعي: 160 – 168 ج.م / الطبق', badge: 'بورصة اليوم' },
  { id: 18, name: 'بيض مائدة أحمر مزارع', category: 'البيض', unit: 'كرتونة 12 طبق / 360 بيضة (148 ج/طبق)', wholesalePrice: 1776, retailPriceLabel: 'القطاعي: 165 – 172 ج.م / الطبق' },

  // اللحوم
  { id: 19, name: 'لحوم بقري مجمدة (مكعبات / مفروم)', category: 'اللحوم', unit: 'كرتونة 10 كجم (235 ج/كجم)', wholesalePrice: 2350, retailPriceLabel: 'القطاعي: 265 – 285 ج.م / كجم', badge: 'جودة مختارة' },
  { id: 20, name: 'لحوم بقري بلدي مشفي (توريد فنادق ومطاعم)', category: 'اللحوم', unit: 'عبوة 10 كجم (345 ج/كجم)', wholesalePrice: 3450, retailPriceLabel: 'القطاعي: 390 – 420 ج.م / كجم' },
];

const CATEGORIES = [
  'الكل',
  'الخضروات',
  'البطاطس',
  'الأسماك',
  'الألبان',
  'الفاكهة',
  'العصائر',
  'الدواجن',
  'البيض',
  'الأرز',
  'اللحوم',
];

export function App() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderSent, setOrderSent] = useState(false);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch =
      item.name.includes(searchQuery.trim()) || item.category.includes(searchQuery.trim());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setOrderSent(false);
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    return sum + (product ? product.wholesalePrice * qty : 0);
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
              <span className="text-xs text-emerald-700 font-medium">توريد غذائي وتوزيع بسعر الجملة</span>
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
          src="/banner.png"
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
              <span>أسعار الجملة المباشرة للمنشآت والتجار</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              منصة زاد لينك للتوريد الغذائي وتجهيز المنشآت والمحلات
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              اطلب احتياجاتك من الخضروات، البطاطس، الأسماك، الألبان، الفاكهة، العصائر، الدواجن، البيض، الأرز، واللحوم بسعر الجملة مع بيان سعر القطاعي الاسترشادي لكل صنف.
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
            <h2 className="text-xl font-bold text-stone-900">قائمة الأقسام وأسعار الجملة</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صنف أو قسم..."
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-stone-900">{product.name}</h3>
                  <p className="text-xs text-stone-600">عبوة الجملة: {product.unit}</p>
                  <p className="text-xs font-medium text-stone-500 bg-stone-100 inline-block px-2.5 py-1 rounded-lg">
                    {product.retailPriceLabel}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-700 font-semibold block">سعر الجملة</span>
                    <span className="text-lg font-extrabold text-emerald-800">{product.wholesalePrice}</span>
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
          <h2 className="text-lg font-bold text-stone-900 mb-3">ملخص طلب الجملة</h2>

          {orderSent && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>تم تسجيل طلبك بنجاح! سنقوم بمراجعة الأصناف والتواصل معك.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-sm text-stone-700">
              <p>عدد الوحدات المختارة: <strong className="text-stone-900">{totalItems}</strong></p>
              <p>إجمالي الجملة التقديري: <strong className="text-emerald-800 text-base">{totalPrice} ج.م</strong></p>
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
          <span>توريد غذائي موثوق بسعر الجملة</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
