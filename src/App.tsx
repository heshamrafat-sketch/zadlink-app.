import React, { useState, useMemo } from 'react';

// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';

// تعريف أنواع البيانات للمنتجات والعملاء وعناصر السلة
type CustomerType = 'wholesale' | 'retail';

interface Product {
  id: number;
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  unit: string;
  description: string;
  image: string;
  emoji: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// قائمة المنتجات المرفقة مع أسعار الجملة والقطاعي
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'أرز أبيض مصري فاخر',
    category: 'بقالة وسلع أساسية',
    wholesalePrice: 26,
    retailPrice: 32,
    unit: 'كجم',
    description: 'أرز مصري نقي مناسب للبيت والسوبر ماركت والتجار.',
    image: '1000250092.jpg',
    emoji: '🌾',
  },
  {
    id: 2,
    name: 'زيوت طعام نقية ومعلبات',
    category: 'زيوت ومعلبات',
    wholesalePrice: 68,
    retailPrice: 80,
    unit: 'عبوة',
    description: 'زيوت قلي وطهي ومعلبات غذائية بتوريد مستمر.',
    image: '1000250093.jpg',
    emoji: '🫙',
  },
  {
    id: 3,
    name: 'خضروات وفواكه طازجة',
    category: 'طعام وطازج',
    wholesalePrice: 18,
    retailPrice: 24,
    unit: 'كجم',
    description: 'أصناف طازجة يومياً للمنازل والمطاعم والمتاجر.',
    image: '1000250094.jpg',
    emoji: '🛒',
  },
  {
    id: 4,
    name: 'منظفات وعناية بالمنزل',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 45,
    retailPrice: 58,
    unit: 'عبوة',
    description: 'مساحيق ومطهرات ومنظفات أسطح للاستخدام اليومي.',
    image: '1000250095.jpg',
    emoji: '🧴',
  },
  {
    id: 5,
    name: 'ألبان وأجبان ومخبوزات',
    category: 'ألبان ومخبوزات',
    wholesalePrice: 34,
    retailPrice: 42,
    unit: 'عبوة',
    description: 'منتجات ألبان وأجبان ومخبوزات طازجة للأسرة والسوبر ماركت.',
    image: '1000250096.jpg',
    emoji: '🧀',
  },
  {
    id: 6,
    name: 'مستلزمات ورقية وأدوات مطبخ',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 29,
    retailPrice: 38,
    unit: 'عبوة',
    description: 'مناديل ورقية وأدوات مطبخ عملية للتجار والمنزل.',
    image: '1000250097.jpg',
    emoji: '🧺',
  },
];

// مؤشرات أسبوعية للعرض في قسم التداول
const WEEKLY_VOLUME = [48, 64, 58, 80, 74, 90, 96];
const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export function App() {
  // حالات التصفية، نوع العميل، السلة، ونموذج الطلب
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerType, setCustomerType] = useState<CustomerType>('retail');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // بيانات نموذج إرسال الطلب
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  // استخراج التصنيفات المتاحة تلقائياً
  const categories = useMemo(() => {
    return ['الكل', ...Array.from(new Set(PRODUCTS.map((item) => item.category)))];
  }, []);

  // تصفية المنتجات حسب التصنيف وكلمة البحث
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchCat = selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // حساب السعر حسب نوع الحساب (تاجر جملة أو عميل قطاعي)
  const getPrice = (product: Product) =>
    customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const accountLabel = customerType === 'wholesale' ? 'تاجر (جملة)' : 'عميل قطاعي';

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0),
    [cart, customerType]
  );

  // إضافة منتج إلى السلة
  function addToCart(product: Product) {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setFeedback({ text: `تمت إضافة "${product.name}" إلى السلة`, error: false });
  }

  // تعديل كمية منتج في السلة
  function changeQty(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  // إرسال الطلب إلى جدول orders في Supabase مع معالجة الأخطاء
  async function handleSubmitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    if (!customerName.trim() || !phone.trim()) {
      setFeedback({ text: 'يرجى إدخال اسم العميل ورقم الهاتف أولاً.', error: true });
      return;
    }

    const itemsSummary =
      cart.length > 0
        ? cart
            .map(
              (item) =>
                `${item.product.name} (${item.quantity} ${item.product.unit} × ${getPrice(
                  item.product
                )} ج.م)`
            )
            .join(' | ')
        : 'طلب مباشر من السوبر ماركت / مستلزمات البيت';

    const fullNotes = [
      `نوع الحساب: ${accountLabel}`,
      `الأصناف: ${itemsSummary}`,
      totalAmount > 0 ? `الإجمالي التقديري: ${totalAmount} ج.م` : null,
      notes.trim() ? `ملاحظات: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' — ');

    setSubmitting(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          notes: fullNotes,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'تعذر حفظ الطلب في قاعدة البيانات');
      }

      setCustomerName('');
      setPhone('');
      setNotes('');
      setCart([]);
      setIsModalOpen(false);
      setFeedback({
        text: 'تم إرسال طلبك بنجاح! سيتواصل معك فريق زاد لينك قريباً.',
        error: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setFeedback({
        text:
          msg === 'Failed to fetch'
            ? 'تعذر الاتصال بالخادم حالياً. يمكنك التواصل على 01224966506.'
            : `خطأ: ${msg}`,
        error: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* شريط التنقل العلوي */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-extrabold text-slate-950">
              ز
            </span>
            <div>
              <b className="block text-base font-extrabold text-white">زاد لينك</b>
              <small className="block text-[10px] tracking-widest text-emerald-400">ZADLINK</small>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-xs text-slate-300 md:flex">
            <a href="#products" className="hover:text-emerald-400 transition">المنتجات والأسعار</a>
            <a href="#trade" className="hover:text-emerald-400 transition">بيانات التداول</a>
            <a href="#contact" className="hover:text-emerald-400 transition">التواصل والعنوان</a>
          </nav>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 transition"
          >
            <span>سلة الطلبات</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-emerald-500 px-1.5 text-[11px] font-extrabold text-slate-950">
              {totalCount}
            </span>
          </button>
        </div>
      </header>

      {/* القسم الرئيسي الترحيبي */}
      <section id="top" className="mx-auto max-w-6xl px-4 pt-12 pb-10">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 md:p-10 shadow-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            طعام • مستلزمات بيت • سوبر ماركت • جملة وقطاعي
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            منصة <span className="text-emerald-400">زاد لينك</span> للطعام ومستلزمات البيت والسوبر ماركت
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            نوفر احتياجات الأسرة والمتاجر من سلع غذائية وبقالة وزيوت ومنظفات وأدوات منزلية بأسعار واضحة للتاجر والعميل القطاعي مع تسجيل فوري للطلبات.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-extrabold text-slate-950 hover:bg-emerald-400 transition"
            >
              إرسال طلب جديد الآن
            </button>
            <a
              href="#products"
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 transition"
            >
              تصفح المنتجات والأسعار
            </a>
          </div>
        </div>
      </section>

      {/* قسم المنتجات والتسعير */}
      <section id="products" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold text-emerald-400">قائمة الأصناف المتاحة</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
              المنتجات <span className="text-emerald-400">والأسعار</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setCustomerType('wholesale')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  customerType === 'wholesale'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('retail')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  customerType === 'retail'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                عميل قطاعي
              </button>
            </div>

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج أو تصنيف..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none sm:w-60"
            />
          </div>
        </div>

        {/* أشرطة التصنيفات */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* شبكة المنتجات */}
        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const price = getPrice(product);
              return (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg"
                >
                  <div>
                    <div className="relative flex h-44 items-center justify-center bg-slate-950">
                      <span className="text-6xl" aria-hidden="true">
                        {product.emoji}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute top-3 right-3 rounded-lg border border-emerald-500/30 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        متوفر
                      </span>
                    </div>

                    <div className="p-4">
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {product.category}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-white">{product.name}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
                    <div>
                      <strong className="text-lg font-extrabold text-white">
                        {price} <small className="text-xs font-normal text-slate-400">ج.م / {product.unit}</small>
                      </strong>
                      <span className="block text-[10px] text-slate-400">
                        {customerType === 'wholesale'
                          ? `سعر التاجر (قطاعي: ${product.retailPrice} ج.م)`
                          : `سعر القطاعي (تاجر: ${product.wholesalePrice} ج.م)`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition"
                    >
                      + أضف للسلة
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center text-xs text-slate-400">
            لا توجد منتجات مطابقة لبحثك حالياً.
          </div>
        )}
      </section>

      {/* قسم التداول والمؤشرات والبيانات */}
      <section id="trade" className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-400">مؤشرات الحركة اليومية</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">
                بيانات <span className="text-emerald-400">التداول والتوريد</span>
              </h2>
            </div>
            <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              تحديث مستمر • جملة وقطاعي
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">الطلبات اليومية</span>
              <strong className="mt-2 block text-xl font-extrabold text-emerald-400">+240</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">الأصناف الأساسية</span>
              <strong className="mt-2 block text-xl font-extrabold text-white">+120</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">فئات العملاء</span>
              <strong className="mt-2 block text-xl font-extrabold text-white">تاجر + قطاعي</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">استقبال الطلبات</span>
              <strong className="mt-2 block text-xl font-extrabold text-emerald-400">24/7</strong>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>مؤشر النشاط الأسبوعي</span>
              <span>آخر 7 أيام</span>
            </div>
            <div className="flex h-28 items-end gap-2 border-b border-slate-800 pb-1">
              {WEEKLY_VOLUME.map((val, i) => (
                <div
                  key={DAYS[i]}
                  style={{ height: `${val}%` }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400"
                  title={`${DAYS[i]}: ${val}%`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل والعنوان */}
      <section id="contact" className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2 md:p-8">
          <div>
            <span className="text-xs font-semibold text-emerald-400">بيانات التواصل والموقع</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white">
              تواصل مع <span className="text-emerald-400">زاد لينك</span>
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              نسعد باستقبال طلبات التوريد للجملة والعملاء القطاعي وطلبات المنزل والسوبر ماركت يومياً.
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                <span className="block text-[11px] text-slate-500">رقم الهاتف وخدمة العملاء</span>
                <a href="tel:01224966506" dir="ltr" className="mt-0.5 inline-block font-bold text-emerald-300">
                  0122 496 6506
                </a>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                <span className="block text-[11px] text-slate-500">العنوان</span>
                <b className="mt-0.5 block text-slate-200">
                  بورفؤاد — مساكن الطاقة الشمسية، محافظة بورسعيد، مصر
                </b>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                <span className="block text-[11px] text-slate-500">مواعيد العمل</span>
                <b className="mt-0.5 block text-slate-200">يومياً على مدار 24 ساعة</b>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/70 to-slate-950 p-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                استقبال الطلبات متاح الآن
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-white">
                اطلب احتياجاتك مباشرة وسجّل بياناتك
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-emerald-100/80">
                اختر نوع حسابك (تاجر أو عميل قطاعي)، راجع الأصناف في السلة أو اكتب قائمة طلباتك في الملاحظات، وأرسل طلبك فوراً.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 text-xs font-extrabold text-slate-950 hover:bg-emerald-300 transition"
            >
              فتح نموذج إرسال الطلب
            </button>
          </div>
        </div>
      </section>

      {/* تذييل الصفحة */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <span>© {new Date().getFullYear()} زاد لينك (ZadLink) — جميع الحقوق محفوظة.</span>
          <a href="#top" className="text-emerald-400 hover:underline">العودة للأعلى ↑</a>
        </div>
      </footer>

      {/* نافذة إرسال الطلب */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white">إرسال طلب جديد</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setCustomerType('wholesale')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  customerType === 'wholesale' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('retail')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  customerType === 'retail' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                عميل قطاعي
              </button>
            </div>

            {cart.length > 0 ? (
              <div className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
                {cart.map((item) => {
                  const unitPrice = getPrice(item.product);
                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-2 border-b border-slate-800/70 pb-2 last:border-b-0 last:pb-0 text-xs"
                    >
                      <div>
                        <b className="block text-white">{item.product.name}</b>
                        <span className="text-[11px] text-slate-400">
                          {unitPrice} ج.م / {item.product.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQty(item.product.id, -1)}
                          className="h-6 w-6 rounded bg-slate-800 font-bold text-white"
                        >
                          -
                        </button>
                        <span className="min-w-4 text-center font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.product.id, 1)}
                          className="h-6 w-6 rounded bg-emerald-600 font-bold text-white"
                        >
                          +
                        </button>
                        <strong className="min-w-14 text-left text-emerald-300">
                          {unitPrice * item.quantity} ج.م
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
                السلة فارغة حالياً — يمكنك إضافة منتجات أو كتابة طلبك مباشرة في الملاحظات.
              </p>
            )}

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs">
              <span className="text-slate-400">
                الحساب: <b className="text-slate-200">{accountLabel}</b> ({totalCount} صنف)
              </span>
              <strong className="text-sm font-extrabold text-emerald-400">
                الإجمالي: {totalAmount} ج.م
              </strong>
            </div>

            <form onSubmit={handleSubmitOrder} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-slate-300">اسم العميل *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسم العميل أو اسم المنشأة"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-slate-300">رقم الهاتف *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-slate-300">ملاحظات</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب الأصناف المطلوبة أو عنوان التوصيل وأي ملاحظات إضافية"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-600 py-3 font-extrabold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                {submitting ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* شريط إشعارات الحالة */}
      {feedback && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 z-50 flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-xs shadow-2xl ${
            feedback.error
              ? 'border-amber-500/40 bg-slate-900 text-amber-200'
              : 'border-emerald-500/40 bg-slate-900 text-emerald-200'
          }`}
        >
          <span className="flex-1 leading-relaxed">{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="rounded-md px-1.5 py-0.5 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
