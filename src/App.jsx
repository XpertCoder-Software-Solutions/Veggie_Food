import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Plus, Minus, X, Menu as MenuIcon, Search, Leaf, Flame, Truck, MessageCircle, MapPin, ArrowUpLeft, ChefHat, Check } from 'lucide-react'
import { CATEGORIES, ITEMS, BEST, MARQUEE, WHATSAPP, PHONE } from './data.js'
import { useCart } from './cart.jsx'

const ease = [0.22, 1, 0.36, 1]
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: i * 0.08 } }),
}

function Reveal({ children, i = 0, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M className={className} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      {children}
    </M>
  )
}

const Pct = () => <bdi dir="ltr">100%</bdi>

/* ───────────── Header ───────────── */
function Header() {
  const { count, setOpen } = useCart()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [nav, setNav] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))
  const links = [['#home', 'الرئيسية'], ['#best', 'الأكثر طلباً'], ['#menu', 'المنيو'], ['#story', 'حكايتنا'], ['#order', 'اطلب']]
  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap hdr-in">
        <a href="#home" className="hdr-logo" aria-label="Veggie Food الرئيسية"><img src="./img/logo.png" alt="Veggie Food" /></a>
        <nav aria-label="القائمة الرئيسية">
          <ul className={`hdr-links ${nav ? 'open' : ''}`}>
            {links.map(([h, t]) => (
              <li key={h}><a href={h} onClick={() => setNav(false)}>{t}</a></li>
            ))}
          </ul>
        </nav>
        <div className="hdr-actions">
          <motion.button whileTap={{ scale: 0.95 }} className="btn btn-green btn-cart" onClick={() => setOpen(true)} aria-label={`افتح السلة، فيها ${count} صنف`}>
            <ShoppingBag size={20} aria-hidden="true" />
            <span className="hide-sm">السلة</span>
            <AnimatePresence mode="popLayout">
              <motion.span key={count} className="count" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                {count}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <button className="icon-btn show-sm" aria-label="القائمة" aria-expanded={nav} onClick={() => setNav((v) => !v)}>
            {nav ? <X size={22} aria-hidden="true" /> : <MenuIcon size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ───────────── Hero ───────────── */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])
  const lines = [['أكل', 'نباتي'], ['بطعم', 'ميتقاومش']]
  let k = 0
  return (
    <section id="home" className="hero" ref={ref}>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="dot" aria-hidden="true" /> مطبخ نباتي <Pct /> · مصر الجديدة
          </motion.span>
          <h1 className="hero-title" aria-label="أكل نباتي بطعم ميتقاومش">
            {lines.map((line, li) => (
              <span className="line" key={li} aria-hidden="true">
                {line.map((w) => {
                  const i = k++
                  return (
                    <span className="word-mask" key={w}>
                      <motion.span className={`word ${w === 'ميتقاومش' ? 'accent' : ''}`} initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease, delay: 0.15 + i * 0.1 }}>{w}</motion.span>
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.55 }}>
            بيتزا وباستا وكريب وريزوتو بمكونات نباتية <Pct />، متحضرة طازة لما تطلب. نفس الطعم اللي بتحبه، من غير أي منتجات حيوانية.
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.7 }}>
            <motion.a whileTap={{ scale: 0.96 }} href="#menu" className="btn btn-primary btn-lg">
              اطلب دلوقتي <ArrowUpLeft size={19} aria-hidden="true" />
            </motion.a>
            <motion.a whileTap={{ scale: 0.96 }} href="#best" className="btn btn-outline btn-lg">الأكثر طلباً</motion.a>
          </motion.div>
          <motion.dl className="hero-stats" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}>
            {[['52', 'صنف في المنيو'], [<Pct key="p" />, 'نباتي'], ['طازة', 'كل أوردر لوحده']].map(([n, l], i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>
                <dt>{n}</dt><dd>{l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <div className="hero-art">
          <motion.div className="hero-frame" initial={{ clipPath: 'inset(100% 0% 0% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} transition={{ duration: 1.3, ease, delay: 0.1 }}>
            <motion.img src="./img/cheese.jpg" alt="بيتزا والجبنة بتتمط" style={{ y: imgY, scale: imgScale }} />
          </motion.div>
          <motion.div className="float-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }}>
            <img src="./img/pizza.jpg" alt="" />
            <div><b>كريسبي رانش</b><span>الأكثر طلباً · 179 ج</span></div>
          </motion.div>
          <motion.div className="float-seal" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.15, type: 'spring', stiffness: 200, damping: 16 }}>
            <Leaf size={20} aria-hidden="true" /><b><Pct /></b><span>نباتي</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function LeafPattern() {
  return (
    <svg className="leaf-pattern" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="currentColor">
        <path d="M40 620c0-110 70-180 210-195-15 140-85 210-195 210z" />
        <path d="M1000 90c25-85 110-125 200-110-25 95-110 140-200 110z" />
        <path d="M920 660c-15-100 45-170 160-195 15 115-45 185-160 195z" />
        <path d="M160 60c70-45 155-30 200 30-70 45-155 30-200-30z" />
        <path d="M560 690c30-70 100-100 170-80-30 70-100 100-170 80z" />
      </g>
    </svg>
  )
}

/* ───────────── Marquee ───────────── */
function Marquee() {
  const row = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" animate={{ x: ['0%', '50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        {row.map((t, i) => (
          <span key={i} className="marquee-item">{t}<span className="mdot" /></span>
        ))}
      </motion.div>
    </div>
  )
}

/* ───────────── Qty control ───────────── */
function Qty({ id, size = 'md' }) {
  const { cart, add, dec } = useCart()
  const q = cart[id] || 0
  const it = ITEMS[id]
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {q === 0 ? (
        <motion.button key="add" layout className={`add-btn ${size}`} onClick={() => add(id)} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} aria-label={`ضيف ${it.full} للسلة`}>
          <Plus size={18} aria-hidden="true" />{size === 'lg' && <span>ضيف</span>}
        </motion.button>
      ) : (
        <motion.div key="qty" layout className={`qty ${size}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
          <button onClick={() => add(id)} aria-label={`زوّد ${it.full}`}><Plus size={16} aria-hidden="true" /></button>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={q} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ duration: 0.18 }} aria-live="polite">{q}</motion.span>
          </AnimatePresence>
          <button onClick={() => dec(id)} aria-label={`قلل ${it.full}`}><Minus size={16} aria-hidden="true" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Price = ({ v, className = '' }) => <span className={`price ${className}`}>{v}<small>ج</small></span>

/* ───────────── Best sellers ───────────── */
function Best() {
  return (
    <section id="best" className="sec">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><span className="eyebrow">الناس بتحبهم</span><h2>الأكثر طلباً</h2></Reveal>
          <Reveal i={1}><a className="link-more" href="#menu">المنيو كله <ArrowUpLeft size={18} aria-hidden="true" /></a></Reveal>
        </div>
        <div className="best-grid">
          {BEST.map(({ id, tag }, i) => {
            const it = ITEMS[id]
            return (
              <Reveal key={id} i={i} as="article" className="best-card">
                <motion.div className="best-media" whileHover="hover">
                  <motion.img src={it.img} alt={it.full} loading="lazy" variants={{ hover: { scale: 1.08 } }} transition={{ duration: 0.6, ease }} />
                  <span className="tag">{tag}</span>
                </motion.div>
                <div className="best-body">
                  <span className="muted">{it.cat}</span>
                  <h3>{it.name}</h3>
                  {it.desc && <p className="best-desc">{it.desc}</p>}
                  <div className="best-row"><Price v={it.price} className="lg" /><Qty id={id} /></div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Categories bento ───────────── */
function Categories({ onPick }) {
  return (
    <section className="sec sec-tight">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><span className="eyebrow">اختار اللي نفسك فيه</span><h2>الأقسام</h2></Reveal>
        </div>
        <div className="bento">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} i={i} className={`bento-cell b-${i}`}>
              <motion.button className="bento-btn" onClick={() => onPick(c.id)} whileHover="hover" whileTap={{ scale: 0.98 }}>
                <motion.img src={c.img} alt="" loading="lazy" variants={{ hover: { scale: 1.08 } }} transition={{ duration: 0.7, ease }} />
                <span className="bento-shade" />
                <span className="bento-text">
                  <b>{c.name}</b>
                  <small>{c.blurb} · {c.items.length} صنف</small>
                </span>
                <motion.span className="bento-arrow" variants={{ hover: { x: -4, y: -4 } }}><ArrowUpLeft size={20} aria-hidden="true" /></motion.span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Full menu ───────────── */
function FullMenu({ active, setActive }) {
  const [q, setQ] = useState('')
  const tabs = [{ id: 'all', name: 'الكل' }, ...CATEGORIES]
  const groups = useMemo(() => CATEGORIES
    .filter((c) => active === 'all' || active === c.id)
    .map((c) => ({ ...c, rows: c.items.map((_, i) => ITEMS[`${c.id}-${i}`]).filter((it) => !q.trim() || it.name.includes(q.trim()) || it.desc.includes(q.trim()) || c.name.includes(q.trim())) }))
    .filter((g) => g.rows.length), [active, q])

  return (
    <section id="menu" className="sec sec-white">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><span className="eyebrow">كل الأصناف بالأسعار</span><h2>المنيو</h2><p className="sub">الأسعار بالجنيه المصري</p></Reveal>
        </div>
        <div className="menu-tools">
          <div className="tabs" role="group" aria-label="أقسام المنيو">
            {tabs.map((t) => (
              <button key={t.id} className={`tab ${active === t.id ? 'on' : ''}`} aria-pressed={active === t.id} onClick={() => setActive(t.id)}>
                {active === t.id && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="tab-label">{t.name}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr">دوّر على صنف</span>
            <Search size={18} aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوّر على صنف..." />
          </label>
        </div>

        <AnimatePresence mode="popLayout">
          {groups.length === 0 && (
            <motion.p key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>مفيش صنف بالاسم ده. جرّب كلمة تانية.</motion.p>
          )}
          {groups.map((g) => (
            <motion.div key={g.id} layout className="mgroup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
              <div className="mgroup-head">
                <img src={g.img} alt="" loading="lazy" />
                <div><h3>{g.name}</h3><span>{g.blurb}</span></div>
              </div>
              <div className="mitems">
                <AnimatePresence mode="popLayout">
                  {g.rows.map((it, i) => (
                    <motion.div key={it.id} layout className="mitem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.025, 0.3), duration: 0.35, ease } }} exit={{ opacity: 0, scale: 0.96 }}>
                      <span className="mitem-text"><span className="mitem-name">{it.name}</span>{it.desc && <span className="mitem-desc">{it.desc}</span>}</span>
                      <span className="dots" aria-hidden="true" />
                      <Price v={it.price} />
                      <Qty id={it.id} size="sm" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ───────────── Story band ───────────── */
function Story() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const pillars = [
    [Leaf, <>نباتي <Pct /></>, 'كل المنيو من غير لحوم ولا منتجات حيوانية، ومناسب لفترات الصيام.'],
    [Flame, 'طازة من الفرن', 'كل أوردر بيتحضر لما تطلبه، من فرد العجينة لحد ما العلبة تتقفل.'],
    [ChefHat, 'نفس الطعم', 'جبنة بتتمط وصوص كريمي وشوكولاتة سايحة. هتنسى إنه نباتي.'],
  ]
  return (
    <section id="story" className="story" ref={ref}>
      <LeafPattern />
      <div className="wrap story-grid">
        <div className="story-media">
          <motion.img src="./img/oven.jpg" alt="بيتزا داخلة الفرن" style={{ y: imgY }} />
        </div>
        <div>
          <Reveal><span className="eyebrow eyebrow-light">حكايتنا</span></Reveal>
          <Reveal i={1}><h2 className="on-dark">الأكل النباتي مش لازم يبقى ممل</h2></Reveal>
          <Reveal i={2}><p className="story-lead">Veggie Food مطبخ في مصر الجديدة، بيعمل الأصناف اللي الناس بتحبها بمكونات نباتية <Pct />. سواء صايم أو نباتي أو بس عايز تجرب، الطعم هو هو.</p></Reveal>
          <div className="pillars">
            {pillars.map(([I, t, d], i) => (
              <Reveal key={i} i={i + 3} className="pillar">
                <span className="pillar-ic"><I size={22} aria-hidden="true" /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── How to order ───────────── */
function Steps() {
  const steps = [
    [ShoppingBag, 'اختار أصنافك', 'ضيف اللي نفسك فيه للسلة من المنيو.'],
    [MessageCircle, 'ابعت على واتساب', 'اكتب اسمك وعنوانك والأوردر يتبعت في رسالة واحدة.'],
    [Truck, 'استلم أوردرك', 'الأوردر بيتحضر طازة ويوصلك لحد البيت.'],
  ]
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="eyebrow">سهلة جداً</span><h2>اطلب في 3 خطوات</h2></Reveal>
        </div>
        <div className="steps">
          {steps.map(([I, t, d], i) => (
            <Reveal key={i} i={i} className="step">
              <span className="step-n">{i + 1}</span>
              <span className="step-ic"><I size={26} aria-hidden="true" /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Order CTA ───────────── */
function OrderBand() {
  return (
    <section id="order" className="sec sec-tight">
      <div className="wrap">
        <Reveal className="order-band">
          <div className="order-copy">
            <span className="eyebrow eyebrow-light">واتساب الطلبات</span>
            <h2 className="on-dark">جعان؟ احنا جاهزين</h2>
            <p>كلمنا على واتساب أو ابعت الأوردر من السلة في رسالة واحدة.</p>
            <a className="order-num" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{PHONE}</bdi></a>
            <div className="hero-cta">
              <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="btn btn-light btn-lg" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" /> كلمنا على واتساب</motion.a>
              <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="btn btn-outline-light btn-lg" href="#menu">شوف المنيو</motion.a>
            </div>
          </div>
          <div className="order-info">
            <div><MapPin size={22} aria-hidden="true" /><span><b>مصر الجديدة</b><small>Cloud Kitchen · توصيل للبيت</small></span></div>
            <div><MessageCircle size={22} aria-hidden="true" /><span><b>واتساب الطلبات</b><small><bdi dir="ltr">{PHONE}</bdi></small></span></div>
          </div>
          <img className="order-bg" src="./img/pizza.jpg" alt="" />
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-top">
          <span className="ftr-logo"><img src="./img/logo.png" alt="Veggie Food" /></span>
          <ul>
            <li><a href="#menu">المنيو</a></li>
            <li><a href="#best">الأكثر طلباً</a></li>
            <li><a href="#story">حكايتنا</a></li>
            <li><a href="#order">اطلب</a></li>
          </ul>
        </div>
        <div className="ftr-bottom"><span>© 2026 Veggie Food · كل الحقوق محفوظة</span><span>Designed by Linkly Agency</span></div>
      </div>
    </footer>
  )
}

/* ───────────── Cart drawer ───────────── */
function CartDrawer() {
  const { open, setOpen, ids, cart, total, count } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [err, setErr] = useState('')
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open, setOpen])

  const valid = ids.length && form.name.trim() && form.phone.replace(/\D/g, '').length >= 10 && form.address.trim()
  const text = useMemo(() => {
    let t = 'أهلاً Veggie Food، عايز أطلب:\n\n'
    ids.forEach((id) => { const it = ITEMS[id]; t += `• ${it.full} × ${cart[id]} = ${it.price * cart[id]} ج\n` })
    t += `\nالإجمالي: ${total} ج (من غير التوصيل)\n\nالاسم: ${form.name.trim()}\nالموبايل: ${form.phone.trim()}\nالعنوان: ${form.address.trim()}`
    if (form.notes.trim()) t += `\nملاحظات: ${form.notes.trim()}`
    return t
  }, [ids, cart, total, form])
  const href = valid ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : undefined
  const set = (k) => (e) => { setErr(''); setForm((f) => ({ ...f, [k]: e.target.value })) }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%', transition: { duration: 0.25, ease } }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
            <div className="drawer-head">
              <h2 id="cart-title">السلة <span className="muted">({count})</span></h2>
              <button ref={closeRef} className="icon-btn" onClick={() => setOpen(false)} aria-label="اقفل السلة"><X size={20} aria-hidden="true" /></button>
            </div>
            <div className="drawer-body">
              <AnimatePresence mode="popLayout">
                {ids.length === 0 ? (
                  <motion.div key="empty" className="cart-empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <span className="cart-empty-ic"><ShoppingBag size={32} aria-hidden="true" /></span>
                    <b>السلة فاضية</b>
                    <span>ضيف أصناف من المنيو وارجع هنا.</span>
                    <a className="btn btn-green" href="#menu" onClick={() => setOpen(false)}>شوف المنيو</a>
                  </motion.div>
                ) : ids.map((id) => {
                  const it = ITEMS[id]
                  return (
                    <motion.div key={id} layout className="cart-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}>
                      <img src={it.img} alt="" />
                      <div className="cart-item-t"><b>{it.full}</b><span>{it.price} ج × {cart[id]} = {it.price * cart[id]} ج</span></div>
                      <Qty id={id} size="sm" />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            {ids.length > 0 && (
              <motion.div className="drawer-foot" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="total"><span>الإجمالي</span><Price v={total} className="xl" /></div>
                <p className="hint">مصاريف التوصيل بتتأكد معاك على واتساب.</p>
                <form className="form" onSubmit={(e) => e.preventDefault()} noValidate>
                  <label>الاسم<input value={form.name} onChange={set('name')} autoComplete="name" /></label>
                  <label>رقم الموبايل<input value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" dir="ltr" autoComplete="tel" /></label>
                  <label>العنوان بالتفصيل<input value={form.address} onChange={set('address')} autoComplete="street-address" /></label>
                  <label>ملاحظات (اختياري)<textarea value={form.notes} onChange={set('notes')} rows={2} /></label>
                </form>
                <AnimatePresence>{err && <motion.p className="err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
                <motion.a whileTap={{ scale: 0.97 }} className={`btn-wa ${valid ? '' : 'off'}`} href={href} target="_blank" rel="noopener noreferrer" aria-disabled={!valid}
                  onClick={(e) => { if (!valid) { e.preventDefault(); setErr('اكتب الاسم ورقم موبايل صحيح والعنوان.') } }}>
                  <MessageCircle size={22} aria-hidden="true" /> ابعت الأوردر على واتساب
                </motion.a>
                <p className="hint center">لو واتساب مفتحش، كلمنا على <bdi dir="ltr">{PHONE}</bdi></p>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Toast() {
  const { toast, setToast } = useCart()
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast, setToast])
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.key} className="toast" initial={{ y: 40, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }}>
            <Check size={18} aria-hidden="true" /> {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Fab() {
  const { count, setOpen } = useCart()
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button className="fab" onClick={() => setOpen(true)} aria-label={`افتح السلة، فيها ${count} صنف`}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
          <ShoppingBag size={24} aria-hidden="true" />
          <motion.span key={count} className="count" initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>{count}</motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function Progress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="progress" style={{ scaleX: x }} />
}

export default function App() {
  const [active, setActive] = useState('all')
  const pick = (id) => {
    setActive(id)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <a className="skip" href="#main">تخطي للمحتوى</a>
      <Progress />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Best />
        <Categories onPick={pick} />
        <FullMenu active={active} setActive={setActive} />
        <Story />
        <Steps />
        <OrderBand />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <Fab />
    </>
  )
}
