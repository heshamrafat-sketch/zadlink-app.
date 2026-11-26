import React, { useState, useMemo } from 'react';

// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';

// واجهة بيانات المنتج
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
  available: boolean;
}

type CustomerType = 'wholesale' | 'retail';
  product: Product;
  quantity: number;
}

// قائمة المنتجات الزراعية والغذائية المتاحة للتوريد
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'طماطم بلدي فرز أول',
    category: 'خضروات طازجة',
    wholesalePrice: 12,
    retailPrice: 16,
    unit: 'كجم',
    description: 'طماطم طازجة مقطوفة يومياً ومفرزة بعناية للتجار والمطاعم والعملاء.',
    image: '1000250092.jpg',
    emoji: '🍅',
    available: true,
  },
  {
    id: 2,
    name: 'بطاطس تحمير اسبونتا',
    category: 'خضروات طازجة',
    wholesalePrice: 15,
    retailPrice: 20,
    unit: 'كجم',
    description: 'بطاطس مخصصة للقلي والتحمير بنسبة نشا مثالية وجودة تخزين عالية.',
    image: '1000250093.jpg',
    emoji: '🥔',
    available: true,
  },
  {
    id: 3,
    name: 'برتقال بصرة للتصدير',
    category: 'فواكه موسمية',
    wholesalePrice: 18,
    retailPrice: 24,
    unit: 'كجم',
    description: 'برتقال طازج غني بالعصير ومعبأ في صناديق مخصصة للنقل الآمن.',
    image: '1000250094.jpg',
    emoji: '🍊',
    available: true,
  },
  {
    id: 4,
    name: 'بصل أحمر صعيدي',
    category: 'خضروات طازجة',
    wholesalePrice: 14,
    retailPrice: 18,
    unit: 'كجم',
    description: 'بصل أحمر جاف وعالي الجودة مناسب للتخزين طويل الأمد والتوريد.',
    image: '1000250095.jpg',
    emoji: '🧅',
    available: true,
  },
  {
    id: 5,
    name: 'فراولة فرتونا طازجة',
    category: 'فواكه موسمية',
    wholesalePrice: 30,
    retailPrice: 38,
    unit: 'كجم',
    description: 'فراولة منتقاة بعناية ذات حجم موحد ونكهة طبيعية غنية.',
    image: '1000250096.jpg',
    emoji: '🍓',
    available: true,
  },
  {
    id: 6,
    name: 'أرز أبيض مصري فاخر',
    category: 'حبوب وبقوليات',
    wholesalePrice: 28,
    retailPrice: 34,
    unit: 'كجم',
    description: 'أرز مصري عريض الحبة منقى إلكترونياً وخالٍ من الشوائب.',
    image: '1000250097.jpg',
    emoji: '🌾',
    available: true,
  },
];

// بيانات مؤشر التداول الأسبوعي
const WEEKLY_CHART_BARS = [42, 58, 51, 74, 68, 86, 94];
const WEEK_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

/**
 * المكون الرئيسي لمنصة زاد لينك (ZadLink)
 * يجمع بين عرض المنتجات، السلة التفاعلية، مؤشرات التداول، ونموذج إرسال الطلبات لقاعدة البيانات.
 */
export function App() {
  // حالات التصفح والبحث ونوع العميل (تاجر أو قطاعي)
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<CustomerType>('wholesale');

  // حالات سلة المشتريات ونافذة إتمام الطلب
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  // حالات نموذج العميل وإرسال الطلب
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // حالة الإشعار المنبثق (Toast)
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

  // استخراج التصنيفات المتاحة
  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((p) => p.category)));
    return ['الكل', ...unique];
  }, []);

  // تصفية المنتجات حسب التصنيف وكلمة البحث
  // دالة مساعدة للحصول على السعر المناسب حسب نوع العميل
  const getUnitPrice = (product: Product) =>
    customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const customerTypeLabel = customerType === 'wholesale' ? 'تاجر (جملة)' : 'عميل قطاعي';

  // حساب إجمالي العناصر والسعر في السلة حسب نوع العميل المختار
  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + getUnitPrice(item.product) * item.quantity, 0),
    [cart, customerType]
  );

  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // دالة عرض الإشعار المؤقت
  function showToast(message: string, isError = false) {
    setToast({ message, isError });
  }

  // إضافة منتج إلى السلة
  function handleAddToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`تمت إضافة "${product.name}" إلى سلة الطلبات`);
  }

  // تعديل الكمية داخل السلة
  function updateCartQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // إرسال الطلب النهائي إلى Supabase
  async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      showToast('يرجى إدخال اسم العميل ورقم الهاتف لإتمام الطلب', true);
      return;
    }

    // تجهيز ملخص الأصناف المطلوبة لإرفاقه مع الملاحظات
    const itemsSummary =
      cart.length > 0
        ? cart
            .map((item) => {
              const unitPrice = getUnitPrice(item.product);
              return `${item.product.name} (${item.quantity} ${item.product.unit} × ${unitPrice} ج.م)`;
            })
            .join(' | ')
        : 'طلب توريد مباشر';

    const combinedNotes = [
      `نوع الحساب: ${customerTypeLabel}`,
      `الأصناف: ${itemsSummary}`,
      totalCartPrice > 0 ? `الإجمالي التقديري: ${totalCartPrice} ج.م` : null,
      notes.trim() ? `ملاحظات العميل: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' — ');

    setLoading(true);

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
          notes: combinedNotes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'تعذر تسجيل الطلب في قاعدة البيانات');
      }

      // إعادة ضبط الحقول والسلة بعد النجاح
      setCustomerName('');
      setPhone('');
      setNotes('');
      setCart([]);
      setIsOrderModalOpen(false);
      showToast('تم إرسال طلبك بنجاح! سيتواصل معك فريق التوريد قريباً.');
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء الإرسال';
      const friendlyMessage =
        rawMessage === 'Failed to fetch'
          ? 'تعذر الاتصال بخادم قاعدة البيانات حالياً. تأكد من تفعيل مشروع Supabase أو تواصل معنا مباشرة على 01224966506.'
          : rawMessage;
      showToast(`تنبيه: ${friendlyMessage}`, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="app-shell">
      {/* الشريط العلوي */}
      <header className="topbar">
        <div className="container nav-wrap">
          <a href="#top" className="brand">
            <div className="brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </div>
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>المنتجات والأسعار</a>
            <a href="#trade" onClick={() => setMobileMenuOpen(false)}>مؤشر التداول</a>
            <a href="#steps" onClick={() => setMobileMenuOpen(false)}>آلية التوريد</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>تواصل معنا</a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="cart-button"
              onClick={() => setIsOrderModalOpen(true)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>سلة الطلبات</span>
              <em>{totalCartItems}</em>
            </button>

            <button
              type="button"
              className="mobile-menu"
              aria-label="القائمة"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* القسم الافتتاحي (Hero) */}
      <section id="top" className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" />
              منصة التوريد الغذائي والزراعي الذكية
            </div>

            <h1>
              توريد المحاصيل الطازجة <span>للتاجر والقطاعي</span> مباشرة
            </h1>

            <p>
              نربط المزارع ومحطات الفرز بالتجار والمطاعم والعملاء القطاعي بأعلى معايير الجودة، مع تسعير واضح لكل فئة وتوصيل سريع ومبرد.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <span>سجّل طلب توريد الآن</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              <a href="#products" className="text-button">
                <span>استكشف قائمة الأسعار</span>
              </a>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                <span>م</span>
                <span>أ</span>
                <span>س</span>
              </div>
              <div>
                <strong>أكثر من +320 منشأة ومطعم</strong>
                <small>تعتمد على زاد لينك في التوريد اليومي</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-ring ring-a" />
            <div className="visual-ring ring-b" />

            <div className="visual-center">
              <div className="crate crate-back">
                <span style={{ fontSize: '36px' }}>🍊</span>
              </div>
              <div className="crate crate-front">
                <span style={{ fontSize: '40px' }}>🍅</span>
              </div>
              <span className="leaf leaf-one">🌿</span>
              <span className="leaf leaf-two">🍃</span>
            </div>

            <div className="floating-card card-delivery">
              <div className="mini-icon">🚚</div>
              <div>
                <b>توصيل مبرد سريع</b>
                <small>خلال 24 ساعة لباب منشأتك</small>
              </div>
            </div>

            <div className="floating-card card-quality">
              <div className="quality-icon">✓</div>
              <div>
                <b>فرز أول معتمد</b>
                <small>مطابق لمواصفات الجودة والسلامة</small>
              </div>
            </div>

            <div className="visual-label">
              <span />
              LIVE SUPPLY NETWORK • EGYPT
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero-stats">
            <div>
              <strong>+45</strong>
              <span>صنف زراعي طازج</span>
            </div>
            <div>
              <strong>99.4%</strong>
              <span>دقة مواعيد التسليم</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>متابعة مستمرة للطلبات</span>
            </div>
            <div>
              <strong>0%</strong>
              <span>وسطاء إضافيون</span>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات والأسعار */}
      <section id="products" className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">قائمة الأسعار — تاجر وعميل قطاعي</span>
              <h2>
                المنتجات المتاحة <span>للتوريد الفوري</span>
              </h2>
              <p>اختر نوع حسابك لعرض أسعار الجملة للتجار أو الأسعار القطاعية للعملاء.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div className="customer-type-switch" role="group" aria-label="نوع العميل">
                <button
                  type="button"
                  className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
                  onClick={() => setCustomerType('wholesale')}
                >
                  تاجر (جملة)
                </button>
                <button
                  type="button"
                  className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
                  onClick={() => setCustomerType('retail')}
                >
                  عميل قطاعي
                </button>
              </div>

              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن صنف (طماطم، بطاطس...)"
                />
                <kbd>بحث</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم خطوات العمل */}
      <section id="steps" className="section">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">كيف نعمل</span>
            <h2>
              ثلاث خطوات بسيطة <span>لإتمام توريدك</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">🛒</div>
              <h3>اختر الأصناف والكميات</h3>
              <p>تصفح قائمة المنتجات اليومية وأضف الأصناف المطلوبة إلى سلة الطلبات أو اكتب احتياجاتك مباشرة.</p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">📋</div>
              <h3>سجّل بيانات التواصل</h3>
              <p>أدخل اسمك أو اسم المنشأة ورقم الهاتف وأي ملاحظات حول مواعيد الاستلام أو المواصفات المطلوبة.</p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">🚚</div>
              <h3>التأكيد والتوصيل السريع</h3>
              <p>يراجع فريق المبيعات طلبك فوراً ويتم تجهيز الشحنة وتوصيلها في الموعد المحدد بأعلى جودة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل والعنوان */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-panel">
            <div className="contact-copy">
              <span className="section-kicker">التواصل والمقر</span>
              <h2>
                تواصل مع <span>فريق زاد لينك</span>
              </h2>
              <p>
                فريقنا جاهز للرد على استفسارات التوريد والتعاقدات الدورية للمطاعم والفنادق والأسواق التجارية.
              </p>

              <div className="contact-details">
                <a href="tel:01224966506">
                  <span>📞</span>
                  <div>
                    <small>الهاتف وخدمة العملاء</small>
                    <b dir="ltr">0122 496 6506</b>
                  </div>
                </a>

                <div>
                  <span>📍</span>
                  <div>
                    <small>العنوان الرئيسي ومراكز التوزيع</small>
                    <b>بورفؤاد — مساكن الطاقة الشمسية، بورسعيد، مصر</b>
                  </div>
                </div>

                <div>
                  <span>⏰</span>
                  <div>
                    <small>مواعيد استقبال الطلبات</small>
                    <b>يومياً على مدار 24 ساعة</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-side">
              <div className="contact-side-top">
                <div className="contact-symbol">🌱</div>
                <div className="online-label">
                  <i />
                  <span>استقبال الطلبات متاح الآن</span>
                </div>
              </div>

              <h3>ابدأ طلبك الأول خلال ثوانٍ</h3>
              <p>سجّل بياناتك في نموذج الطلبات المباشر وسيتم حفظ طلبك وتأكيده فوراً.</p>

              <button
                type="button"
                className="contact-cta"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <span>فتح نموذج إرسال الطلب</span>
                <span>←</span>
              </button>

              <div className="contact-pattern">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* التذييل (Footer) */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand footer-brand">
            <div className="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </div>
          </div>

          <span>© {new Date().getFullYear()} زاد لينك للتوريدات الغذائية والزراعية. جميع الحقوق محفوظة.</span>

          <a href="#top">العودة للأعلى ↑</a>
        </div>
      </footer>

      {/* نافذة سلة المشتريات وإرسال الطلب إلى Supabase */}
      {isOrderModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOrderModalOpen(false);
          }}
        >
          <div className="order-modal">
            <div className="modal-head">
              <div>
                <span className="section-kicker">تأكيد وإرسال الطلب</span>
                <h2>إرسال طلب جديد</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="إغلاق"
                onClick={() => setIsOrderModalOpen(false)}
              >
                ✕
              </button>
            </div>

                    <div className="product-bottom">
                      <div>
                        <strong>
                          {getUnitPrice(product)} <small>ج.م / {product.unit}</small>
                        </strong>
                        <span>
                          {customerType === 'wholesale'
                            ? `سعر التاجر (قطاعي: ${product.retailPrice} ج.م)`
                            : `سعر العميل القطاعي (تاجر: ${product.wholesalePrice} ج.م)`}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="add-button"
                        onClick={() => handleAddToCart(product)}
                      >
            {/* مبدل نوع العميل داخل نافذة الطلب */}
            <div className="customer-type-switch modal-type-switch" role="group" aria-label="نوع العميل">
              <button
                type="button"
                className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
                onClick={() => setCustomerType('wholesale')}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
                onClick={() => setCustomerType('retail')}
              >
                عميل قطاعي
              </button>
            </div>

            {/* محتويات السلة داخل النافذة */}
            {cart.length > 0 ? (
              <div className="cart-lines">
                {cart.map((item) => {
                  const unitPrice = getUnitPrice(item.product);
                  return (
                    <div key={item.product.id} className="cart-line">
                      <div className="cart-line-info">
                        <b>{item.product.name}</b>
                        <small>
                          {unitPrice} ج.م / {item.product.unit} ({customerTypeLabel})
                        </small>
                      </div>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <strong className="cart-line-total">
                        {unitPrice * item.quantity} ج.م
                      </strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cart-empty">
                <small style={{ color: '#475569' }}>
                  لم تختر أصنافاً من القائمة بعد — يمكنك كتابة الأصناف المطلوبة مباشرة في خانة الملاحظات بالأسفل.
                </small>
              </div>
            )}

            <div className="order-summary">
              <div>
                <span>📦</span>
                <span>نوع الحساب ({customerTypeLabel})</span>
              </div>
              <b>{totalCartItems} صنف</b>

              <div>
                <span>الإجمالي التقديري</span>
                <b>
                  {totalCartPrice} <small>ج.م</small>
                </b>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="order-form">
              <label>
                <span>اسم العميل أو المنشأة *</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسم العميل أو اسم المطعم"
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
                <span>ملاحظات وتفاصيل التوصيل</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب الأصناف المطلوبة أو عنوان التوصيل وأي ملاحظات إضافية"
                />
              </label>

              <span className="form-hint">
                سيتم تسجيل طلبك مباشرة في النظام والتواصل معك لتأكيد الكميات وموعد التسليم.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="primary-button submit-button"
              >
                {loading && <span className="spinner" />}
                <span>{loading ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* إشعار الحالة (Toast) */}
      {toast && (
        <div className={`toast ${toast.isError ? 'error' : ''}`} role="status">
          <span>{toast.isError ? '⚠️' : '✅'}</span>
          <p>{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="إغلاق">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
