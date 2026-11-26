import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpLeft, BadgeCheck, BarChart3, Boxes, CheckCircle2, ChevronDown, CircleHelp, Clock3, Facebook, Fish, Leaf, Mail, MapPin, Menu, Package, Phone, Search, ShoppingBasket, ShoppingCart, Truck, Wheat, X } from 'lucide-react'

type Product = { id: number; name: string; category: string; unit: string; price: number; image: string; icon: string; description: string }
const categories = ['الكل', 'زيوت', 'حبوب وأرز', 'خضروات', 'فاكهة', 'لحوم', 'دواجن', 'أسماك', 'ألبان', 'بيض', 'عصائر']
const products: Product[] = [
  { id: 1, name: 'زيت عباد الشمس', category: 'زيوت', unit: 'عبوة 1 لتر', price: 78, image: '1000250092.jpg', icon: '🫒', description: 'زيت طهي نقي للاستخدام اليومي' },
  { id: 2, name: 'أرز مصري فاخر', category: 'حبوب وأرز', unit: 'كيلو', price: 32, image: '1000250093.jpg', icon: '🌾', description: 'حبة مختارة وجودة ممتازة' },
  { id: 3, name: 'بطاطس طازجة', category: 'خضروات', unit: 'كيلو', price: 18, image: '1000250094.jpg', icon: '🥔', description: 'توريد يومي من المزارع' },
  { id: 4, name: 'فيليه سمك', category: 'أسماك', unit: 'كيلو', price: 195, image: '1000250095.jpg', icon: '🐟', description: 'منتجات بحرية مختارة بعناية' },
  { id: 5, name: 'صدور دجاج', category: 'دواجن', unit: 'كيلو', price: 145, image: '1000250096.jpg', icon: '🍗', description: 'تعبئة مناسبة للتوريد التجاري' },
  { id: 6, name: 'جبنة بيضاء', category: 'ألبان', unit: 'كيلو', price: 92, image: '1000250097.jpg', icon: '🧀', description: 'منتجات ألبان من موردين موثوقين' },
]
const money = (n: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(n)

export default function App() {
  const [category, setCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [orderOpen, setOrderOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [customer, setCustomer] = useState({ customer_name: '', phone: '', notes: '' })
  const filtered = useMemo(() => products.filter(p => (category === 'الكل' || p.category === category) && `${p.name} ${p.category}`.includes(search.trim())), [category, search])
  // Derive cart lines from the same cart state used by the Add buttons.
  const cartItems = products.filter(p => (cart[p.id] ?? 0) > 0)
  const count = cartItems.reduce((sum, p) => sum + (cart[p.id] ?? 0), 0)
  const total = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0)
  const setQty = (id: number, delta: number) => setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault()
    setNotice(null)
    if (!customer.customer_name.trim() || !customer.phone.trim()) {
      setNotice({ type: 'error', text: 'من فضلك أدخل اسم العميل ورقم الهاتف.' }); return
    }
    if (!count) { setNotice({ type: 'error', text: 'أضف منتجًا واحدًا على الأقل إلى سلة الطلب.' }); return }
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    if (!url || !key) { setNotice({ type: 'error', text: 'لم يتم إعداد الاتصال بقاعدة البيانات بعد. أضف بيانات Supabase في إعدادات المشروع.' }); return }
    setLoading(true)
    try {
      // Build the payload from the cart lines validated above.
      const orderItems = cartItems.map(p => ({ product_id: p.id, product_name: p.name, quantity: cart[p.id] ?? 0, unit_price: p.price }))
      if (orderItems.length === 0) { setNotice({ type: 'error', text: 'السلة فارغة. أضف منتجات أولًا ثم أرسل الطلب.' }); return }
      const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/orders`, {
        method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ ...customer, items: orderItems, total_amount: total, currency: 'EGP', status: 'new' })
      })
      if (!response.ok) { const detail = await response.text(); throw new Error(detail || `HTTP ${response.status}`) }
      setCustomer({ customer_name: '', phone: '', notes: '' }); setCart({}); setOrderOpen(false)
      setNotice({ type: 'success', text: 'تم إرسال طلبك بنجاح! سيتواصل معك فريق زاد لينك لتأكيد التفاصيل.' })
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error && error.message ? `تعذر إرسال الطلب: ${error.message}` : 'حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.' })
    } finally { setLoading(false) }
  }

  return <div className="app-shell" dir="rtl">
    <header className="topbar"><div className="container nav-wrap">
      <a className="brand" href="#home" aria-label="زاد لينك الرئيسية"><span className="brand-mark"><Boxes size={23}/></span><span><b>زاد لينك</b><small>ZADLINK</small></span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}><a href="#market" onClick={() => setMenuOpen(false)}>السوق</a><a href="#how" onClick={() => setMenuOpen(false)}>كيف نعمل</a><a href="#trade" onClick={() => setMenuOpen(false)}>بيانات التداول</a><a href="#contact" onClick={() => setMenuOpen(false)}>تواصل معنا</a></nav>
      <div className="nav-actions"><button className="cart-button" onClick={() => setOrderOpen(true)}><ShoppingCart size={17}/><span>السلة</span><em>{count}</em></button><button className="mobile-menu" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
    </div></header>

    <main>
      <section id="home" className="hero"><div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="container hero-grid">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> منصة توريد الأغذية الذكية</div><h1>سوق غذائي واحد.<br/><span>فرص أكبر للجميع.</span></h1><p>نربط منتجي الأغذية بالتجار والمطاعم والمستهلكين، لتجربة توريد أكثر سهولة وشفافية من أول طلب حتى التسليم.</p><div className="hero-buttons"><a className="primary-button" href="#market">اكتشف المنتجات <ArrowLeft size={18}/></a><a className="text-button" href="#how">كيف تعمل المنصة؟ <ArrowUpLeft size={17}/></a></div><div className="hero-proof"><div className="proof-avatars"><span>م</span><span>ت</span><span>ز</span></div><div><strong>سلسلة توريد أقرب</strong><small>من المنتج مباشرة إلى نشاطك</small></div></div></div>
        <div className="hero-visual"><div className="visual-ring ring-a"/><div className="visual-ring ring-b"/><div className="visual-center"><div className="crate crate-back"><Wheat size={56}/></div><div className="crate crate-front"><ShoppingBasket size={70}/></div><div className="leaf leaf-one"><Leaf size={44}/></div><div className="leaf leaf-two"><Leaf size={35}/></div></div><div className="floating-card card-delivery"><span className="mini-icon"><Truck size={18}/></span><div><b>توريد موثوق</b><small>متابعة الطلبات بسهولة</small></div><BadgeCheck size={18} className="verified"/></div><div className="floating-card card-quality"><span className="quality-icon"><CheckCircle2 size={20}/></span><div><b>جودة تبدأ من المصدر</b><small>اختيار موردين بعناية</small></div></div><div className="visual-label"><span/> Supply made simple</div></div>
      </div><div className="container hero-stats"><div><strong>01</strong><span>منصة واحدة</span></div><div><strong>02</strong><span>تواصل مباشر</span></div><div><strong>03</strong><span>طلب أسهل</span></div><div><strong>04</strong><span>نمو مستمر</span></div></div></section>

      <section id="market" className="section market-section"><div className="container"><div className="section-heading"><div><span className="section-kicker">تسوّق بذكاء</span><h2>منتجات أساسية، <span>وموردون أقرب.</span></h2><p>تصفح مجموعة مختارة من المنتجات الغذائية وابدأ تجهيز طلبك.</p></div><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..." aria-label="البحث عن المنتجات"/><kbd>⌕</kbd></div></div>
      <div className="category-row">{categories.map(c => <button key={c} className={category === c ? 'category-chip active' : 'category-chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <div className="product-grid">{filtered.map(p => <article className="product-card" key={p.id}><div className="product-image"><div className="image-orb"/><img src={`/images/${p.image}`} alt={p.name} onError={e => { e.currentTarget.style.display = 'none' } }/><span className="product-emoji">{p.icon}</span><span className="availability"><i/> متاح للطلب</span></div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><div><strong>{money(p.price)} <small>ج.م</small></strong><span>{p.unit}</span></div><button className="add-button" aria-label={`إضافة ${p.name} للسلة`} onClick={() => setQty(p.id, 1)}><ShoppingCart size={17}/><span>أضف</span></button></div></div></article>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search size={28}/><b>لا توجد منتجات مطابقة</b><span>جرّب كلمة بحث أو قسمًا آخر.</span></div>}
      <div className="market-note"><CircleHelp size={17}/><span>الأسعار المعروضة بيانات تجريبية للواجهة وليست عروضًا تجارية مؤكدة. يتم اعتماد السعر النهائي عند تأكيد الطلب.</span></div>
      </div></section>

      <section id="trade" className="section trade-section"><div className="container trade-panel"><div className="trade-intro"><span className="section-kicker">بيانات التداول</span><h2>وضوح في البيانات.<br/><span>ثقة في كل خطوة.</span></h2><p>لوحة مختصرة لمتابعة نشاط المنصة ومؤشرات الطلبات. يتم عرض البيانات الفعلية عند ربط النظام بمصدر بيانات موثوق.</p><a href="#contact" className="outline-button">تواصل بشأن التوريد <ArrowLeft size={16}/></a></div><div className="metrics-grid"><div className="metric-card"><div className="metric-top"><span>الطلبات اليوم</span><Clock3 size={18}/></div><strong>—</strong><small>بانتظار ربط البيانات</small></div><div className="metric-card"><div className="metric-top"><span>حجم التداول</span><BarChart3 size={18}/></div><strong>—</strong><small>يُحدّث من قاعدة البيانات</small></div><div className="metric-card"><div className="metric-top"><span>الموردون النشطون</span><Package size={18}/></div><strong>—</strong><small>بيانات تشغيلية مباشرة</small></div><div className="metric-card metric-highlight"><div className="metric-top"><span>حالة المنصة</span><BadgeCheck size={18}/></div><strong>جاهزة</strong><small>واجهة السوق تعمل</small></div></div><div className="trade-chart"><div className="chart-heading"><span>مؤشر نشاط المنصة</span><small>عرض توضيحي</small></div><div className="chart-bars">{[34,48,42,66,52,78,61,89,70,94,76,100].map((h,i)=><span key={i} style={{height:`${h}%`}}/>)}</div><div className="chart-foot"><span>بداية الفترة</span><span>نهاية الفترة</span></div></div></div></section>

      <section id="how" className="section how-section"><div className="container"><div className="center-heading"><span className="section-kicker">ببساطة ووضوح</span><h2>من البحث إلى الطلب، <span>في خطوات قليلة.</span></h2></div><div className="steps-grid"><div className="step-card"><span className="step-number">01</span><div className="step-icon"><Search size={23}/></div><h3>اختر منتجاتك</h3><p>استعرض الأقسام وابحث عن احتياجات نشاطك بسهولة.</p></div><div className="step-card"><span className="step-number">02</span><div className="step-icon"><ShoppingBasket size={23}/></div><h3>جهّز طلبك</h3><p>أضف المنتجات للسلة واكتب بيانات التواصل والملاحظات.</p></div><div className="step-card"><span className="step-number">03</span><div className="step-icon"><Truck size={23}/></div><h3>تأكيد وتوريد</h3><p>يتم التواصل معك لمراجعة التفاصيل وتأكيد الطلب.</p></div></div></div></section>

      <section id="contact" className="section contact-section"><div className="container contact-panel"><div className="contact-copy"><span className="section-kicker">خلّينا نبدأ</span><h2>احتياجاتك الغذائية<br/><span>تستحق شريكًا أفضل.</span></h2><p>سواء كنت تاجرًا أو صاحب مطعم أو منتجًا غذائيًا، تواصل معنا لنبحث معًا عن أفضل طريقة للتوريد.</p><div className="contact-details"><a href={`tel:${import.meta.env.VITE_CONTACT_PHONE || '01000000000'}`}><span><Phone size={17}/></span><div><small>اتصل بنا</small><b>{import.meta.env.VITE_CONTACT_PHONE || '01000000000'}</b></div></a><a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'hello@zadlink.example'}`}><span><Mail size={17}/></span><div><small>البريد الإلكتروني</small><b>{import.meta.env.VITE_CONTACT_EMAIL || 'hello@zadlink.example'}</b></div></a><div><span><MapPin size={17}/></span><div><small>العنوان</small><b>{import.meta.env.VITE_CONTACT_ADDRESS || 'بورسعيد، مصر'}</b></div></div></div></div><div className="contact-side"><div className="contact-side-top"><div className="contact-symbol"><Boxes size={32}/></div><span className="online-label"><i/> متاحون للتواصل</span></div><h3>معًا نبني<br/>سلسلة غذاء أذكى.</h3><p>ابدأ محادثة مع فريق زاد لينك اليوم.</p><a className="contact-cta" href={`https://wa.me/${(import.meta.env.VITE_CONTACT_PHONE || '201000000000').replace(/\D/g,'').replace(/^0/,'20')}`} target="_blank" rel="noreferrer">تواصل عبر واتساب <ArrowLeft size={17}/></a><div className="contact-pattern"><Boxes size={130}/></div></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Boxes size={20}/></span><span><b>زاد لينك</b><small>ZADLINK</small></span></a><span>© {new Date().getFullYear()} ZadLink. جميع الحقوق محفوظة.</span><a href="#home">العودة للأعلى <ArrowUpLeft size={15}/></a></div></footer>

    {notice && <div className={`toast ${notice.type}`} role="status"><span>{notice.type === 'success' ? <CheckCircle2/> : <CircleHelp/>}</span><p>{notice.text}</p><button aria-label="إغلاق" onClick={() => setNotice(null)}><X size={17}/></button></div>}
    {orderOpen && <div className="modal-backdrop" onClick={() => !loading && setOrderOpen(false)}><div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title" onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">إتمام الطلب</span><h2 id="order-title">بيانات التواصل</h2></div><button className="modal-close" onClick={() => setOrderOpen(false)} aria-label="إغلاق" disabled={loading}><X/></button></div><div className="order-summary"><div><ShoppingBasket size={19}/><span>عدد المنتجات</span></div><b>{money(count)} <small>قطعة</small></b><div><span>إجمالي تقديري</span><b>{money(total)} ج.م</b></div></div>{cartItems.length === 0 ? <div className="empty-state cart-empty"><ShoppingBasket size={28}/><b>السلة فارغة</b><span>ارجع إلى المنتجات واضغط «أضف» لإضافة منتجات إلى طلبك.</span></div> : <div className="cart-lines">{cartItems.map(p => <div className="cart-line" key={p.id}><div className="cart-line-info"><b>{p.name}</b><small>{money(p.price)} ج.م / {p.unit}</small></div><div className="cart-quantity"><button type="button" aria-label={`تقليل ${p.name}`} onClick={() => setQty(p.id, -1)}>−</button><strong>{cart[p.id]}</strong><button type="button" aria-label={`زيادة ${p.name}`} onClick={() => setQty(p.id, 1)}>+</button></div><b className="cart-line-total">{money(p.price * (cart[p.id] ?? 0))} ج.م</b></div>)}</div>}<form onSubmit={submitOrder} className="order-form"><label>اسم العميل <input required value={customer.customer_name} onChange={e => setCustomer({ ...customer, customer_name: e.target.value })} placeholder="اكتب اسمك بالكامل" autoComplete="name"/></label><label>رقم الهاتف <input required type="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="01xxxxxxxxx" autoComplete="tel"/></label><label>ملاحظات إضافية <textarea value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} placeholder="العنوان، الكمية المطلوبة، أو أي تفاصيل..." rows={3}/></label><div className="form-hint">سيتم التواصل معك لتأكيد الأسعار والكميات وتفاصيل التوريد.</div><button className="primary-button submit-button" disabled={loading || count === 0}>{loading ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب'} {loading ? <span className="spinner"/> : <ArrowLeft size={17}/>}</button></form></div></div>}
  </div>
}
