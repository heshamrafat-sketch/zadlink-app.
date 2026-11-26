import React, { useState, useMemo, useEffect } from 'react';

// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';

// أرقام طرق الدفع المعتمدة
const INSTAPAY_NUMBER = '01224966506';
const WALLET_NUMBER = '01096549960';

// تعريف أنواع البيانات للمنصة
type CustomerType = 'wholesale' | 'retail';
type PaymentMethod = 'instapay' | 'wallet';
type DeliveryMode = 'delivery' | 'pickup';
type OrderStage = 'received' | 'preparing' | 'on_the_way' | 'delivered';

interface MerchantStore {
  id: string;
  name: string;
  zone: string;
  prepTime: string;
  courierName: string;
  deliveryFee: number;
  rating: string;
}

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
  merchantId: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ActiveOrderTracking {
  id: string;
  merchantName: string;
  courierName: string;
  deliveryMode: DeliveryMode;
  paymentMethod: PaymentMethod;
  totalWithDelivery: number;
  stage: OrderStage;
}

interface ToastState {
  text: string;
  error: boolean;
}

// متاجر وفروع التوريد المرتبطة بالدليفري
const MERCHANTS: MerchantStore[] = [
  {
    id: 'zad-hub-1',
    name: 'فرع زاد لينك الرئيسي للجملة والقطاعي',
    zone: 'قطاع التوريد السريع',
    prepTime: '15 - 25 دقيقة',
    courierName: 'كابتن طارق — دليفري زاد لينك',
    deliveryFee: 20,
    rating: '4.9',
  },
  {
    id: 'zad-fresh-2',
    name: 'مخزن الطازج والبقالة اليومية',
    zone: 'توريد الأغذية والطازج',
    prepTime: '10 - 20 دقيقة',
    courierName: 'كابتن كريم — أسطول التوصيل',
    deliveryFee: 15,
    rating: '4.8',
  },
  {
    id: 'zad-home-3',
    name: 'مركز مستلزمات البيت والمنظفات',
    zone: 'تجهيز الطلبات المنزلية والتجار',
    prepTime: '20 - 30 دقيقة',
    courierName: 'كابتن محمود — دليفري سريع',
    deliveryFee: 25,
    rating: '4.9',
  },
];

// مراحل تتبع الطلب بأسلوب منصات الطلبات
const ORDER_STAGES: { key: OrderStage; label: string; desc: string }[] = [
  { key: 'received', label: 'تم استلام الطلب', desc: 'تم تسجيل طلبك وإرساله للتاجر' },
  { key: 'preparing', label: 'التاجر يجهز الطلب', desc: 'جاري فرز وتغليف الأصناف المطلوبة' },
  { key: 'on_the_way', label: 'الدليفري في الطريق', desc: 'مندوب التوصيل متجه لتسليم الطلب' },
  { key: 'delivered', label: 'تم التسليم', desc: 'اكتملت عملية التوصيل بنجاح' },
];

// قائمة المنتجات والصور المرفقة مع أسعار الجملة والقطاعي
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'أرز أبيض مصري فاخر',
    category: 'بقالة وسلع أساسية',
    wholesalePrice: 26,
    retailPrice: 32,
    unit: 'كجم',
    description: 'أرز مصري نقي مناسب للبيت والسوبر ماركت والتجار.',
    image: './1000250092.jpg',
    emoji: '🌾',
    merchantId: 'zad-hub-1',
  },
  {
    id: 2,
    name: 'زيوت طعام نقية ومعلبات',
    category: 'زيوت ومعلبات',
    wholesalePrice: 68,
    retailPrice: 80,
    unit: 'عبوة',
    description: 'زيوت قلي وطهي ومعلبات غذائية بتوريد مستمر.',
    image: './1000250093.jpg',
    emoji: '🫙',
    merchantId: 'zad-hub-1',
  },
  {
    id: 3,
    name: 'خضروات وفواكه طازجة',
    category: 'طعام وطازج',
    wholesalePrice: 18,
    retailPrice: 24,
    unit: 'كجم',
    description: 'أصناف طازجة يومياً للمنازل والمطاعم والمتاجر.',
    image: './1000250094.jpg',
    emoji: '🛒',
    merchantId: 'zad-fresh-2',
  },
  {
    id: 4,
    name: 'منظفات وعناية بالمنزل',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 45,
    retailPrice: 58,
    unit: 'عبوة',
    description: 'مساحيق ومطهرات ومنظفات أسطح للاستخدام اليومي.',
    image: './1000250095.jpg',
    emoji: '🧴',
    merchantId: 'zad-home-3',
  },
  {
    id: 5,
    name: 'ألبان وأجبان ومخبوزات',
    category: 'ألبان ومخبوزات',
    wholesalePrice: 34,
    retailPrice: 42,
    unit: 'عبوة',
    description: 'منتجات ألبان وأجبان ومخبوزات طازجة للأسرة والسوبر ماركت.',
    image: './1000250096.jpg',
    emoji: '🧀',
    merchantId: 'zad-fresh-2',
  },
  {
    id: 6,
    name: 'مستلزمات ورقية وأدوات مطبخ',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 29,
    retailPrice: 38,
    unit: 'عبوة',
    description: 'مناديل ورقية وأدوات مطبخ عملية للتجار والمنزل.',
    image: './1000250097.jpg',
    emoji: '🧺',
    merchantId: 'zad-home-3',
  },
];

// مؤشرات أسبوعية للعرض في قسم التداول
const WEEKLY_VOLUME = [48, 64, 58, 80, 74, 90, 96];
const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

// خطوات آلية الطلب والتوريد
const HOW_IT_WORKS = [
  {
    num: '01',
    icon: '🛒',
    title: 'اختر نوع الحساب والتاجر',
    desc: 'حدد حساب التاجر (جملة) أو العميل القطاعي، واختر الفرع أو المخزن المناسب وأضف أصنافك إلى السلة.',
  },
  {
    num: '02',
    icon: '🛵',
    title: 'تجهيز الطلب وتعيين الدليفري',
    desc: 'يبدأ التاجر في تجهيز الأصناف فور إرسال الطلب مع إتاحة التوصيل عبر الدليفري أو الاستلام المباشر.',
  },
  {
    num: '03',
    icon: '💳',
    title: 'الدفع الفوري ومتابعة التسليم',
    desc: 'أتمم الدفع عبر إنستاباي أو المحفظة الإلكترونية وتابع مراحل الطلب حتى استلامه بنجاح.',
  },
];

export function App() {
  // حالات التصفية، نوع الحساب، التاجر، الدليفري، الدفع، السلة، ونموذج الطلب
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('ALL');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerType, setCustomerType] = useState<CustomerType>('retail');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('instapay');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrderTracking | null>(null);

  // بيانات نموذج إرسال الطلب
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // إخفاء إشعار النجاح تلقائياً بعد 4.5 ثوانٍ
  useEffect(() => {
    if (!toast || toast.error) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // استخراج التصنيفات المتاحة
  const categories = useMemo(() => {
    return ['الكل', ...Array.from(new Set(PRODUCTS.map((item) => item.category)))];
  }, []);

  // حساب السعر حسب نوع الحساب (تاجر جملة أو عميل قطاعي)
  const getPrice = (product: Product) =>
    customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const accountLabel = customerType === 'wholesale' ? 'تاجر (جملة)' : 'عميل قطاعي';

  // تصفية المنتجات حسب التصنيف والتاجر وكلمة البحث
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchCat = selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchMerchant =
        selectedMerchantId === 'ALL' || product.merchantId === selectedMerchantId;
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchCat && matchMerchant && matchSearch;
    });
  }, [selectedCategory, selectedMerchantId, searchQuery]);

  // المتجر/الدليفري المحدد حالياً
  const activeMerchant = useMemo(() => {
    if (selectedMerchantId === 'ALL') {
      const firstCartMerchant = cart[0]?.product.merchantId;
      return MERCHANTS.find((m) => m.id === firstCartMerchant) || MERCHANTS[0];
    }
    return MERCHANTS.find((m) => m.id === selectedMerchantId) || MERCHANTS[0];
  }, [selectedMerchantId, cart]);

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0),
    [cart, customerType]
  );

  const deliveryFee = useMemo(() => {
    if (deliveryMode === 'pickup' || totalCount === 0) return 0;
    return customerType === 'wholesale' ? 0 : activeMerchant.deliveryFee;
  }, [deliveryMode, totalCount, customerType, activeMerchant]);

  const grandTotal = totalAmount + deliveryFee;

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
    setToast({ text: `تمت إضافة "${product.name}" إلى سلة الطلبات`, error: false });
  }

  // تعديل كمية منتج في السلة
  function changeQty(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  // الانتقال بين مراحل تتبع الطلب
  function advanceOrderStage() {
    if (!activeOrder) return;
    const flow: OrderStage[] = ['received', 'preparing', 'on_the_way', 'delivered'];
    const nextStage = flow[(flow.indexOf(activeOrder.stage) + 1) % flow.length];
    setActiveOrder({ ...activeOrder, stage: nextStage });
  }

  // إرسال الطلب إلى جدول orders في Supabase
  async function handleSubmitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setToast(null);

    if (!customerName.trim() || !phone.trim()) {
      setToast({ text: 'يرجى إدخال اسم العميل ورقم الهاتف أولاً.', error: true });
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

    const paymentSummary =
      paymentMethod === 'instapay'
        ? `إنستاباي (${INSTAPAY_NUMBER})`
        : `محفظة إلكترونية (${WALLET_NUMBER})`;

    const deliverySummary =
      deliveryMode === 'delivery'
        ? `دليفري (${activeMerchant.courierName}) — رسوم ${deliveryFee} ج.م`
        : 'استلام مباشر من التاجر';

    const fullNotes = [
      `نوع الحساب: ${accountLabel}`,
      `التاجر/الفرع: ${activeMerchant.name}`,
      `التوصيل: ${deliverySummary}`,
      `الدفع: ${paymentSummary}`,
      `الأصناف: ${itemsSummary}`,
      `الإجمالي النهائي: ${grandTotal} ج.م`,
      notes.trim() ? `ملاحظات: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' — ');

    setSubmitting(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'تعذر حفظ الطلب في قاعدة البيانات');
      }

      const generatedId = `ZL-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveOrder({
        id: generatedId,
        merchantName: activeMerchant.name,
        courierName:
          deliveryMode === 'delivery' ? activeMerchant.courierName : 'استلام مباشر من التاجر',
        deliveryMode,
        paymentMethod,
        totalWithDelivery: grandTotal,
        stage: 'preparing',
      });

      setCustomerName('');
      setPhone('');
      setNotes('');
      setCart([]);
      setIsModalOpen(false);
      setToast({
        text: `تم إرسال طلبك رقم #${generatedId} بنجاح وجاري تجهيزه عبر ${activeMerchant.name}.`,
        error: false,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setToast({
        text:
          msg === 'Failed to fetch'
            ? 'تعذر الاتصال بالخادم حالياً. يرجى المحاولة مرة أخرى بعد قليل.'
            : `خطأ: ${msg}`,
        error: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="top" dir="rtl" className="app-shell">
      {/* شريط التنقل العلوي */}
      <header className="topbar">
        <div className="container nav-wrap">
          <a href="#top" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </span>
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>المنتجات والأسعار</a>
            <a href="#dispatch" onClick={() => setMobileMenuOpen(false)}>التاجر والدليفري</a>
            <a href="#trade" onClick={() => setMobileMenuOpen(false)}>مؤشر التداول</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>آلية الطلب</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>الدفع والتواصل</a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="cart-button"
            >
              <span>سلة الطلبات</span>
              <em>{totalCount}</em>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="mobile-menu"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* القسم الرئيسي (البطل + الإحصائيات) */}
      <section className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <i className="pulse-dot" />
                طعام • مستلزمات بيت • سوبر ماركت • جملة وقطاعي
              </span>

              <h1>
                منصة <span>زاد لينك</span> للطعام ومستلزمات البيت والسوبر ماركت
              </h1>

              <p>
                كل احتياجات الطعام ومستلزمات البيت للتاجر والقطاعي في مكان واحد؛ بقالة، زيوت، طازج، ومنظفات بتسعير واضح وربط مباشر مع التاجر والدليفري.
              </p>

              <div className="hero-buttons">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="primary-button"
                >
                  <span>سجّل طلبك الآن</span>
                  <span>←</span>
                </button>

                <a href="#products" className="text-button">
                  <span>تصفح المنتجات والأسعار</span>
                  <span>↓</span>
                </a>
              </div>

              <div className="hero-proof">
                <div className="proof-avatars" aria-hidden="true">
                  <span>ز</span>
                  <span>ل</span>
                  <span>+</span>
                </div>
                <div>
                  <strong>خدمة التاجر والعميل القطاعي</strong>
                  <small>توريد مستمر • دليفري سريع • دفع عبر إنستاباي والمحفظة</small>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="visual-ring ring-a" />
              <div className="visual-ring ring-b" />

              <div className="visual-center">
                <div className="crate crate-back">🛒</div>
                <div className="crate crate-front">🧺</div>
                <span className="leaf leaf-one">🌿</span>
                <span className="leaf leaf-two">✨</span>
              </div>

              <div className="floating-card card-delivery">
                <span className="mini-icon">🛵</span>
                <div>
                  <b>ربط التاجر والدليفري</b>
                  <small>تجهيز وتوصيل مباشر للباب</small>
                </div>
              </div>

              <div className="floating-card card-quality">
                <span className="quality-icon">✓</span>
                <div>
                  <b>جملة وقطاعي بتسعير واضح</b>
                  <small>غذاء، بقالة، ومستلزمات منزلية</small>
                </div>
              </div>

              <div className="visual-label">
                <span />
                ZADLINK SUPPLY & DELIVERY NETWORK
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div>
              <strong>+120</strong>
              <span>صنف غذائي ومنزلي</span>
            </div>
            <div>
              <strong>جملة / قطاعي</strong>
              <span>تسعير مرن للتجار والأسرة</span>
            </div>
            <div>
              <strong>دليفري مباشر</strong>
              <span>ربط فوري مع الفرع والمندوب</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>استقبال الطلبات يومياً</span>
            </div>
          </div>
        </div>
      </section>

      {/* لوحة ربط التاجر والموقع والدليفري وتتبع حالة الطلب */}
      <section id="dispatch" className="section">
        <div className="container">
          <div className="trade-panel">
            <div className="trade-intro">
              <span className="section-kicker">شبكة التوريد والتوصيل</span>
              <h2>
                ربط <span>التاجر والموقع والدليفري</span>
              </h2>
              <p>
                اختر الفرع أو المخزن المورد واختر بين توصيل الدليفري أو الاستلام المباشر من التاجر، وتابع مراحل الطلب خطوة بخطوة.
              </p>

              <div className="customer-type-switch" style={{ marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('delivery')}
                  className={`type-pill ${deliveryMode === 'delivery' ? 'active' : ''}`}
                >
                  توصيل دليفري
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('pickup')}
                  className={`type-pill ${deliveryMode === 'pickup' ? 'active' : ''}`}
                >
                  استلام من التاجر
                </button>
              </div>
            </div>

            <div className="metrics-grid">
              {MERCHANTS.map((merchant) => {
                const selected = merchant.id === activeMerchant.id;
                return (
                  <button
                    key={merchant.id}
                    type="button"
                    onClick={() => setSelectedMerchantId(merchant.id)}
                    className={`metric-card ${selected ? 'metric-highlight' : ''}`}
                    style={{ textAlign: 'right' }}
                  >
                    <div className="metric-top">
                      <span>{merchant.zone}</span>
                      <span>★ {merchant.rating}</span>
                    </div>
                    <strong style={{ fontSize: 15, margin: '12px 0 6px' }}>{merchant.name}</strong>
                    <small style={{ display: 'block' }}>التجهيز: {merchant.prepTime}</small>
                    <small style={{ display: 'block', marginTop: 4, color: '#6ee7b7' }}>
                      {merchant.courierName}
                    </small>
                  </button>
                );
              })}

              <div className="metric-card">
                <div className="metric-top">
                  <span>رسوم التوصيل الحالية</span>
                  <span>🛵</span>
                </div>
                <strong>
                  {deliveryMode === 'pickup'
                    ? '0 ج.م'
                    : customerType === 'wholesale'
                      ? 'مجاني'
                      : `${activeMerchant.deliveryFee} ج.م`}
                </strong>
                <small>
                  {deliveryMode === 'delivery'
                    ? customerType === 'wholesale'
                      ? 'إعفاء رسوم التوصيل لحساب الجملة'
                      : 'توصيل مباشر عبر مندوب الفرع'
                    : 'استلام مباشر من فرع التاجر'}
                </small>
              </div>
            </div>

            <div className="trade-chart" style={{ gridColumn: '1 / -1' }}>
              <div className="chart-heading">
                <span>
                  حالة الطلب الحالية:{' '}
                  <strong style={{ color: '#6ee7b7' }}>
                    {activeOrder ? `#${activeOrder.id}` : 'جاهز لاستقبال طلبك'}
                  </strong>
                </span>
                {activeOrder && (
                  <button
                    type="button"
                    onClick={advanceOrderStage}
                    className="category-chip active"
                    style={{ padding: '6px 12px' }}
                  >
                    تحديث مرحلة الطلب
                  </button>
                )}
              </div>

              <div className="steps-grid" style={{ marginTop: 14, gap: 10 }}>
                {ORDER_STAGES.map((st, index) => {
                  const activeStageKey = activeOrder ? activeOrder.stage : 'received';
                  const currentIndex = ORDER_STAGES.findIndex((s) => s.key === activeStageKey);
                  const reached = index <= currentIndex;
                  return (
                    <div
                      key={st.key}
                      className="metric-card"
                      style={{
                        padding: 14,
                        borderColor: reached
                          ? 'rgba(52, 211, 153, 0.45)'
                          : 'rgba(148, 163, 184, 0.12)',
                        opacity: reached ? 1 : 0.6,
                      }}
                    >
                      <div className="metric-top">
                        <span>0{index + 1}</span>
                        <span>{reached ? '✓' : '•'}</span>
                      </div>
                      <strong style={{ fontSize: 13, margin: '8px 0 4px' }}>{st.label}</strong>
                      <small>{st.desc}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات والأسعار */}
      <section id="products" className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">قائمة الأصناف والأسعار</span>
              <h2>
                المنتجات <span>والأسعار</span>
              </h2>
              <p>اختر نوع الحساب (تاجر جملة أو عميل قطاعي) وابحث بالاسم أو التصنيف.</p>
            </div>

            <div className="customer-type-switch">
              <button
                type="button"
                onClick={() => setCustomerType('wholesale')}
                className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('retail')}
                className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
              >
                عميل قطاعي
              </button>
            </div>

            <div className="search-box">
              <span>🔍</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج أو تصنيف..."
              />
              <kbd>{filteredProducts.length}</kbd>
            </div>
          </div>

          <div className="category-row">
            <button
              type="button"
              onClick={() => setSelectedMerchantId('ALL')}
              className={`category-chip ${selectedMerchantId === 'ALL' ? 'active' : ''}`}
            >
              كل الفروع
            </button>
            {MERCHANTS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMerchantId(m.id)}
                className={`category-chip ${selectedMerchantId === m.id ? 'active' : ''}`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="category-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const price = getPrice(product);
                return (
                  <article key={product.id} className="product-card">
                    <div className="product-image">
                      <div className="image-orb" />
                      <span className="product-emoji" aria-hidden="true">
                        {product.emoji}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="availability">
                        <i />
                        متوفر للتوريد
                      </span>
                    </div>

                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      <div className="product-bottom">
                        <div>
                          <strong>
                            {price} <small>ج.م / {product.unit}</small>
                          </strong>
                          <span>
                            {customerType === 'wholesale'
                              ? `جملة (قطاعي: ${product.retailPrice} ج.م)`
                              : `قطاعي (جملة: ${product.wholesalePrice} ج.م)`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="add-button"
                        >
                          <span>+ أضف للسلة</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <b>لا توجد منتجات مطابقة</b>
              <span>جرّب تغيير التصنيف أو كلمة البحث الحالية.</span>
            </div>
          )}

          <div className="market-note">
            <span>ℹ️</span>
            <p>
              الأسعار المعروضة استرشادية وتُحدّث وفق حركة السوق والتوريد؛ يمكنك تأكيد الكميات والأسعار النهائية عند إرسال الطلب.
            </p>
          </div>
        </div>
      </section>

      {/* قسم مؤشر التداول والبيانات */}
      <section id="trade" className="section trade-section">
        <div className="container">
          <div className="trade-panel">
            <div className="trade-intro">
              <span className="section-kicker">مؤشرات التداول اليومي</span>
              <h2>
                بيانات <span>التداول والطلب</span>
              </h2>
              <p>
                متابعة مستمرة لحركة الطلبات وتوريد السلع الغذائية والمنزلية لتجار الجملة وعملاء القطاعي.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="outline-button"
              >
                <span>بدء طلب توريد جديد</span>
                <span>←</span>
              </button>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span>حجم الطلبات اليومي</span>
                  <span>📈</span>
                </div>
                <strong>+240</strong>
                <small>طلب متنوع يومياً</small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>الأصناف النشطة</span>
                  <span>📦</span>
                </div>
                <strong>+120</strong>
                <small>بقالة، زيوت، طازج، ومنظفات</small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>فئات الحسابات</span>
                  <span>👥</span>
                </div>
                <strong>تاجر + قطاعي</strong>
                <small>تسعير مخصص لكل فئة</small>
              </div>

              <div className="metric-card metric-highlight">
                <div className="metric-top">
                  <span>جاهزية التوريد</span>
                  <span>⚡</span>
                </div>
                <strong>متاح الآن</strong>
                <small>استقبال فوري وتسجيل في قاعدة البيانات</small>
              </div>
            </div>

            <div className="trade-chart">
              <div className="chart-heading">
                <span>مؤشر حجم التداول الأسبوعي</span>
                <small>آخر 7 أيام</small>
              </div>
              <div className="chart-bars">
                {WEEKLY_VOLUME.map((val, idx) => (
                  <span
                    key={DAYS[idx]}
                    style={{ height: `${val}%` }}
                    title={`${DAYS[idx]}: ${val}%`}
                  />
                ))}
              </div>
              <div className="chart-foot">
                {DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم آلية الطلب والتوريد */}
      <section id="how-it-works" className="section">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">خطوات بسيطة وسريعة</span>
            <h2>
              آلية <span>الطلب والتوريد</span>
            </h2>
          </div>

          <div className="steps-grid">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="step-card">
                <span className="step-number">{step.num}</span>
                <div className="step-icon" aria-hidden="true">
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم طرق الدفع والتواصل */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-panel">
            <div className="contact-copy">
              <span className="section-kicker">طرق الدفع المعتمدة</span>
              <h2>
                الدفع والتواصل مع <span>زاد لينك</span>
              </h2>
              <p>
                يمكنك إتمام الدفع بسهولة عبر إنستاباي أو المحفظة الإلكترونية، وتحديد وسيلة الدفع داخل نموذج الطلب.
              </p>

              <div className="contact-details">
                <div>
                  <span>🏦</span>
                  <div>
                    <small>إنستاباي (InstaPay)</small>
                    <b dir="ltr" style={{ textAlign: 'right' }}>{INSTAPAY_NUMBER}</b>
                  </div>
                </div>

                <div>
                  <span>👛</span>
                  <div>
                    <small>المحفظة الإلكترونية</small>
                    <b dir="ltr" style={{ textAlign: 'right' }}>{WALLET_NUMBER}</b>
                  </div>
                </div>

                <div>
                  <span>🕒</span>
                  <div>
                    <small>مواعيد الخدمة</small>
                    <b>يومياً على مدار 24 ساعة</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-side">
              <div className="contact-side-top">
                <span className="contact-symbol">ز</span>
                <span className="online-label">
                  <i />
                  استقبال الطلبات نشط
                </span>
              </div>

              <h3>اطلب احتياجاتك مباشرة وسجّل بياناتك</h3>
              <p>
                اختر نوع حسابك ووسيلة الدفع (إنستاباي أو المحفظة)، راجع السلة أو اكتب ملاحظاتك، وأرسل طلبك فوراً.
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="contact-cta"
              >
                <span>فتح نموذج الطلب</span>
                <span>←</span>
              </button>

              <span className="contact-pattern" aria-hidden="true">
                ZADLINK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* تذييل الصفحة */}
      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="brand footer-brand">
            <span className="brand-mark">ز</span>
            <span>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </span>
          </a>

          <span>© {new Date().getFullYear()} زاد لينك (ZadLink) — جميع الحقوق محفوظة.</span>

          <a href="#top">العودة للأعلى ↑</a>
        </div>
      </footer>

      {/* نافذة إرسال الطلب والسلة */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="order-modal">
            <div className="modal-head">
              <div>
                <span className="section-kicker">تسجيل طلب جديد</span>
                <h2>إرسال طلبك إلى زاد لينك</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div className="customer-type-switch modal-type-switch">
              <button
                type="button"
                onClick={() => setCustomerType('wholesale')}
                className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('retail')}
                className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
              >
                عميل قطاعي
              </button>
            </div>

            {cart.length > 0 ? (
              <div className="cart-lines">
                {cart.map((item) => {
                  const unitPrice = getPrice(item.product);
                  return (
                    <div key={item.product.id} className="cart-line">
                      <div className="cart-line-info">
                        <b>{item.product.name}</b>
                        <small>
                          {unitPrice} ج.م / {item.product.unit}
                        </small>
                      </div>
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => changeQty(item.product.id, -1)}
                          aria-label="إنقاص الكمية"
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => changeQty(item.product.id, 1)}
                          aria-label="زيادة الكمية"
                        >
                          +
                        </button>
                      </div>
                      <strong className="cart-line-total">{unitPrice * item.quantity} ج.م</strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cart-empty">
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8' }}>
                  السلة فارغة حالياً — يمكنك إضافة أصناف أو كتابة طلبك مباشرة في الملاحظات.
                </p>
              </div>
            )}

            <div className="order-summary">
              <div>
                <span>الحساب:</span>
                <b>{accountLabel}</b>
              </div>
              <div>
                <span>الأصناف:</span>
                <b>{totalCount}</b>
              </div>
              <div>
                <span>
                  التاجر: <b style={{ color: '#6ee7b7' }}>{activeMerchant.name}</b>
                </span>
                <span>
                  التوصيل:{' '}
                  <b>{deliveryMode === 'delivery' ? `${deliveryFee} ج.م` : 'استلام من التاجر'}</b>
                </span>
              </div>
              <div>
                <span>الإجمالي النهائي</span>
                <b>
                  {grandTotal} <small>ج.م</small>
                </b>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="order-form">
              <div>
                <span className="form-hint" style={{ display: 'block', marginBottom: 8 }}>
                  نظام التوصيل والدليفري
                </span>
                <div className="customer-type-switch modal-type-switch" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('delivery')}
                    className={`type-pill ${deliveryMode === 'delivery' ? 'active' : ''}`}
                  >
                    دليفري ({activeMerchant.courierName.split('—')[0].trim()})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('pickup')}
                    className={`type-pill ${deliveryMode === 'pickup' ? 'active' : ''}`}
                  >
                    استلام من التاجر
                  </button>
                </div>
              </div>

              <div>
                <span className="form-hint" style={{ display: 'block', marginBottom: 8 }}>
                  وسيلة الدفع
                </span>
                <div className="customer-type-switch modal-type-switch" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`type-pill ${paymentMethod === 'instapay' ? 'active' : ''}`}
                  >
                    إنستاباي ({INSTAPAY_NUMBER})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`type-pill ${paymentMethod === 'wallet' ? 'active' : ''}`}
                  >
                    المحفظة ({WALLET_NUMBER})
                  </button>
                </div>
              </div>

              <label>
                <span>اسم العميل *</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسم العميل أو اسم النشاط"
                  required
                />
              </label>

              <label>
                <span>رقم الهاتف *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </label>

              <label>
                <span>ملاحظات الطلب والدفع</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب الأصناف المطلوبة أو بيانات التحويل وأي ملاحظات إضافية"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="primary-button submit-button"
              >
                {submitting && <span className="spinner" />}
                <span>{submitting ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* إشعارات الحالة */}
      {toast && (
        <div role="status" className={`toast ${toast.error ? 'error' : ''}`}>
          <span>{toast.error ? '⚠️' : '✓'}</span>
          <p>{toast.text}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="إغلاق الإشعار"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
