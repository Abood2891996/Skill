#!/usr/bin/env python3
"""Builds the Jodesx inner pages (EN at the site root, AR under ar/) from one template.

Run from the website folder:  python3 tools/build_pages.py
It also refreshes the nav and footer of index.html and ar/index.html so every page shares them.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- photographs (stand-ins, Wikimedia Commons)
PH = {
    'booths':  ('f200381495', 960, 720, True),
    'headset': ('f85560480', 960, 640, False),
    'typing':  ('f62734295', 960, 561, True),
    'notebook':('f61681597', 960, 640, True),
    'desk':    ('f61739578', 960, 640, True),
    'room':    ('f66417424', 960, 638, True),
    'lab':     ('f51544809', 960, 540, True),
    'keys':    ('f30343877', 960, 540, True),
    'amman':   ('f42301703', 960, 558, False),
    'siq':     ('f129295170', 960, 655, True),
}
ALT = {
    'en': {'booths': 'Two closed work booths with a desk and a lamp in each',
           'headset': 'An agent with a headset at a desk, seen from behind',
           'typing': 'Two hands typing on a keyboard',
           'notebook': 'A notebook, a pen and a laptop on a white desk',
           'desk': 'A laptop on a desk by a window with files stacked beside it',
           'room': 'An empty meeting room with tables set in a square',
           'lab': 'A room of desktop computers set up for training',
           'keys': 'Hands on a backlit keyboard in a dark room',
           'amman': "Amman's hills of pale stone houses seen from Citadel Hill",
           'siq': 'Two people walking through the Siq at Petra'},
    'ar': {'booths': 'مقصورتا عمل مغلقتان في كل منهما مكتب ومصباح',
           'headset': 'موظفة دعم بسماعة رأس على مكتبها، من الخلف',
           'typing': 'يدان تكتبان على لوحة مفاتيح',
           'notebook': 'دفتر وقلم وحاسوب محمول على مكتب أبيض',
           'desk': 'حاسوب محمول على مكتب قرب نافذة وبجانبه ملفات',
           'room': 'قاعة اجتماعات فارغة بطاولات مرتبة على شكل مربع',
           'lab': 'قاعة حواسيب مجهّزة للتدريب',
           'keys': 'يدان على لوحة مفاتيح مضيئة في غرفة معتمة',
           'amman': 'تلال عمّان وبيوتها الحجرية الفاتحة من جبل القلعة',
           'siq': 'شخصان يسيران في السيق بالبتراء'},
}


def img(key, lang, pre, cls='frame__img', sizes='(max-width: 639px) 100vw, 50vw', lazy=True, extra=''):
    fid, w, h, full = PH[key]
    base = f'{pre}assets/img/photo-{fid}'
    srcset = f'{base}-500.webp 500w, {base}-960.webp 960w' + (f', {base}.webp 1280w' if full else '')
    load = 'loading="lazy" ' if lazy else 'fetchpriority="high" '
    return (f'<img class="{cls}" src="{base}-960.webp" srcset="{srcset}" sizes="{sizes}" width="{w}" height="{h}" '
            f'alt="{ALT[lang][key]}" {load}decoding="async" data-source="stand-in" data-subject="{key}"{extra}>')


ARROW = ('<svg class="m-arrow"{flip} viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/>'
         '<path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>')
LOGO = ('<svg class="logo-mark" viewBox="0 0 120 120" aria-hidden="true"><path d="M16 12 C 72 36, 48 84, 104 108" fill="none" '
        'stroke="#e9edf3" stroke-width="18" stroke-linecap="round"/><path d="M104 12 C 48 36, 72 84, 16 108" fill="none" '
        'stroke="#0a0d14" stroke-width="30" stroke-linecap="round"/><path d="M104 12 C 48 36, 72 84, 16 108" fill="none" '
        'stroke="#5ab9fc" stroke-width="18" stroke-linecap="round"/></svg>jodesx')

# ---------------------------------------------------------------- shared words
W = {
    'en': dict(skip='Skip to content', main='Main', menu='Menu', home='Jodesx home', top='Jodesx, back to top',
               nav=[('Services', 'index.html#services'), ('Industries', 'industries.html'), ('About', 'about.html'), ('Careers', 'careers.html')],
               cta='Request a pilot team', other='العربية', other_lang='ar', quick='Quick actions',
               svc_group='Services', lede='Managed teams, run from Jordan.',
               col_company='Company', col_contact='Contact', email='Email us', privacy='Privacy', terms='Terms',
               credits='Photographs via Wikimedia Commons', all_services='All services',
               close_line='Two or three people on one queue to start. We reply within two working days.'),
    'ar': dict(skip='تخطَّ إلى المحتوى', main='القائمة الرئيسية', menu='القائمة', home='Jodesx، الصفحة الرئيسية', top='Jodesx، العودة إلى الأعلى',
               nav=[('الخدمات', 'index.html#services'), ('القطاعات', 'industries.html'), ('عن الشركة', 'about.html'), ('الوظائف', 'careers.html')],
               cta='اطلب فريقاً تجريبياً', other='English', other_lang='en', quick='إجراءات سريعة',
               svc_group='الخدمات', lede='فرق مُدارة، من الأردن.',
               col_company='الشركة', col_contact='تواصل', email='راسلنا', privacy='الخصوصية', terms='الشروط',
               credits='الصور من Wikimedia Commons', all_services='كل الخدمات',
               close_line='نبدأ بشخصين أو ثلاثة على مسار عمل واحد، ونرد عليك خلال يومَي عمل.'),
}
SVC = [  # slug, en name, en five words, ar name, ar short
    ('moderation', 'Content moderation', 'Streams, chat, images and video', 'الإشراف على المحتوى', 'البث والدردشة والصور والفيديو'),
    ('support', 'Customer support', 'Chat, email and tickets', 'خدمة العملاء', 'الدردشة والبريد والتذاكر'),
    ('ai-data', 'AI and data operations', 'Annotation, rating and transcription', 'عمليات البيانات والذكاء الاصطناعي', 'التوسيم والتقييم والتفريغ'),
    ('back-office', 'Back office', 'Data entry and virtual assistants', 'المكتب الخلفي', 'إدخال البيانات والمساعدون'),
    ('sales-ops', 'Sales operations', 'Meetings booked and leads qualified', 'عمليات المبيعات', 'المواعيد وتأهيل العملاء'),
]


def head(lang, pre, page, title, desc):
    other_pre = '../' if lang == 'en' else ''
    en_href = f'{"../" if lang == "ar" else ""}{page}'
    ar_href = f'{"" if lang == "ar" else "ar/"}{page}'
    base = 'family=Sora:wght@400..700&family=Figtree:wght@400..600&family=Martian+Mono:wght@400..500'
    fonts = ('family=IBM+Plex+Sans+Arabic:wght@400;500;600&' + base) if lang == 'ar' else base
    disp = '"IBM Plex Sans Arabic", "Sora"' if lang == 'ar' else '"Sora"'
    face = '"IBM Plex Sans Arabic", "Figtree"' if lang == 'ar' else '"Figtree"'
    track = ('0', '0') if lang == 'ar' else ('-0.035em', '-0.045em')
    return f'''<!doctype html>
<html lang="{lang}" dir="{'rtl' if lang == 'ar' else 'ltr'}" data-type="software" data-radius="soft" data-ground="sky" data-buttons="arrow" data-motion>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{pre}share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#0a0d14">
<!-- <link rel="canonical" href="https://jodesx.com/{'ar/' if lang == 'ar' else ''}{page}"> -->
<link rel="alternate" hreflang="en" href="{en_href}">
<link rel="alternate" hreflang="ar" href="{ar_href}">
<meta name="site-kind" content="software">
<meta name="page-type" content="software">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/system.css">
<link rel="stylesheet" href="{pre}assets/ui/cards.css">
<link rel="stylesheet" href="{pre}assets/motion/motion.css">
<link rel="stylesheet" href="{pre}assets/backgrounds/backgrounds.css">
<link rel="stylesheet" href="{pre}assets/layout/layout.css">
<link rel="stylesheet" href="{pre}assets/icons/icon.css">
<style>
:root {{
  --p-bg: #0a0d14; --p-surface: #131824; --p-ink: #e9edf3; --p-muted: #8891a1;
  --p-accent: #5ab9fc; --p-accent-ink: #0a0d14; --p-action: #5ab9fc; --p-action-ink: #0a0d14;
  --p-inv-bg: #e9edf3; --p-inv-surface: #d7dbe1; --p-inv-ink: #0a0d14; --p-inv-muted: #54575f;
  --p-inv-accent: #0a0d14; --p-inv-accent-ink: #e9edf3; --p-inv-action: #0a0d14; --p-inv-action-ink: #e9edf3;
  --font-display: {disp}, system-ui, sans-serif;
  --font-text: {face}, system-ui, sans-serif;
  --font-mono: "Martian Mono", ui-monospace, Menlo, Consolas, monospace;
  --display-weight: 400;
  --display-tracking: {track[0]};
  --display-tracking-xl: {track[1]};
  --ly-scale: 0.9;
}}
</style>
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
<style>
  .logo-mark {{ width: 28px; height: 28px; flex: none; }}
  .nav__logo {{ direction: ltr; display: inline-flex; align-items: center; gap: 10px; }}
  .rows__name small {{ display: block; margin-top: 4px; font-size: var(--t-body); color: var(--muted, #8891a1); }}
  .band {{ aspect-ratio: 4 / 1; margin-top: var(--s-7); }}
  @media (min-width: 1024px) {{ .split-photo {{ aspect-ratio: 1 / 1; height: auto; align-self: start; }} }}
  .legal {{ max-width: 62ch; }}
  .legal h2 {{ margin-top: var(--s-7); }}
  @media (max-width: 1023px) {{ .band {{ aspect-ratio: 2 / 1; }} .split-photo {{ aspect-ratio: 4 / 3; height: auto; flex: none; }} }}
  @media (max-width: 639px) {{ .band {{ aspect-ratio: 3 / 2; }} }}
</style>
</head>
<body>
<!-- type: service; deal as index.html: nav nav-centre, footer footer-columns, close close-word head row, buttons solid, the client's logo. Built by tools/build_pages.py -->
'''


def nav(lang, pre, page, current=None):
    w = W[lang]
    other_pre = '../' if lang == 'ar' else 'ar/'
    links = []
    for i, (word, href) in enumerate(w['nav']):
        cur = ' aria-current="page"' if current == href else ''
        if i == 0:
            items = ''.join(
                f'<a href="{pre if False else ""}{s[0]}.html">{s[1] if lang == "en" else s[3]}<span>{s[2] if lang == "en" else s[4]}</span></a>'
                for s in SVC)
            links.append(f'''      <div class="nav__item">
        <a class="nav__link" href="{href}">{word} <svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <div class="nav__menu"><div class="wrap grid"><div class="menu-col span-6"><p class="t-label">{w['svc_group']}</p>{items}</div></div></div>
      </div>''')
        else:
            links.append(f'      <div class="nav__item"><a class="nav__link" href="{href}"{cur}>{word}</a></div>')
    return f'''<header class="nav nav--centre">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">{w['skip']}</a>
    <a class="nav__logo" href="index.html" aria-label="{w['home']}">{LOGO}</a>
    <nav class="nav__links" aria-label="{w['main']}">
{chr(10).join(links)}
    </nav>
    <div class="nav__actions">
      <a class="nav__link" href="{other_pre}{page}" hreflang="{w['other_lang']}" lang="{w['other_lang']}">{w['other']}</a>
      <a class="btn btn--primary" href="index.html#pilot">{w['cta']}</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="{w['menu']}">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>
'''


def footer(lang, pre, close_h, close_cta=True):
    w = W[lang]
    flip = ' style="transform:scaleX(-1)"' if lang == 'ar' else ''
    svc_links = ''.join(f'<li><a href="{s[0]}.html">{s[1] if lang == "en" else s[3]}</a></li>' for s in SVC)
    cta = ''
    if close_cta:
        cta = f'''    <div class="closing__cta close--word">
      <div class="section-head--split">
        <div><h2 id="close-h">{close_h}</h2><p class="t-lead">{w['close_line']}</p></div>
        <a class="btn btn--primary" href="index.html#pilot">{w['cta']}{ARROW.format(flip=flip)}</a>
      </div>
    </div>
'''
    company = [(w['nav'][1][0], 'industries.html'), (w['nav'][2][0], 'about.html'), (w['nav'][3][0], 'careers.html')]
    comp_links = ''.join(f'<li><a href="{h}">{t}</a></li>' for t, h in company)
    return f'''<footer class="footer closing" id="contact" aria-labelledby="{'close-h' if close_cta else 'foot-h'}">
  <div class="wrap">
{cta}    <div class="closing__links">
      <div class="grid">
        <div class="span-6 stack-4">
          <a class="nav__logo" href="index.html" aria-label="{w['top']}">{LOGO}</a>
          <p class="footer__lede"{'' if close_cta else ' id="foot-h"'}>{w['lede']}</p>
        </div>
        <div class="span-2 footer__col"><h3>{w['svc_group']}</h3><ul>{svc_links}</ul></div>
        <div class="span-2 footer__col"><h3>{w['col_company']}</h3><ul>{comp_links}</ul></div>
        <div class="span-2 footer__col"><h3>{w['col_contact']}</h3><ul><li><a href="mailto:hello@jodesx.example">{w['email']}</a></li><li><a href="privacy.html">{w['privacy']}</a></li><li><a href="terms.html">{w['terms']}</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Jodesx</span>
        <div class="socials"></div>
        <a class="credits" href="{pre}credits.html">{w['credits']}</a>
      </div>
    </div>
  </div>
</footer>

<nav class="actionbar" aria-label="{w['quick']}">
  <a class="btn btn--primary" href="index.html#pilot">{w['cta']}</a>
</nav>

<script type="module" src="{pre}assets/system.js"></script>
<script type="module" src="{pre}assets/motion/motion.js"></script>
<script type="module" src="{pre}assets/layout/layout.js"></script>
</body>
</html>
'''


def hero(lang, pre, h1, lead, photo, facts, second=None, cta=None):
    w = W[lang]
    cta = cta or (w['cta'], 'index.html#pilot')
    flip = ' style="transform:scaleX(-1)"' if lang == 'ar' else ''
    sec = f'<a class="btn btn--secondary" href="{second[1]}">{second[0]}</a>' if second else ''
    dl = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in facts)
    return f'''  <section class="hero hero--split" data-enter aria-labelledby="hero-h">
    <div class="wrap">
      <div class="hero-text grid hero-split">
        <div class="hero-copy span-6">
          <h1 id="hero-h">{h1}</h1>
          <p class="t-lead">{lead}</p>
          <div class="btn-row"><a class="btn btn--primary" href="{cta[1]}">{cta[0]}{ARROW.format(flip=flip)}</a>{sec}</div>
          <dl class="hero-facts">{dl}</dl>
        </div>
        <div class="hero-visual frame frame--photo span-6 start-7">
          {img(photo, lang, pre, lazy=False, sizes='(max-width: 1023px) 180vw, 90vw')}
        </div>
      </div>
    </div>
  </section>
'''


def split_rows(sid, h2, intro, rows, photo, lang, pre, ground=''):
    lis = ''.join(f'<li><span class="rows__name">{a}<small>{b}</small></span></li>' for a, b in rows)
    return f'''  <section class="section{ground}" id="{sid}" aria-labelledby="{sid}-h">
    <div class="wrap grid grid--top">
      <div class="span-6">
        <div class="section-head"><h2 id="{sid}-h">{h2}</h2><p>{intro}</p></div>
        <ul class="rows">{lis}</ul>
      </div>
      <div class="frame frame--photo frame--fill split-photo span-6 start-7">{img(photo, lang, pre, sizes='(max-width: 639px) 160vw, 90vw')}</div>
    </div>
  </section>
'''


def band_rows(sid, h2, intro, rows, photo, lang, pre, ground=''):
    half = (len(rows) + 1) // 2
    col = lambda rs: ''.join(f'<li><span class="rows__name">{a}<small>{b}</small></span></li>' for a, b in rs)
    return f'''  <section class="section{ground}" id="{sid}" aria-labelledby="{sid}-h">
    <div class="wrap">
      <div class="section-head"><h2 id="{sid}-h">{h2}</h2><p>{intro}</p></div>
      <div class="grid grid--top">
        <ul class="rows span-6">{col(rows[:half])}</ul>
        <ul class="rows span-6 start-7">{col(rows[half:])}</ul>
      </div>
      <div class="frame frame--photo band">{img(photo, lang, pre, sizes='100vw')}</div>
    </div>
  </section>
'''


def form_section(sid, h2, intro, fields, button, sent, reply, photo, lang, pre, mail):
    fs = ''
    for fid, label, typ, ac, err in fields:
        im = ' inputmode="email"' if typ == 'email' else ''
        fs += (f'<div class="field field--full"><label for="f-{fid}">{label}</label>'
               f'<input id="f-{fid}" name="{fid}" type="{typ}" autocomplete="{ac}"{im} required aria-describedby="f-{fid}-err">'
               f'<p class="field__error" id="f-{fid}-err" hidden>{err}</p></div>')
    return f'''  <section class="section" id="{sid}" aria-labelledby="{sid}-h">
    <div class="wrap grid grid--top">
      <div class="span-6 stack-4">
        <h2 id="{sid}-h">{h2}</h2>
        <p>{intro}</p>
        <form class="form" action="mailto:{mail}" method="post" enctype="text/plain" data-endpoint="" data-sent="{sent}" novalidate>
          {fs}
          <div class="btn-row"><button class="btn btn--primary" type="submit">{button}</button></div>
          <p class="form__status" role="status" data-form-status></p>
          <p class="t-small muted">{reply}</p>
        </form>
      </div>
      <div class="frame frame--photo frame--fill split-photo span-6 start-7">{img(photo, lang, pre, sizes='(max-width: 639px) 160vw, 90vw')}</div>
    </div>
  </section>
'''


# ---------------------------------------------------------------- page copy
F_EN = [('Languages', 'Arabic and English'), ('Time zone', 'GMT+3'), ('Start', 'A pilot team of 2 to 3')]
F_AR = [('اللغات', 'العربية والإنجليزية'), ('التوقيت', 'GMT+3'), ('البداية', 'فريق تجريبي من 2 إلى 3')]
RUN_EN = [('Hired and trained by us', 'To your guidelines, before the first live task'),
          ('Quality checked daily', 'Our team leads review samples of the work'),
          ('Reported against the SLA', 'Performance reports on the targets we agreed'),
          ('One account lead', 'Your one contact for the whole team')]
RUN_AR = [('نوظّف وندرّب بأنفسنا', 'وفق إرشاداتك، قبل أول مهمة فعلية'),
          ('مراجعة جودة يومية', 'قادة الفرق يراجعون عيّنات من العمل'),
          ('تقارير وفق اتفاقية الخدمة', 'تقارير أداء على الأهداف المتفق عليها'),
          ('مسؤول حساب واحد', 'جهة اتصال واحدة لكل الفريق')]

SERVICES = {
    'moderation': dict(
        photos=('booths', 'keys', 'room'),
        en=dict(title='Content moderation teams in Arabic and English | Jodesx',
                desc='Jodesx runs managed content moderation teams for platforms: live streams, comments, chat, images and video, in Arabic and English.',
                h1='Content moderation teams for platforms',
                lead='A managed team reviews your live streams, comments, chat, images and video against your policy, in Arabic and English.',
                tasks_h='What the moderation team reviews', tasks_p='The queues we take on from day one of a pilot.',
                tasks=[('Live streams', 'Watched while they run, with your escalation rules'),
                       ('Comments and chat', 'Arabic dialects, slang and English'),
                       ('Images and video', 'Reviewed against your content policy'),
                       ('Trust and safety cases', 'Reports, appeals and flagged accounts')],
                run_h='How we run a moderation team', run_p='Same model on every queue, managed by us end to end.',
                close='Moderation in Arabic, run from Jordan'),
        ar=dict(title='فرق الإشراف على المحتوى بالعربية والإنجليزية | Jodesx',
                desc='تدير Jodesx فرق إشراف على المحتوى للمنصات: البث المباشر والتعليقات والدردشة والصور والفيديو، بالعربية والإنجليزية.',
                h1='فرق الإشراف على المحتوى للمنصات',
                lead='فريق مُدار يراجع البث المباشر والتعليقات والدردشة والصور والفيديو وفق سياستك، بالعربية والإنجليزية.',
                tasks_h='ما يراجعه فريق الإشراف', tasks_p='مسارات العمل التي نتولاها من أول يوم في الفريق التجريبي.',
                tasks=[('البث المباشر', 'متابعة أثناء البث، وفق قواعد التصعيد لديك'),
                       ('التعليقات والدردشة', 'اللهجات العربية والعامية والإنجليزية'),
                       ('الصور والفيديو', 'مراجعة وفق سياسة المحتوى لديك'),
                       ('حالات الثقة والأمان', 'البلاغات والاعتراضات والحسابات المُبلّغ عنها')],
                run_h='كيف ندير فريق الإشراف', run_p='النموذج نفسه في كل مسار عمل، ونديره نحن من البداية إلى النهاية.',
                close='إشراف بالعربية، يُدار من الأردن')),
    'support': dict(
        photos=('notebook', 'headset', 'lab'),
        en=dict(title='Customer support teams in Arabic and English | Jodesx',
                desc='Jodesx runs managed customer support teams for live chat, email and tickets in Arabic and English, on GMT+3.',
                h1='Customer support teams in Arabic',
                lead='A managed team answers your customers by live chat, email and tickets, in Arabic and English, on GMT+3.',
                tasks_h='What the support team answers', tasks_p='The channels a pilot team covers.',
                tasks=[('Live chat', 'Answers in the customer\'s own Arabic or in English'),
                       ('Email', 'Replies written to your tone and templates'),
                       ('Tickets', 'Worked in your helpdesk, tagged and closed'),
                       ('Escalations', 'Passed to your team with the case written up')],
                run_h='How we run a support team', run_p='Same model on every channel, managed by us end to end.',
                close='Support in Arabic, run from Jordan'),
        ar=dict(title='فرق خدمة العملاء بالعربية والإنجليزية | Jodesx',
                desc='تدير Jodesx فرق خدمة عملاء للدردشة المباشرة والبريد الإلكتروني والتذاكر، بالعربية والإنجليزية وبتوقيت GMT+3.',
                h1='فرق خدمة العملاء بالعربية',
                lead='فريق مُدار يرد على عملائك عبر الدردشة المباشرة والبريد الإلكتروني والتذاكر، بالعربية والإنجليزية وبتوقيت GMT+3.',
                tasks_h='ما يتولاه فريق الدعم', tasks_p='القنوات التي يغطيها الفريق التجريبي.',
                tasks=[('الدردشة المباشرة', 'ردود بلهجة العميل العربية أو بالإنجليزية'),
                       ('البريد الإلكتروني', 'ردود مكتوبة بأسلوبك وقوالبك'),
                       ('التذاكر', 'تُعالج في نظام الدعم لديك وتُصنّف وتُغلق'),
                       ('التصعيد', 'يُحال إلى فريقك مع ملخص مكتوب للحالة')],
                run_h='كيف ندير فريق الدعم', run_p='النموذج نفسه في كل قناة، ونديره نحن من البداية إلى النهاية.',
                close='دعم بالعربية، يُدار من الأردن')),
    'ai-data': dict(
        photos=('typing', 'keys', 'room'),
        en=dict(title='AI data annotation teams in Arabic | Jodesx',
                desc='Jodesx runs managed AI and data teams: annotation, AI answer rating, labelling, transcription and translation in Arabic and English.',
                h1='AI data teams for Arabic',
                lead='A managed team annotates, rates and transcribes your data in Arabic and English, with QA on every batch.',
                tasks_h='What the AI data team produces', tasks_p='The work a pilot team takes on.',
                tasks=[('Data annotation', 'Text, image and audio labelled to your schema'),
                       ('AI answer rating', 'Model answers scored against your rubric'),
                       ('Content classification', 'Items sorted into your categories'),
                       ('Transcription and translation', 'Arabic dialects to text, and Arabic to English')],
                run_h='How we run an AI data team', run_p='Same model on every project, managed by us end to end.',
                close='Arabic data work, run from Jordan'),
        ar=dict(title='فرق توسيم بيانات الذكاء الاصطناعي بالعربية | Jodesx',
                desc='تدير Jodesx فرق بيانات وذكاء اصطناعي: التوسيم، وتقييم إجابات الذكاء الاصطناعي، والتصنيف، والتفريغ الصوتي، والترجمة.',
                h1='فرق بيانات الذكاء الاصطناعي بالعربية',
                lead='فريق مُدار يوسم بياناتك ويقيّمها ويفرّغها بالعربية والإنجليزية، مع مراجعة جودة لكل دفعة.',
                tasks_h='ما ينتجه فريق البيانات', tasks_p='العمل الذي يتولاه الفريق التجريبي.',
                tasks=[('توسيم البيانات', 'نصوص وصور وصوت وفق المخطط الذي تحدده'),
                       ('تقييم إجابات الذكاء الاصطناعي', 'تقييم إجابات النموذج وفق معاييرك'),
                       ('تصنيف المحتوى', 'فرز العناصر في الفئات التي تحددها'),
                       ('التفريغ والترجمة', 'من اللهجات العربية إلى نص، ومن العربية إلى الإنجليزية')],
                run_h='كيف ندير فريق البيانات', run_p='النموذج نفسه في كل مشروع، ونديره نحن من البداية إلى النهاية.',
                close='بيانات عربية، تُدار من الأردن')),
    'back-office': dict(
        photos=('notebook', 'desk', 'room'),
        en=dict(title='Back office teams: data entry and virtual assistants | Jodesx',
                desc='Jodesx runs managed back office teams for data entry, data processing and virtual assistance, from Jordan on GMT+3.',
                h1='Back office teams from Jordan',
                lead='A managed team handles your data entry, processing and admin work, in Arabic and English, on GMT+3.',
                tasks_h='What the back office team handles', tasks_p='The daily work a pilot team takes on.',
                tasks=[('Data entry', 'Records typed into your systems from your sources'),
                       ('Data processing', 'Checking, cleaning and updating what you hold'),
                       ('Virtual assistants', 'Inbox, calendar and admin for your staff'),
                       ('Document work', 'Forms and files sorted, named and filed')],
                run_h='How we run a back office team', run_p='Same model on every task, managed by us end to end.',
                close='Back office work, run from Jordan'),
        ar=dict(title='فرق المكتب الخلفي: إدخال البيانات والمساعدون الافتراضيون | Jodesx',
                desc='تدير Jodesx فرق مكتب خلفي لإدخال البيانات ومعالجتها والمساعدة الافتراضية، من الأردن بتوقيت GMT+3.',
                h1='فرق المكتب الخلفي من الأردن',
                lead='فريق مُدار يتولى إدخال بياناتك ومعالجتها وأعمالك الإدارية، بالعربية والإنجليزية وبتوقيت GMT+3.',
                tasks_h='ما يتولاه فريق المكتب الخلفي', tasks_p='العمل اليومي الذي يتولاه الفريق التجريبي.',
                tasks=[('إدخال البيانات', 'سجلات تُدخل في أنظمتك من مصادرك'),
                       ('معالجة البيانات', 'التدقيق والتنظيف والتحديث لما لديك'),
                       ('المساعدون الافتراضيون', 'البريد والتقويم والأعمال الإدارية لموظفيك'),
                       ('أعمال المستندات', 'نماذج وملفات تُفرز وتُسمّى وتُحفظ')],
                run_h='كيف ندير فريق المكتب الخلفي', run_p='النموذج نفسه في كل مهمة، ونديره نحن من البداية إلى النهاية.',
                close='مكتب خلفي، يُدار من الأردن')),
    'sales-ops': dict(
        photos=('desk', 'headset', 'lab'),
        en=dict(title='Sales operations teams: appointments and lead qualification | Jodesx',
                desc='Jodesx runs managed sales operations teams that book meetings, qualify leads and build lead lists, in Arabic and English.',
                h1='Sales operations teams from Jordan',
                lead='A managed team books meetings, qualifies leads and builds lead lists for your sales team, in Arabic and English.',
                tasks_h='What the sales operations team delivers', tasks_p='The pipeline work a pilot team takes on.',
                tasks=[('Appointment setting', 'Meetings booked into your sales team\'s calendars'),
                       ('Lead qualification', 'Inbound leads checked against your criteria'),
                       ('Lead generation', 'New lists built to your target profile'),
                       ('CRM updates', 'Every contact logged in your CRM')],
                run_h='How we run a sales operations team', run_p='Same model on every pipeline, managed by us end to end.',
                close='Sales operations, run from Jordan'),
        ar=dict(title='فرق عمليات المبيعات: حجز المواعيد وتأهيل العملاء | Jodesx',
                desc='تدير Jodesx فرق عمليات مبيعات تحجز المواعيد وتؤهل العملاء المحتملين وتبني قوائم جديدة، بالعربية والإنجليزية.',
                h1='فرق عمليات المبيعات من الأردن',
                lead='فريق مُدار يحجز المواعيد ويؤهل العملاء المحتملين ويبني القوائم لفريق مبيعاتك، بالعربية والإنجليزية.',
                tasks_h='ما يقدّمه فريق عمليات المبيعات', tasks_p='عمل خط المبيعات الذي يتولاه الفريق التجريبي.',
                tasks=[('حجز المواعيد', 'اجتماعات تُحجز في تقويم فريق مبيعاتك'),
                       ('تأهيل العملاء المحتملين', 'فحص العملاء الواردين وفق معاييرك'),
                       ('توليد العملاء المحتملين', 'قوائم جديدة وفق الملف المستهدف'),
                       ('تحديث نظام CRM', 'تسجيل كل تواصل في نظام CRM لديك')],
                run_h='كيف ندير فريق عمليات المبيعات', run_p='النموذج نفسه في كل خط مبيعات، ونديره نحن من البداية إلى النهاية.',
                close='عمليات مبيعات، تُدار من الأردن')),
}


def service_page(slug, lang):
    d = SERVICES[slug]; c = d[lang]; pre = '../' if lang == 'ar' else ''
    page = f'{slug}.html'
    body = hero(lang, pre, c['h1'], c['lead'], d['photos'][0], F_EN if lang == 'en' else F_AR)
    body += split_rows('tasks', c['tasks_h'], c['tasks_p'], c['tasks'], d['photos'][1], lang, pre)
    body += band_rows('run', c['run_h'], c['run_p'], RUN_EN if lang == 'en' else RUN_AR, d['photos'][2], lang, pre, ' ground-surface')
    return head(lang, pre, page, c['title'], c['desc']) + nav(lang, pre, page) + '\n<main id="top">\n' + body + '</main>\n\n' + footer(lang, pre, c['close'])


PAGES = {
    'industries': dict(
        en=dict(title='Industries: who Jodesx runs teams for | Jodesx',
                desc='Jodesx runs managed teams for social and live-stream platforms, AI companies, online businesses and sales teams that need Arabic.',
                h1='Teams for platforms that need Arabic',
                lead='Who buys a managed team from Jodesx, and the work each one hands over.',
                facts=F_EN,
                a=('buyers', 'Who we run teams for', 'Four kinds of buyer, each with its own queue.',
                   [('Social and live-stream platforms', 'Moderation of streams, chat and uploads'),
                    ('AI and data companies', 'Annotation and answer rating in Arabic'),
                    ('Online businesses', 'Support for customers in the Arab world'),
                    ('Sales teams', 'Meetings booked and leads qualified')], 'typing'),
                b=('fit', 'What every buyer gets', 'The managed model is the same whatever the work.', RUN_EN, 'room'),
                photos=('desk',), close='Tell us the work, we run the team'),
        ar=dict(title='القطاعات: لمن تدير Jodesx الفرق | Jodesx',
                desc='تدير Jodesx فرقاً للمنصات الاجتماعية ومنصات البث المباشر وشركات الذكاء الاصطناعي والأعمال الإلكترونية وفرق المبيعات التي تحتاج العربية.',
                h1='فرق للمنصات التي تحتاج العربية',
                lead='من يشتري فريقاً مُداراً من Jodesx، والعمل الذي يسلّمه كل منهم.',
                facts=F_AR,
                a=('buyers', 'لمن ندير الفرق', 'أربعة أنواع من العملاء، لكل منها مسار عمله.',
                   [('المنصات الاجتماعية ومنصات البث', 'الإشراف على البث والدردشة والمحتوى المرفوع'),
                    ('شركات الذكاء الاصطناعي والبيانات', 'التوسيم وتقييم الإجابات بالعربية'),
                    ('الأعمال الإلكترونية', 'دعم العملاء في العالم العربي'),
                    ('فرق المبيعات', 'حجز المواعيد وتأهيل العملاء المحتملين')], 'typing'),
                b=('fit', 'ما يحصل عليه كل عميل', 'النموذج المُدار واحد مهما كان العمل.', RUN_AR, 'room'),
                photos=('desk',), close='أخبرنا بالعمل، ونحن ندير الفريق')),
    'about': dict(
        en=dict(title='About Jodesx: a managed outsourcing company in Jordan | Jodesx',
                desc='Jodesx is a remote-first managed outsourcing company in Jordan. We employ and run teams; we are not a staffing agency or a freelancer marketplace.',
                h1='A managed outsourcing company in Jordan',
                lead='We employ the people, run the work and answer for the results. You pay Jodesx, not individuals.',
                facts=[('Model', 'Managed teams'), ('Base', 'Jordan, remote-first'), ('Start', 'A pilot team of 2 to 3')],
                a=('what', 'What Jodesx is and is not', 'The difference decides who answers when work slips.',
                   [('Not a staffing agency', 'We do not place people with you'),
                    ('Not a freelancer marketplace', 'No profiles to browse, no hourly bids'),
                    ('A managed service', 'We hire, train, manage and replace the team'),
                    ('One invoice', 'Our margin is the difference between your fee and the team\'s cost')], 'siq'),
                b=('how', 'How the company works', 'Small on purpose at the start, and plain about it.', [
                    ('Remote-first', 'Teams work from Jordan without a call-centre floor'),
                    ('Pilot first', 'Every client starts with two or three people'),
                    ('Arabic first', 'Native speakers for Arabic queues'),
                    ('Growth from results', 'Teams grow as the pilot meets its SLA')], 'keys'),
                photos=('lab',), close='Start with two or three people'),
        ar=dict(title='عن Jodesx: شركة تعهيد مُدار في الأردن | Jodesx',
                desc='Jodesx شركة تعهيد مُدار في الأردن تعمل عن بُعد أولاً. نوظّف الفرق وندير عملها، ولسنا وكالة توظيف ولا منصة لبيع العمل الحر.',
                h1='شركة تعهيد مُدار في الأردن',
                lead='نوظّف الأشخاص وندير العمل ونتحمّل مسؤولية النتائج. تدفع لـ Jodesx، لا للأفراد.',
                facts=[('النموذج', 'فرق مُدارة'), ('المقر', 'الأردن، عن بُعد أولاً'), ('البداية', 'فريق تجريبي من 2 إلى 3')],
                a=('what', 'ما هي Jodesx وما ليست', 'هذا الفرق يحدد من يتحمّل المسؤولية حين يتعثر العمل.',
                   [('لسنا وكالة توظيف', 'لا نرسل موظفين للعمل لديك'),
                    ('لسنا منصة عمل حر', 'لا ملفات تتصفحها ولا عروض بالساعة'),
                    ('خدمة مُدارة', 'نوظّف الفريق وندرّبه ونديره ونستبدل أفراده'),
                    ('فاتورة واحدة', 'ربحنا هو الفرق بين ما تدفعه وتكلفة الفريق')], 'siq'),
                b=('how', 'كيف تعمل الشركة', 'نبدأ صغاراً عن قصد، ونقول ذلك بوضوح.', [
                    ('عن بُعد أولاً', 'الفرق تعمل من الأردن دون قاعة مركز اتصال'),
                    ('الفريق التجريبي أولاً', 'كل عميل يبدأ بشخصين أو ثلاثة'),
                    ('العربية أولاً', 'متحدثون أصليون لمسارات العمل العربية'),
                    ('نمو مبني على النتائج', 'يكبر الفريق حين يحقق الفريق التجريبي أهدافه')], 'keys'),
                photos=('lab',), close='ابدأ بشخصين أو ثلاثة')),
}


def info_page(slug, lang):
    c = PAGES[slug][lang]; pre = '../' if lang == 'ar' else ''
    page = f'{slug}.html'
    body = hero(lang, pre, c['h1'], c['lead'], c['photos'][0], c['facts'])
    a = c['a']; b = c['b']
    body += split_rows(a[0], a[1], a[2], a[3], a[4], lang, pre)
    body += band_rows(b[0], b[1], b[2], b[3], b[4], lang, pre, ' ground-surface')
    return head(lang, pre, page, c['title'], c['desc']) + nav(lang, pre, page, current=page) + '\n<main id="top">\n' + body + '</main>\n\n' + footer(lang, pre, c['close'])


def careers_page(lang):
    pre = '../' if lang == 'ar' else ''; page = 'careers.html'
    if lang == 'en':
        body = hero(lang, pre, 'Remote jobs in managed teams', 'Remote roles in Jordan for people who read and write Arabic and English well. We train you on each client\'s rules.', 'room',
                    [('Where', 'Remote, in Jordan'), ('Languages', 'Arabic and English'), ('Training', 'Paid, before live work')],
                    second=('See the roles', '#roles'), cta=('Apply to join a team', '#apply'))
        body += split_rows('roles', 'Roles we hire for', 'Each role works on one client queue with a team lead.', [
            ('Content moderator', 'Reviews posts, chat, streams and media against a policy'),
            ('Support agent', 'Answers customers by chat, email and tickets'),
            ('Data annotator', 'Labels and rates text, audio and AI answers'),
            ('Team lead', 'Checks quality, coaches the team and reports to the client')], 'lab', lang, pre)
        body += form_section('apply', 'Apply to join a team', 'Tell us which role and how you use Arabic and English. We write back to everyone.', [
            ('name', 'Name', 'text', 'name', 'Write your name.'),
            ('email', 'Email', 'email', 'email', 'Write an email address with an @, like name@mail.com.'),
            ('role', 'Role', 'text', 'off', 'Write the role, such as content moderator.')],
            'Send my application', 'Your application is in. We write back within five working days.', 'We write back within five working days.', 'typing', lang, pre, 'careers@jodesx.example')
        close = 'Work for platforms abroad from Jordan'
        title, desc = 'Careers at Jodesx: remote jobs in Jordan | Jodesx', 'Remote jobs in Jordan in content moderation, customer support and AI data, in Arabic and English. Paid training before live work.'
    else:
        body = hero(lang, pre, 'وظائف عن بُعد في فرق مُدارة', 'وظائف عن بُعد في الأردن لمن يجيد القراءة والكتابة بالعربية والإنجليزية. ندرّبك على قواعد كل عميل.', 'room',
                    [('المكان', 'عن بُعد، في الأردن'), ('اللغات', 'العربية والإنجليزية'), ('التدريب', 'مدفوع، قبل العمل الفعلي')],
                    second=('اطّلع على الوظائف', '#roles'), cta=('قدّم طلب انضمام', '#apply'))
        body += split_rows('roles', 'الوظائف التي نوظّف لها', 'كل وظيفة تعمل على مسار عمل عميل واحد مع قائد فريق.', [
            ('مشرف محتوى', 'يراجع المنشورات والدردشة والبث والوسائط وفق السياسة'),
            ('موظف دعم', 'يرد على العملاء عبر الدردشة والبريد والتذاكر'),
            ('موسّم بيانات', 'يوسم ويقيّم النصوص والصوت وإجابات الذكاء الاصطناعي'),
            ('قائد فريق', 'يراجع الجودة ويوجّه الفريق ويرفع التقارير للعميل')], 'lab', lang, pre)
        body += form_section('apply', 'قدّم طلب انضمام إلى فريق', 'أخبرنا بالوظيفة وكيف تستخدم العربية والإنجليزية. نرد على كل المتقدمين.', [
            ('name', 'الاسم', 'text', 'name', 'اكتب اسمك.'),
            ('email', 'البريد الإلكتروني', 'email', 'email', 'اكتب بريداً إلكترونياً يحتوي على @، مثل name@mail.com.'),
            ('role', 'الوظيفة', 'text', 'off', 'اكتب الوظيفة، مثل مشرف محتوى.')],
            'أرسل طلبي', 'وصلنا طلبك. نرد عليك خلال خمسة أيام عمل.', 'نرد عليك خلال خمسة أيام عمل.', 'typing', lang, pre, 'careers@jodesx.example')
        close = 'اعمل لمنصات عالمية من الأردن'
        title, desc = 'الوظائف في Jodesx: وظائف عن بُعد في الأردن | Jodesx', 'وظائف عن بُعد في الأردن في الإشراف على المحتوى وخدمة العملاء وبيانات الذكاء الاصطناعي، بالعربية والإنجليزية، مع تدريب مدفوع.'
    return head(lang, pre, page, title, desc) + nav(lang, pre, page, current=page) + '\n<main id="top">\n' + body + '</main>\n\n' + footer(lang, pre, close)


LEGAL = {
    'privacy': dict(
        en=('Privacy at Jodesx', 'How Jodesx uses the details you send through this website.', [
            ('What we collect', 'Only what you type into a form: your name, email, company, the work you describe or the role you apply for.'),
            ('Why we use it', 'To reply to you, to scope a pilot team, or to assess a job application. Nothing else.'),
            ('Who sees it', 'The Jodesx staff who answer you. We do not sell or rent your details.'),
            ('How long we keep it', 'As long as we are talking or working together, then we delete it, unless the law asks us to keep it.'),
            ('Your rights', 'Write to us to see, correct or delete what we hold about you.'),
            ('Client data', 'Data a client gives our teams is handled under that client\'s contract and access rules, not this notice.')]),
        ar=('الخصوصية في Jodesx', 'كيف تستخدم Jodesx البيانات التي ترسلها عبر هذا الموقع.', [
            ('ما الذي نجمعه', 'فقط ما تكتبه في النماذج: اسمك وبريدك وشركتك والعمل الذي تصفه أو الوظيفة التي تتقدم لها.'),
            ('لماذا نستخدمه', 'للرد عليك، أو لتحديد نطاق فريق تجريبي، أو لتقييم طلب توظيف. لا شيء غير ذلك.'),
            ('من يطّلع عليه', 'موظفو Jodesx الذين يردون عليك. لا نبيع بياناتك ولا نؤجرها.'),
            ('مدة الاحتفاظ', 'طوال فترة تواصلنا أو عملنا معاً، ثم نحذفها، إلا إذا طلب القانون الاحتفاظ بها.'),
            ('حقوقك', 'راسلنا لتطّلع على بياناتك لدينا أو تصححها أو تحذفها.'),
            ('بيانات العملاء', 'البيانات التي يسلّمها العميل لفرقنا تُعامل وفق عقد العميل وقواعد الوصول لديه، لا وفق هذا الإشعار.')])),
    'terms': dict(
        en=('Terms of use', 'The terms for using the Jodesx website.', [
            ('This website', 'It describes the services of Jodesx. It is not an offer; every engagement is agreed in a written contract.'),
            ('Services', 'Scope, SLA, prices and data handling for each client are set in that client\'s contract.'),
            ('Content', 'Text and design belong to Jodesx. Photographs are used under the licences listed on the credits page.'),
            ('Links', 'We are not responsible for the content of other websites we link to.'),
            ('Changes', 'We may update these terms; the version on this page applies.')]),
        ar=('شروط الاستخدام', 'شروط استخدام موقع Jodesx.', [
            ('هذا الموقع', 'يصف خدمات Jodesx، وليس عرضاً ملزماً. كل تعاقد يُتفق عليه في عقد مكتوب.'),
            ('الخدمات', 'نطاق العمل واتفاقية مستوى الخدمة والأسعار والتعامل مع البيانات تُحدد في عقد كل عميل.'),
            ('المحتوى', 'النصوص والتصميم ملك لـ Jodesx. الصور مستخدمة وفق التراخيص المذكورة في صفحة حقوق الصور.'),
            ('الروابط', 'لسنا مسؤولين عن محتوى المواقع الأخرى التي نشير إليها.'),
            ('التعديلات', 'قد نحدّث هذه الشروط، والنسخة المنشورة في هذه الصفحة هي المعتمدة.')])),
}


def legal_page(slug, lang):
    pre = '../' if lang == 'ar' else ''; page = f'{slug}.html'
    h1, desc, parts = LEGAL[slug][lang]
    sec = ''.join(f'<h2>{a}</h2><p>{b}</p>' for a, b in parts)
    body = f'''  <section class="section" id="legal" style="--h: 2" aria-labelledby="legal-h">
    <div class="wrap"><div class="legal stack-4"><h1 id="legal-h">{h1}</h1><p class="t-lead">{desc}</p>{sec}</div></div>
  </section>
'''
    return head(lang, pre, page, f'{h1} | Jodesx', desc) + nav(lang, pre, page) + '\n<main id="top">\n' + body + '</main>\n\n' + footer(lang, pre, 'Questions about your data? Write to us' if lang == 'en' else 'لديك سؤال عن بياناتك؟ راسلنا')


def refresh_home(lang):
    path = os.path.join(ROOT, 'ar/index.html' if lang == 'ar' else 'index.html')
    s = open(path, encoding='utf-8').read()
    pre = '../' if lang == 'ar' else ''
    new_nav = nav(lang, pre, 'index.html').replace('href="index.html#services"', 'href="#services"').replace('href="index.html#pilot"', 'href="#pilot"').replace('class="nav__logo" href="index.html"', 'class="nav__logo" href="#top"')
    s = re.sub(r'<header class="nav nav--centre">.*?</header>\n', new_nav, s, flags=re.S)
    w = W[lang]
    svc_links = ''.join(f'<li><a href="{x[0]}.html">{x[1] if lang == "en" else x[3]}</a></li>' for x in SVC)
    company = ''.join(f'<li><a href="{h}">{t}</a></li>' for t, h in [(w['nav'][1][0], 'industries.html'), (w['nav'][2][0], 'about.html'), (w['nav'][3][0], 'careers.html')])
    cols = (f'<div class="span-2 footer__col"><h3>{w["svc_group"]}</h3><ul>{svc_links}</ul></div>\n'
            f'        <div class="span-2 footer__col"><h3>{w["col_company"]}</h3><ul>{company}</ul></div>\n'
            f'        <div class="span-2 footer__col"><h3>{w["col_contact"]}</h3><ul><li><a href="mailto:hello@jodesx.example">{w["email"]}</a></li><li><a href="privacy.html">{w["privacy"]}</a></li><li><a href="terms.html">{w["terms"]}</a></li></ul></div>\n')
    s = re.sub(r'<div class="span-2 footer__col">.*?(?=      </div>\n      <div class="footer__legal">)', cols, s, flags=re.S)
    open(path, 'w', encoding='utf-8').write(s)


# ---------------------------------------------------------------- home page
HOME = {
 'en': dict(
  title='Jodesx: Arabic moderation and AI data teams',
  desc='Jodesx runs managed teams of native Arabic and English speakers for content moderation, user support and AI data, from Jordan on GMT+3.',
  pill=('Pilot teams of 2 to 3 people', 'Request one'),
  h1='Arabic moderation and AI data teams',
  lead='Native Arabic and English speakers review content, answer users and label AI data for platforms worldwide. We hire, train and run the team; you hold one SLA.',
  second=('See the services', '#services'),
  win_label='A Jodesx moderator removing an Arabic comment from a platform queue under its hate speech policy',
  win_bar=('Queue · Comments, Arabic', 'Policy 3.2'),
  inbox=[('LV', 'Levantine', 'Flagged comment on a live stream'), ('GF', 'Gulf', 'Image report · profile photo'), ('EG', 'Egyptian', 'Chat message · spam link'), ('EN', 'English', 'Video report · under review')],
  item_ar='كل اللي من هالبلد لازم ينطردوا من هون',
  tool='Checked against your hate speech policy · Levantine Arabic',
  verdict='Removed: targets people by national origin. Policy 3.2, logged for the weekly report.',
  acts=('Remove', 'Keep', 'Escalate'),
  svc_h='Five services, run as one team', svc_p='Each runs in your tools, to your rules, under one Jodesx SLA.',
  cards=[
   ('moderation', 'Moderates content in Arabic', 'Streams, comments, chat, images and video, reviewed against your policy.'),
   ('ai-data', 'Labels Arabic and English data', 'Annotation, AI answer rating, classification and transcription.'),
   ('support', 'Answers users in their dialect', 'Live chat, email and tickets in Arabic and English.'),
   ('back-office', 'Keeps back-office work moving', 'Data entry, processing and virtual assistants.'),
   ('sales-ops', 'Fills your sales calendar', 'Meetings booked and leads qualified for your team.')],
  statement='One team. One SLA.', statement_sub='You do not manage freelancers or sign up to an agency. Jodesx employs the team, trains it on your rules, checks its work daily and reports against the targets we agreed.',
  sla=[('Queue', 'Your Arabic or English work'), ('Hours', 'Covered on GMT+3'), ('Quality', 'Samples reviewed daily'), ('Reporting', 'Results against the SLA')],
  why_h='Why platforms put Arabic queues with us', why_p='What a buyer in Europe or the Gulf gets from a team in Jordan.',
  why=[('Arabic as a first language', 'Dialect, slang and context read the way users write them'),
       ('Hours that cover two regions', 'GMT+3 overlaps the working day in Europe and the Gulf'),
       ('A managed team', 'Our leads hire, coach and replace people; you talk to one account lead'),
       ('A small first step', 'A pilot of two or three people on one queue before anything grows')],
  faq_h='Questions buyers ask', faq_p='Anything else, ask when you request a pilot.',
  faq=[('Is Jodesx a staffing agency?', 'No. We do not place people with you. We employ, manage and replace the team ourselves.'),
       ('Who do we pay for the team?', 'You pay Jodesx one invoice for the service. We pay the team.'),
       ('Whose tools does the team use?', 'Yours. The team works inside your moderation, helpdesk or labelling tools under the access you set.'),
       ('How small can a pilot team be?', 'Two or three people on one queue.'),
       ('Which languages does the team use?', 'Arabic, as a first language, and English.')],
  pilot_h='Request a pilot team', pilot_p='Tell us the queue and the language. We reply with a scope, an SLA draft and a start date.',
  fields=[('name', 'Name', 'text', 'name', 'Write your name.'), ('email', 'Work email', 'email', 'email', 'Write an email address with an @, like name@company.com.'),
          ('company', 'Company', 'text', 'organization', 'Write the company or platform name.'), ('work', 'The work', 'text', 'off', 'Write the work, such as Arabic chat moderation.')],
  sent='Your pilot team request is in. We reply within two working days.', reply='We reply within two working days.',
  close_h='Put your Arabic queue in managed hands', close_p='A pilot of two or three people on one queue. We reply within two working days.'),
 'ar': dict(
  title='Jodesx: فرق إشراف وبيانات ذكاء اصطناعي بالعربية',
  desc='تدير Jodesx فرقاً من متحدثين أصليين بالعربية والإنجليزية للإشراف على المحتوى ودعم المستخدمين وبيانات الذكاء الاصطناعي، من الأردن بتوقيت GMT+3.',
  pill=('فرق تجريبية من 2 إلى 3 أشخاص', 'اطلب فريقاً'),
  h1='فرق إشراف وبيانات ذكاء اصطناعي بالعربية',
  lead='متحدثون أصليون بالعربية والإنجليزية يراجعون المحتوى ويردّون على المستخدمين ويوسمون بيانات الذكاء الاصطناعي لمنصات حول العالم. نحن نوظّف الفريق وندرّبه وندير عمله، وأنت تتابع اتفاقية خدمة واحدة.',
  second=('اطّلع على الخدمات', '#services'),
  win_label='مشرف من Jodesx يحذف تعليقاً عربياً من قائمة مراجعة منصة وفق سياسة خطاب الكراهية',
  win_bar=('قائمة المراجعة · تعليقات عربية', 'السياسة 3.2'),
  inbox=[('LV', 'شامية', 'تعليق مُبلّغ عنه على بث مباشر'), ('GF', 'خليجية', 'بلاغ صورة · صورة الملف الشخصي'), ('EG', 'مصرية', 'رسالة دردشة · رابط مزعج'), ('EN', 'إنجليزية', 'بلاغ فيديو · قيد المراجعة')],
  item_ar='كل اللي من هالبلد لازم ينطردوا من هون',
  tool='مراجعة وفق سياسة خطاب الكراهية لديك · لهجة شامية',
  verdict='حُذف: يستهدف أشخاصاً بسبب أصلهم الوطني. السياسة 3.2، ومُسجّل في التقرير الأسبوعي.',
  acts=('حذف', 'إبقاء', 'تصعيد'),
  svc_h='خمس خدمات، يديرها فريق واحد', svc_p='كل خدمة تعمل في أدواتك، وفق قواعدك، ضمن اتفاقية خدمة واحدة مع Jodesx.',
  cards=[
   ('moderation', 'إشراف على المحتوى بالعربية', 'البث والتعليقات والدردشة والصور والفيديو، وفق سياستك.'),
   ('ai-data', 'توسيم بيانات عربية وإنجليزية', 'التوسيم وتقييم إجابات الذكاء الاصطناعي والتصنيف والتفريغ.'),
   ('support', 'ردود على المستخدمين بلهجتهم', 'دردشة مباشرة وبريد وتذاكر بالعربية والإنجليزية.'),
   ('back-office', 'إنجاز أعمال المكتب الخلفي', 'إدخال البيانات ومعالجتها ومساعدون افتراضيون.'),
   ('sales-ops', 'تعبئة تقويم فريق مبيعاتك', 'حجز المواعيد وتأهيل العملاء المحتملين.')],
  statement='فريق واحد. اتفاقية واحدة.', statement_sub='لا تدير مستقلين ولا تتعاقد مع وكالة توظيف. Jodesx توظّف الفريق، وتدرّبه على قواعدك، وتراجع عمله يومياً، وترفع التقارير وفق الأهداف المتفق عليها.',
  sla=[('مسار العمل', 'عملك بالعربية أو الإنجليزية'), ('الساعات', 'تغطية بتوقيت GMT+3'), ('الجودة', 'مراجعة عيّنات يومياً'), ('التقارير', 'نتائج وفق اتفاقية الخدمة')],
  why_h='لماذا تسلّمنا المنصات مسارات العمل العربية', why_p='ما يحصل عليه عميل في أوروبا أو الخليج من فريق في الأردن.',
  why=[('العربية لغة أم', 'اللهجة والعامية والسياق كما يكتبها المستخدمون'),
       ('ساعات تغطي منطقتين', 'توقيت GMT+3 يتقاطع مع يوم العمل في أوروبا والخليج'),
       ('فريق مُدار', 'قادتنا يوظّفون ويوجّهون ويستبدلون، وأنت تتواصل مع مسؤول حساب واحد'),
       ('بداية صغيرة', 'فريق تجريبي من شخصين أو ثلاثة على مسار واحد قبل أي توسّع')],
  faq_h='أسئلة يطرحها العملاء', faq_p='لأي سؤال آخر، اسألنا عند طلب الفريق التجريبي.',
  faq=[('هل Jodesx وكالة توظيف؟', 'لا. نحن لا نرسل موظفين للعمل لديك، بل نوظّف الفريق ونديره ونستبدل أفراده بأنفسنا.'),
       ('لمن ندفع مقابل الفريق؟', 'تدفع لـ Jodesx بفاتورة واحدة عن الخدمة، ونحن ندفع رواتب الفريق.'),
       ('أي أدوات يستخدم الفريق؟', 'أدواتك. يعمل الفريق داخل أدوات الإشراف أو الدعم أو التوسيم لديك وبالصلاحيات التي تحددها.'),
       ('ما أصغر حجم للفريق التجريبي؟', 'شخصان أو ثلاثة على مسار عمل واحد.'),
       ('بأي لغات يعمل الفريق؟', 'العربية لغةً أمّاً، والإنجليزية.')],
  pilot_h='اطلب فريقاً تجريبياً', pilot_p='أخبرنا بمسار العمل واللغة، ونرد عليك بنطاق العمل ومسودة اتفاقية الخدمة وموعد البدء.',
  fields=[('name', 'الاسم', 'text', 'name', 'اكتب اسمك.'), ('email', 'بريد العمل الإلكتروني', 'email', 'email', 'اكتب بريداً إلكترونياً يحتوي على @، مثل name@company.com.'),
          ('company', 'الشركة', 'text', 'organization', 'اكتب اسم الشركة أو المنصة.'), ('work', 'العمل المطلوب', 'text', 'off', 'اكتب العمل، مثل الإشراف على الدردشة بالعربية.')],
  sent='وصلنا طلب الفريق التجريبي. نرد عليك خلال يومَي عمل.', reply='نرد عليك خلال يومَي عمل.',
  close_h='سلّم مسار عملك العربي لفريق مُدار', close_p='فريق تجريبي من شخصين أو ثلاثة على مسار واحد. نرد عليك خلال يومَي عمل.'),
}

MINI = {  # a small drawing of each service's work, in its card panel
 'moderation': '<div class="mini"><div class="mini__row"><span class="chip chip--warn">Flagged</span><span dir="rtl" lang="ar">تعليق على بث مباشر</span></div><div class="mini__row"><span class="chip chip--ok">Kept</span><span>Image · profile photo</span></div><div class="mini__row"><span class="chip chip--bad">Removed</span><span>Chat · spam link</span></div></div>',
 'ai-data': '<div class="mini"><p class="mini__text" dir="rtl" lang="ar">وصلت الطلبية إلى <mark>عمّان</mark> يوم <mark class="m2">الخميس</mark></p><div class="mini__row"><span class="chip">Place</span><span class="chip chip--alt">Date</span><span class="mini__meta">2 labels · reviewed</span></div></div>',
 'support': '<div class="mini"><div class="bub" dir="rtl" lang="ar">وين وصل طلبي؟</div><div class="bub bub--me" dir="rtl" lang="ar">طلبك بالطريق، بوصلك بكرا قبل الظهر.</div></div>',
 'back-office': '<div class="mini"><div class="mini__row"><span class="tick"></span><span>Invoice batch entered</span></div><div class="mini__row"><span class="tick"></span><span>Supplier records checked</span></div><div class="mini__row"><span class="tick tick--open"></span><span>Inbox sorted for the CFO</span></div></div>',
 'sales-ops': '<div class="mini"><div class="mini__row"><span class="chip chip--ok">Booked</span><span>Demo call · Tuesday 11:00</span></div><div class="mini__row"><span class="chip">Qualified</span><span>Inbound lead · retail</span></div></div>',
}

HOME_CSS = """
<link rel="stylesheet" href="{pre}assets/layout/demo.css">
<style>
  .inbox .t i {{ grid-row: 1 / span 2; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font: 500 11px/1 var(--font-mono); font-style: normal; color: #0a0d14; background: #5ab9fc; }}
  .hero__window {{ background: radial-gradient(90% 70% at 50% 120%, #5ab9fc 0, rgb(90 185 252 / .35) 30%, transparent 62%), radial-gradient(60% 50% at 12% 0%, rgb(90 185 252 / .18), transparent 70%), linear-gradient(#111827, #0d1220); border: 1px solid rgb(255 255 255 / .06); }}
  .d-win--dark {{ background: #0f1420; }}
  .d-win--dark .d-win__body {{ grid-template-columns: 250px 1fr; min-height: 420px; }}
  .d-win--dark .d-win__bar b {{ color: #eceef0; font-weight: 500; }} .d-win--dark .d-win__bar .sp {{ flex: 1; }}
  .hero__window .d-chat {{ padding: 14px 18px; gap: 10px; }}
  .inbox {{ border-inline-end: 1px solid rgb(255 255 255 / .07); padding: 10px; display: grid; align-content: start; gap: 2px; }}
  .inbox .t {{ display: grid; grid-template-columns: 30px 1fr auto; gap: 1px 10px; padding: 9px 8px; border-radius: 9px; font-size: 13px; }}
  .inbox .t.is-on {{ background: rgb(255 255 255 / .07); }}
  .inbox .t b {{ font-weight: 500; color: #eceef0; }} .inbox .t time {{ color: #7d8389; font-size: 13px; }}
  .inbox .t span {{ grid-column: 2 / -1; color: #8d9399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }}
  .convo {{ display: grid; min-width: 0; align-content: start; }}
  .d-msg--bot {{ background: #1b2231; color: #e9ecee; max-width: 86%; }}
  .acts {{ display: flex; gap: 8px; }} .acts span {{ height: 30px; padding: 0 12px; border-radius: 99px; display: inline-flex; align-items: center; font-size: 13px; font-weight: 500; background: rgb(255 255 255 / .08); color: #e9ecee; }}
  #sla {{ overflow: clip; }}
  html .hero .hero__lead, html #sla .mo-la__sub {{ color: var(--p-ink); }}
  .sla-card {{ margin-top: var(--s-7); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-5); }}
  .sla-card div {{ padding-top: var(--s-4); border-top: 1px solid rgb(255 255 255 / .12); }} .sla-card dt {{ color: var(--p-muted); font-size: 13px; }} .sla-card dd {{ margin: 6px 0 0; font-size: 18px; }}
  @media (max-width: 1023px) {{ .sla-card {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }} }}
  @media (max-width: 639px) {{ .d-win--dark .d-win__body {{ grid-template-columns: 1fr; }} .inbox {{ display: none; }} .hero__window .d-chat {{ font-size: 13px; padding: 12px 14px; }} .hero__window .d-tool {{ display: none; }} .hero__window .d-win__bar .sp ~ span {{ display: none; }} }}
  .verdict {{ border-left: 3px solid #f07178; }}
  .acts span:first-child {{ background: #f07178; color: #0a0d14; }}
  #services .panel {{ --p-h: 280px; }}
  @media (max-width: 639px) {{ #services .panel {{ --p-h: 130px; }} #services .card > p {{ display: none; }} #services .bub:not(.bub--me) {{ display: none; }} }}
  .mini {{ display: grid; gap: 10px; margin: 24px 24px 0; padding: 18px; border-radius: 12px 12px 0 0; background: #0f1420; color: #e9edf3; font-size: 14px; align-content: start; min-height: calc(var(--p-h) - 24px); box-shadow: 0 0 0 1px rgb(255 255 255 / .06); }}
  html .faq .faq__item h3 {{ font-family: var(--font-display); }}
  .mini__row {{ display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; }} .mini__row > span:last-child {{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
  .chip {{ flex: none; font: 500 13px/1 var(--font-text); padding: 5px 8px; border-radius: 6px; background: rgb(90 185 252 / .16); color: #9fd6ff; }}
  .chip--alt {{ background: rgb(240 196 113 / .16); color: #f3cf8a; }} .chip--ok {{ background: rgb(120 220 160 / .14); color: #93e2b2; }}
  .chip--warn {{ background: rgb(240 196 113 / .16); color: #f3cf8a; }} .chip--bad {{ background: rgb(240 113 120 / .16); color: #f6a1a6; }}
  .mini__meta {{ color: #b7c0cf; font-size: 13px; }} .mini__text {{ margin: 0; font-size: 16px; }}
  .mini mark {{ background: rgb(90 185 252 / .22); color: inherit; border-radius: 4px; padding: 0 3px; }} .mini mark.m2 {{ background: rgb(240 196 113 / .22); }}
  .bub {{ justify-self: start; max-width: 85%; padding: 8px 12px; border-radius: 12px; background: rgb(255 255 255 / .07); }} .bub--me {{ justify-self: end; background: #5ab9fc; color: #0a0d14; }}
  .tick {{ flex: none; width: 16px; height: 16px; border-radius: 50%; background: #5ab9fc; }} .tick--open {{ background: transparent; border: 2px solid #5ab9fc; }}
</style>
"""


def home_page(lang):
    c = HOME[lang]; pre = '../' if lang == 'ar' else ''; w = W[lang]
    flip = ' style="transform:scaleX(-1)"' if lang == 'ar' else ''
    inbox = ''.join(f'<div class="t{" is-on" if i == 0 else ""}"><i>{a}</i><b>{b}</b><time>{["10:42","10:39","10:31","10:12"][i]}</time><span>{t}</span></div>' for i, (a, b, t) in enumerate(c['inbox']))
    hero_html = f"""  <section class="hero hero--centred" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text">
      <div class="hero__c">
        <a class="pill" href="#pilot"><span>{c['pill'][0]}</span><span class="muted">{c['pill'][1]}</span></a>
        <h1 id="hero-h">{c['h1']}</h1>
        <p class="hero__lead">{c['lead']}</p>
        <div class="btn-row"><a class="btn btn--primary" href="#pilot">{w['cta']}{ARROW.format(flip=flip)}</a><a class="btn btn--secondary" href="{c['second'][1]}">{c['second'][0]}</a></div>
      </div>
      <div class="hero__window" role="img" aria-label="{c['win_label']}">
        <div class="ly-piece d-win d-win--dark" aria-hidden="true">
          <div class="d-win__bar"><span class="d-win__dots"><i></i><i></i><i></i></span><span><b>{c['win_bar'][0]}</b></span><span class="sp"></span><span>{c['win_bar'][1]}</span></div>
          <div class="d-win__body">
            <div class="inbox">{inbox}</div>
            <div class="convo">
              <div class="d-chat" data-ly-steps="900">
                <div class="d-msg d-msg--me" dir="rtl" lang="ar">{c['item_ar']}<small dir="ltr">@user_5521 · 10:42</small></div>
                <div class="d-tool" data-step>{c['tool']}</div>
                <div class="d-msg d-msg--bot verdict" data-step>{c['verdict']}</div>
                <div class="acts" data-step><span>{c['acts'][0]}</span><span>{c['acts'][1]}</span><span>{c['acts'][2]}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  </section>
"""
    def card(slug, t, d, span):
        return f'<a class="card card--row {span}" href="{slug}.html"><h3>{t}</h3><p>{d}</p><div class="panel" data-visual><div class="stage">{MINI[slug]}</div></div></a>'
    cs = c['cards']
    row1 = ''.join(card(*x, 'span-6') for x in cs[:2]); row2 = ''.join(card(*x, 'span-4') for x in cs[2:])
    svc = f"""  <section class="section g2" id="services" aria-labelledby="services-h">
    <div class="wrap">
      <div class="group">
        <div class="section-head"><h2 id="services-h">{c['svc_h']}</h2><p>{c['svc_p']}</p></div>
        <div class="grid">{row1}</div>
      </div>
      <div class="grid">{row2}</div>
    </div>
  </section>
"""
    stmt = f"""  <section class="section" id="sla" data-moment="letters-assemble" aria-labelledby="sla-h">
    <div class="wrap">
      <h2 class="mo-la__type" id="sla-h">{c['statement']}</h2>
      <p class="mo-la__sub">{c['statement_sub']}</p>
      <dl class="sla-card">{''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in c['sla'])}</dl>
    </div>
  </section>
"""
    rows = ''.join(f'<li><span class="rows__name">{a}<small>{b}</small></span></li>' for a, b in c['why'])
    why = f"""  <section class="section ground-inverse" id="why" data-moment="line-carries-colour" data-moment-opts='{{"from": "base"}}' aria-labelledby="why-h">
    <div class="wrap grid grid--top">
      <div class="span-6">
        <div class="section-head"><h2 id="why-h">{c['why_h']}</h2><p>{c['why_p']}</p></div>
        <ul class="rows">{rows}</ul>
      </div>
      <div class="frame frame--photo frame--fill split-photo span-6 start-7">{img('amman', lang, pre, sizes='(max-width: 1023px) 180vw, 90vw')}</div>
    </div>
  </section>
"""
    faqs = ''.join(f'<div class="faq__item"><h3>{q}</h3><p>{a}</p></div>' for q, a in c['faq'])
    faq = f"""  <section class="section" id="faq" aria-labelledby="faq-h">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-4"><h2 id="faq-h">{c['faq_h']}</h2><p class="muted">{c['faq_p']}</p></div>
      <div class="faq span-6 start-7">{faqs}</div>
    </div>
  </section>
"""
    pilot = form_section('pilot', c['pilot_h'], c['pilot_p'], c['fields'], w['cta'], c['sent'], c['reply'], 'siq', lang, pre, 'hello@jodesx.example')
    body = hero_html + svc + stmt + why + faq + pilot
    h = head(lang, pre, 'index.html', c['title'], c['desc'])
    h = h.replace('</head>', HOME_CSS.format(pre=pre) + """<script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>
<link rel="modulepreload" href="{pre}assets/moments/moments.js"><link rel="modulepreload" href="{pre}assets/moments/lib.js">
<link rel="modulepreload" href="{pre}assets/moments/letters-assemble/moment.js"><link rel="modulepreload" href="{pre}assets/moments/line-carries-colour/moment.js">
</head>""".format(pre=pre))
    n = nav(lang, pre, 'index.html').replace('href="index.html#services"', 'href="#services"').replace('href="index.html#pilot"', 'href="#pilot"').replace('class="nav__logo" href="index.html"', 'class="nav__logo" href="#top"')
    f = footer(lang, pre, c['close_h']).replace('href="index.html#pilot"', 'href="#pilot"')
    f = f.replace(f"<p class=\"t-lead\">{w['close_line']}</p>", f"<p class=\"t-lead\">{c['close_p']}</p>")
    return h + n + '\n<main id="top">\n' + body + '</main>\n\n' + f


def write(rel, html):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(html)


if __name__ == '__main__':
    for lang in ('en', 'ar'):
        d = 'ar/' if lang == 'ar' else ''
        for slug in SERVICES: write(f'{d}{slug}.html', service_page(slug, lang))
        for slug in PAGES: write(f'{d}{slug}.html', info_page(slug, lang))
        write(f'{d}careers.html', careers_page(lang))
        for slug in LEGAL: write(f'{d}{slug}.html', legal_page(slug, lang))
        write(f'{d}index.html', home_page(lang))
    print('built')
