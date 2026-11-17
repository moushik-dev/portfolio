import { ReactNode, useEffect, useState } from 'react'
import StarsCanvas from './components/canvas/StarsCanvas'
import EarthCanvas from './components/canvas/EarthCanvas'
import TiltCard from './components/TiltCard'

type IconName =
  | 'arrow'
  | 'code'
  | 'community'
  | 'email'
  | 'github'
  | 'graduation'
  | 'menu'
  | 'moon'
  | 'spark'
  | 'sun'
  | 'trophy'
  | 'x'
  | 'user'
  | 'monitor'

const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" /></>,
  community: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M15 15c3 0 5 1.5 5 4" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  github: <><path d="M15 22v-4c.1-1-.3-2-1-2.7 3.3-.4 6.8-1.6 6.8-7.4A5.8 5.8 0 0 0 19.3 4 5.4 5.4 0 0 0 19.1.2S17.9-.2 15 1.7a13.4 13.4 0 0 0-6 0C6.1-.2 4.9.2 4.9.2A5.4 5.4 0 0 0 4.7 4a5.8 5.8 0 0 0-1.5 3.9c0 5.8 3.5 7 6.8 7.4-.6.6-1 1.4-1 2.3V22M9 19c-3 .9-3-1.5-4.2-2" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11.5V16c3 2.7 9 2.7 12 0v-4.5M22 9v6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" /></>,
  spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 21h8M9 17h6" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  monitor: <><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></>,
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const nav = ['Home', 'About', 'Skills', 'Projects', 'Certificates', 'Achievements', 'Leadership', 'Education', 'Contact']

const projects = [
  { id: '01', title: 'Water Level Management System', desc: 'An academic IoT/hardware project focused on real-time water-level monitoring and automation using sensors.', tags: ['Electronics', 'Sensor-based', 'Embedded'] },
  { id: '02', title: 'Inventory Management System', desc: 'A console-based inventory system developed in C utilizing efficient dynamic data structures and file handling.', tags: ['C', 'Data Structures', 'File I/O'] },
  { id: '03', title: 'Student Portal Management System', desc: 'A student portal management application engineered in C++ implementing core algorithmic paradigms and OOP.', tags: ['C++', 'Algorithms', 'OOP'] },
  { id: '04', title: 'Hospital Management System', desc: 'An object-oriented software system developed in Java with role-based access control and patient tracking.', tags: ['Java', 'OOP', 'Software Eng'], status: 'In Progress' },
]

function Button({ children, href, secondary = false, onClick }: { children: ReactNode; href?: string; secondary?: boolean; onClick?: () => void }) {
  const className = `button ${secondary ? 'button-secondary' : ''}`
  return href ? <a className={className} href={href} onClick={onClick}>{children}</a> : <button className={className} onClick={onClick}>{children}</button>
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <header className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</header>
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('Home')
  const [project, setProject] = useState<(typeof projects)[number] | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id[0].toUpperCase() + entry.target.id.slice(1)))
    }, { rootMargin: '-35% 0px -55%' })
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [theme])

  return (
    <div className="site-shell">
      {/* 3D Cosmic Starfield Canvas across entire page */}
      <StarsCanvas />

      {/* Primary Navigation */}
      <nav className="nav-wrap" aria-label="Primary navigation">
        <a className="logo" href="#home">
          <span>MR</span>
          <b>Moushikur Rahman</b>
        </a>
        <div className={`nav-links ${menu ? 'open' : ''}`}>
          {nav.map((item) => (
            <a
              key={item}
              className={active === item ? 'active' : ''}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenu(false)}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <Button href="#contact">Let's Connect <Icon name="arrow" size={17} /></Button>
          <button className="icon-button menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">
            <Icon name={menu ? 'x' : 'menu'} />
          </button>
        </div>
      </nav>

      <main>
        {/* HERO SECTION with Adrian Hajdin 3D Canvas & Rod */}
        <section id="home" className="hero">
          <div className="grid-pattern" />

          <div className="hero-with-rod">
            {/* Adrian Hajdin signature vertical glowing beam */}
            <div className="hero-rod" aria-hidden="true">
              <div className="hero-rod-dot" />
              <div className="hero-rod-line" />
            </div>

            <div className="hero-copy reveal">
              <div className="diu-badge-mini">
                <img src="/diu-logo.png" alt="DIU Logo" />
                <span>Daffodil International University • CSE</span>
              </div>
              <h1>Hi, I'm <span>Moushikur Rahman.</span></h1>
              <h2>Building Ideas <br />Through Code.</h2>
              <p>
                I'm a Computer Science & Engineering student at Daffodil International University, exploring 3D interactive web experiences, algorithms, and software development.
              </p>
              <div className="button-row">
                <Button href="#projects">Explore My Projects <Icon name="arrow" size={18} /></Button>
                <Button href="#contact" secondary>Get In Touch</Button>
              </div>
              <div className="social-row">
                <span>CONNECT ONLINE</span>
                <a href="https://github.com/moushik-dev" target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a>
                <a href="mailto:moushika@gmail.com" aria-label="Email"><Icon name="email" /></a>
              </div>
            </div>
          </div>

          <div className="hero-art reveal">
            <div className="portrait-photo-preview">
              <img
                src="/moushik-portrait.jpeg"
                alt="Moushikur Rahman portrait"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          </div>

          {/* Adrian Hajdin Iconic Scroll Indicator with Bouncing Dot */}
          <a className="scroll-indicator-link" href="#about" aria-label="Scroll to About section">
            <div className="scroll-indicator-pill">
              <div className="scroll-indicator-dot" />
            </div>
            <span style={{ font: '500 10px "DM Mono", monospace', letterSpacing: '0.15em', color: 'var(--muted)' }}>SCROLL</span>
          </a>
        </section>

        {/* 01 / ABOUT SECTION */}
        <section id="about" className="section about-section">
          <SectionTitle eyebrow="01 / About" title="A Little About Me" />
          <div className="about-grid">
            <div className="about-statement">
              <span>Curious mind.</span><br />
              Thoughtful code.<br />
              Constant growth.
            </div>
            <div className="about-copy">
              <p>
                I'm Moushikur Rahman, a <strong>Computer Science and Engineering student</strong> at Daffodil International University. I am driven by the passion to build clean, maintainable systems and immersive digital experiences.
              </p>
              <p>
                Through academic coursework, competitive programming challenges, and personal exploration of 3D interactive graphics, I strive to turn complex logic into practical, user-centric software.
              </p>
            </div>
          </div>
          <div className="highlights">
            {[
              ['01', 'Learning', 'Exploring algorithms, data structures, and computer science fundamentals.'],
              ['02', 'Building', 'Developing robust projects in C, C++, Java, and modern 3D web technologies.'],
              ['03', 'Growing', 'Improving problem-solving through university programming contests and open source.'],
            ].map((item) => (
              <TiltCard key={item[1]}>
                <article className="highlight-card">
                  <span>{item[0]}</span>
                  <Icon name="spark" />
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </article>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 02 / SKILLS SECTION */}
        <section id="skills" className="section skills-section">
          <SectionTitle
            eyebrow="02 / Technical Toolkit"
            title="Skills & Technologies"
            copy="Core tools and languages I’m working with while building software, problem-solving projects, and interactive web experiences."
          />

          <div className="skill-grid">
            {[
              ['C', 'Programming Language', 'C'],
              ['C++', 'Programming Language', 'C++'],
              ['Java', 'Programming Language', 'Jv'],
              ['HTML5', 'Web Technology', '<>'],
              ['CSS3', 'Web Styling', '#'],
              ['Prompt Engineering', 'AI & Workflows', 'AI'],
              ['Python', 'Programming Language', 'Py'],
              ['Git & GitHub', 'Version Control', 'Git'],
            ].map(([name, category, mark]) => (
              <article className="skill-card" key={name}>
                <div className="skill-mark">{mark}</div>
                <div>
                  <h3>{name}</h3>
                  <p>{category}</p>
                </div>
                <span>↗</span>
              </article>
            ))}
          </div>
        </section>

        {/* 03 / PROJECTS SECTION with 3D Tilt Cards */}
        <section id="projects" className="section projects-section">
          <SectionTitle
            eyebrow="03 / Selected Work"
            title="Things I've Built"
            copy="Coursework and practical systems where concepts transform into functioning software."
          />
          <div className="project-grid">
            {projects.map((item) => (
              <TiltCard key={item.title}>
                <article className="project-card">
                  <div className="project-content">
                    <div className="project-meta">
                      <span>{item.id}</span>
                      {item.status && <b>{item.status}</b>}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="tag-row">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <button className="text-link" onClick={() => setProject(item)}>
                      View Details <Icon name="arrow" size={17} />
                    </button>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 04 / CERTIFICATES */}
        <section id="certificates" className="section">
          <SectionTitle
            eyebrow="04 / Certificates"
            title="Learning & Certifications"
            copy="A growing record of focused learning and verified technical proficiency beyond the classroom."
          />
          <div className="certificate-grid">
            {[
              ['Prompt Engineering', 'Certificate details to be supplied'],
              ['C++ Course', 'CodeChef'],
            ].map(([title, issuer]) => (
              <article className="certificate-card" key={title}>
                <div className="document-preview">
                  <Icon name="graduation" size={36} />
                  <span>CERTIFICATE<br />PREVIEW</span>
                </div>
                <div>
                  <span>COURSE CERTIFICATE</span>
                  <h3>{title}</h3>
                  <p>{issuer}</p>
                  <small>Verified document placeholder</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 05 / PROGRAMMING CONTESTS & ACHIEVEMENTS */}
        <section id="achievements" className="section challenge-section">
          <SectionTitle
            eyebrow="05 / Programming Activities"
            title="Challenges That Help Me Grow"
            copy="Taking on algorithmic problems and expanding critical thinking through Daffodil International University events."
          />
          <div className="challenge-list">
            {[
              'DIU Unlock the Algorithm Programming Contest',
              'DIU Takeoff Programming Contest',
              'DIU Math Olympiad',
            ].map((title, index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div className="challenge-icon">
                  <Icon name={index === 2 ? 'trophy' : 'code'} />
                </div>
                <h3>{title}</h3>
                <p>Participated to practice algorithmic problem-solving and learn alongside talented peers at DIU.</p>
              </article>
            ))}
          </div>
        </section>

        {/* 06 / COMMUNITY & LEADERSHIP */}
        <section id="leadership" className="section">
          <div className="community-card">
            <div>
              <span className="eyebrow">06 / Community</span>
              <h2>Community &<br />Leadership</h2>
              <p>Learning alongside peers and remaining connected to the Daffodil programming community.</p>
            </div>
            <div className="community-feature">
              <div className="community-mark">
                <Icon name="community" size={40} />
              </div>
              <span>PROGRAMMING COMMUNITY</span>
              <h3>General Member — DIU Computer & Programming Club (CPC)</h3>
              <p>Actively engaged in departmental programming sessions, technical workshops, and peer collaboration.</p>
              <div className="editable-note">DIU CPC MEMBER</div>
            </div>
          </div>
        </section>

        {/* 07 / EDUCATION (Official Daffodil International University Crest) */}
        <section id="education" className="section">
          <SectionTitle eyebrow="07 / Education" title="My Education" />
          <article className="diu-education-card">
            <div className="diu-logo-container">
              <img
                src="/diu-logo.png"
                alt="Daffodil International University (DIU) Official Crest"
                className="diu-logo-img"
              />
            </div>
            <div>
              <div className="diu-badge-mini" style={{ marginBottom: '8px' }}>
                <img src="/diu-logo.png" alt="DIU mini" />
                <span>DAFFODIL INTERNATIONAL UNIVERSITY</span>
              </div>
              <h3 style={{ fontSize: '26px', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
                Bachelor of Science in Computer Science & Engineering (B.Sc. in CSE)
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px' }}>
                Faculty of Science & Information Technology • Daffodil Smart City, Ashulia, Dhaka
              </p>
              <div className="tag-row">
                <span>Undergraduate Student</span>
                <span>Algorithms & Data Structures</span>
                <span>Object Oriented Programming</span>
                <span>Active Learner</span>
              </div>
            </div>
            <Icon name="graduation" size={48} />
          </article>
        </section>

        {/* 08 / CONTACT SECTION with Adrian Hajdin 3D Earth Canvas */}
        <section id="contact" className="section contact-section">
          <div className="contact-grid-with-earth">
            <div>
              <div className="contact-intro" style={{ margin: 0, padding: 0 }}>
                <span className="eyebrow">08 / Contact</span>
                <h2>Have an Idea? <span>Let's Connect.</span></h2>
                <p>
                  I'm always interested in learning, collaborating on software projects, and connecting with fellow developers and engineers.
                </p>
              </div>
              <div className="contact-body" style={{ marginTop: '24px' }}>
                <div className="contact-links">
                  <a href="mailto:moushika@gmail.com">
                    <span><Icon name="email" /></span>
                    <div>
                      <small>START A CONVERSATION</small>
                      <b>Send me an email</b>
                      <p>moushika@gmail.com</p>
                    </div>
                    <Icon name="arrow" />
                  </a>
                  <a href="https://github.com/moushik-dev" target="_blank" rel="noreferrer">
                    <span><Icon name="github" /></span>
                    <div>
                      <small>EXPLORE MY CODE</small>
                      <b>Visit my GitHub</b>
                      <p>github.com/moushik-dev</p>
                    </div>
                    <Icon name="arrow" />
                  </a>
                </div>
                <div className="availability-note" style={{ marginTop: '20px' }}>
                  <i />
                  <span>Open to learning, collaboration, and thoughtful conversations.</span>
                </div>
              </div>
            </div>

            {/* Adrian Hajdin 3D Earth Canvas */}
            <EarthCanvas />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <a className="logo" href="#home">
            <span>MR</span>
            <b>Moushikur Rahman</b>
          </a>
          <p>CSE Student <i /> Daffodil International University</p>
        </div>
        <div className="footer-links">
          {['About', 'Skills', 'Projects', 'Education', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Moushikur Rahman. All rights reserved.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>

      {/* Project Details Modal */}
      {project && (
        <div className="modal-backdrop" onMouseDown={() => setProject(null)}>
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="icon-button modal-close" onClick={() => setProject(null)} aria-label="Close details">
              <Icon name="x" />
            </button>
            <span className="eyebrow">Project {project.id}</span>
            <h2 id="modal-title">{project.title}</h2>
            <p>{project.desc}</p>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="modal-note">Academic project details and GitHub repository links can be added as they are developed.</p>
          </div>
        </div>
      )}
    </div>
  )
}
