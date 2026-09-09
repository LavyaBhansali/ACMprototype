import React from 'react'

const BUILDING_DATA = {
  research: {
    label: 'ACM RESEARCH',
    title: 'Research',
    heroDesc: 'Exploring ideas at the intersection of computing, mathematics and technology. ACM DJSCE\'s research wing pushes the boundaries of what\'s possible.',
    cards: [
      { title: 'Machine Learning', desc: 'Deep learning, neural networks, and AI systems research with hands-on implementation.', tag: 'Active' },
      { title: 'Blockchain', desc: 'Distributed systems, smart contracts, and decentralized application research.', tag: 'Active' },
      { title: 'Quantum Computing', desc: 'Exploring quantum algorithms, error correction, and near-term quantum devices.', tag: 'Upcoming' },
      { title: 'Computer Vision', desc: 'Image recognition, object detection, and visual understanding systems.', tag: 'Active' },
      { title: 'NLP', desc: 'Natural language processing, transformers, and language model applications.', tag: 'Active' },
      { title: 'Cybersecurity', desc: 'Network security, cryptography, and ethical hacking research.', tag: 'Upcoming' },
    ],
    stats: [
      { number: '12', label: 'Research Papers' },
      { number: '45', label: 'Team Members' },
      { number: '8', label: 'Active Projects' },
      { number: '3', label: 'Collaborations' },
    ],
  },
  projects: {
    label: 'ACM PROJECTS',
    title: 'Projects',
    heroDesc: 'From concept to deployment. Our projects span web development, systems programming, AI, and beyond.',
    cards: [
      { title: 'ACM Portal', desc: 'Full-stack web platform for managing chapter activities and resources.', tag: 'Shipped' },
      { title: 'CodeJudge', desc: 'Competitive programming judge system with real-time evaluation.', tag: 'Active' },
      { title: 'SmartCampus', desc: 'IoT-based campus management system with sensor integration.', tag: 'Active' },
      { title: 'DevOps Pipeline', desc: 'Automated CI/CD infrastructure for all chapter projects.', tag: 'Active' },
      { title: 'Open Source CLI', desc: 'Command-line tools contributed to the open-source community.', tag: 'Active' },
      { title: 'AR Lab', desc: 'Augmented reality experiments and interactive visualizations.', tag: 'Upcoming' },
    ],
    stats: [
      { number: '24', label: 'Total Projects' },
      { number: '16', label: 'Shipped' },
      { number: '120+', label: 'Contributors' },
      { number: '5k', label: 'Lines of Code (k)' },
    ],
  },
  events: {
    label: 'ACM EVENTS',
    title: 'Events',
    heroDesc: 'Hackathons, workshops, talks, and competitions. Where the ACM community comes alive.',
    cards: [
      { title: 'HackDJSCE 2025', desc: 'Annual 36-hour hackathon with 500+ participants and industry mentors.', tag: 'Annual' },
      { title: 'TechTalks', desc: 'Weekly speaker series featuring industry professionals and researchers.', tag: 'Weekly' },
      { title: 'CodeSprint', desc: 'Competitive programming contest with algorithmic challenges.', tag: 'Monthly' },
      { title: 'Workshop Series', desc: 'Hands-on technical workshops on cutting-edge technologies.', tag: 'Bi-weekly' },
      { title: 'Industry Connect', desc: 'Networking events with tech companies and startups.', tag: 'Quarterly' },
      { title: 'Open Source Day', desc: 'Collaborative coding sessions contributing to open-source projects.', tag: 'Monthly' },
    ],
    stats: [
      { number: '48', label: 'Events/Year' },
      { number: '2k+', label: 'Attendees' },
      { number: '30+', label: 'Speakers' },
      { number: '15', label: 'Partners' },
    ],
  },
  tech: {
    label: 'ACM TECH',
    title: 'Technology & Workshops',
    heroDesc: 'Master the latest technologies through structured learning paths and hands-on workshops.',
    cards: [
      { title: 'Web Development', desc: 'React, Next.js, Node.js — full-stack web development track.', tag: 'Track' },
      { title: 'Cloud & DevOps', desc: 'AWS, Docker, Kubernetes — cloud-native development.', tag: 'Track' },
      { title: 'AI/ML Bootcamp', desc: 'Intensive machine learning and deep learning program.', tag: 'Bootcamp' },
      { title: 'Mobile Dev', desc: 'React Native and Flutter cross-platform mobile development.', tag: 'Track' },
      { title: 'Systems Programming', desc: 'Low-level programming, OS concepts, and Rust.', tag: 'Track' },
      { title: 'Design Systems', desc: 'UI/UX design principles and component library development.', tag: 'Workshop' },
    ],
    stats: [
      { number: '6', label: 'Learning Tracks' },
      { number: '200+', label: 'Students Trained' },
      { number: '50+', label: 'Workshops' },
      { number: '12', label: 'Certifications' },
    ],
  },
  community: {
    label: 'ACM COMMUNITY',
    title: 'Community',
    heroDesc: 'A network of curious minds. Connect, collaborate, and grow together.',
    cards: [
      { title: 'Mentorship Program', desc: 'Senior students guide juniors through their technical journey.', tag: 'Active' },
      { title: 'Study Groups', desc: 'Collaborative learning sessions on CS fundamentals and interview prep.', tag: 'Weekly' },
      { title: 'Alumni Network', desc: 'Stay connected with ACM DJSCE alumni across the industry.', tag: 'Growing' },
      { title: 'Discord Community', desc: '500+ active members discussing tech, projects, and opportunities.', tag: 'Active' },
      { title: 'Blog & Publications', desc: 'Student-written technical blogs and research publications.', tag: 'Monthly' },
      { title: 'Social Events', desc: 'Game nights, movie screenings, and team bonding activities.', tag: 'Regular' },
    ],
    stats: [
      { number: '500+', label: 'Active Members' },
      { number: '50', label: 'Mentors' },
      { number: '200+', label: 'Alumni' },
      { number: '4', label: 'Years Active' },
    ],
  },
  about: {
    label: 'ABOUT ACM DJSCE',
    title: 'About ACM',
    heroDesc: 'ACM — DJ Sanghvi College of Engineering is a student chapter of the Association for Computing Machinery. We foster a culture of technical excellence, innovation, and community.',
    cards: [
      { title: 'Our Mission', desc: 'To inspire and enable the next generation of computing professionals through education, research, and community.', tag: 'Mission' },
      { title: 'Our Vision', desc: 'Building a vibrant ecosystem where students can explore, learn, and contribute to the world of computing.', tag: 'Vision' },
      { title: 'Leadership', desc: 'Student-led organization with elected executive committee and department heads.', tag: 'Team' },
      { title: 'History', desc: 'Founded in 2020, growing from 30 to 500+ members in four years.', tag: 'Story' },
      { title: 'Achievements', desc: 'Multiple national-level hackathon wins, published papers, and industry recognition.', tag: 'Impact' },
      { title: 'Join Us', desc: 'Open to all students passionate about computing and technology.', tag: 'Join' },
    ],
    stats: [
      { number: '500+', label: 'Members' },
      { number: '6', label: 'Departments' },
      { number: '24', label: 'Core Team' },
      { number: '2020', label: 'Founded' },
    ],
  },
}

const NAV_LINKS = ['Research', 'Projects', 'Events', 'Tech', 'Community', 'About']

export default function WebsitePage({ buildingId, onBack }) {
  const data = BUILDING_DATA[buildingId] || BUILDING_DATA.about

  return (
    <div className="website-overlay">
      {/* Navigation */}
      <nav className="website-nav">
        <div className="website-nav__brand">ACM DJSCE</div>
        <ul className="website-nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a className="website-nav__link">{link}</a>
            </li>
          ))}
        </ul>
        <button className="website-nav__back" onClick={onBack}>
          ← Return to Journey
        </button>
      </nav>

      {/* Hero */}
      <section className="website-hero">
        <div className="website-hero__label">{data.label}</div>
        <h1 className="website-hero__title">{data.title}</h1>
        <p className="website-hero__desc">{data.heroDesc}</p>
      </section>

      {/* Stats */}
      <div className="website-content">
        <div className="website-stats">
          {data.stats.map((stat, i) => (
            <div key={i} className="website-stat">
              <div className="website-stat__number">{stat.number}</div>
              <div className="website-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="website-section-label">OVERVIEW</div>
        <div className="website-cards">
          {data.cards.map((card, i) => (
            <div key={i} className="website-card">
              <div className="website-card__title">{card.title}</div>
              <div className="website-card__desc">{card.desc}</div>
              <div className="website-card__tag">{card.tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="website-footer">
        ACM — DJ Sanghvi College of Engineering © 2025. All rights reserved.
      </footer>
    </div>
  )
}
