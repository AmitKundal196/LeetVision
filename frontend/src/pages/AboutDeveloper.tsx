import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Globe, Briefcase, Mail, Github, Linkedin, MapPin, ExternalLink, 
  Code, Database, Cpu, Terminal, ArrowRight, Sparkles, Clock, Rocket,
  GraduationCap, Code2, AppWindow, User as UserIcon
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up'|'left'|'right' }) => {
  const y = direction === 'up' ? 20 : 0;
  const x = direction === 'left' ? 20 : direction === 'right' ? -20 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const AboutDeveloper: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-12 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=AmitKundal&backgroundColor=transparent" 
                alt="Amit Kundal" 
                className="relative h-40 w-40 rounded-3xl border-2 border-white/10 bg-black/50 shadow-2xl object-cover p-2"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">Amit Kundal</h1>
                <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  Full Stack Developer
                </h2>
              </div>
              <div className="text-sm text-zinc-400 font-medium leading-relaxed">
                <p>B.Tech Information Technology Student</p>
                <p>Swami Keshvanand Institute of Technology (SKIT), Jaipur</p>
              </div>
              <p className="text-base text-zinc-300 max-w-xl italic border-l-2 border-primary pl-4">
                "Building AI-powered developer tools that help programmers improve their coding interview preparation."
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  <Download className="h-4 w-4" /> Download Resume
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition-all">
                  <Globe className="h-4 w-4" /> View Portfolio
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition-all">
                  <Briefcase className="h-4 w-4" /> Hire Me
                </motion.button>
                <motion.button onClick={() => window.location.href = 'mailto:amitkundal196@gmail.com'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition-all">
                  <Mail className="h-4 w-4" /> Contact Me
                </motion.button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 2. About Me */}
      <section>
        <FadeIn delay={0.1}>
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <UserIcon className="h-5 w-5 text-primary" /> About Me
            </h3>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-medium">
              <p>Hi, I'm <strong className="text-white">Amit Kundal</strong>.</p>
              <p>
                I'm a passionate Full Stack Developer and Information Technology student who enjoys building modern web applications and AI-powered developer tools.
              </p>
              <p>My interests include:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {['Full Stack Development', 'Data Structures & Algorithms', 'Artificial Intelligence', 'UI/UX Design', 'Backend Development'].map((interest, i) => (
                  <div key={i} className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-2 rounded-lg">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs">{interest}</span>
                  </div>
                ))}
              </div>
              <p className="pt-2 text-primary">
                My goal is to build products that solve real-world problems and help developers grow.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. Tech Stack */}
      <section>
        <FadeIn>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Cpu className="h-5 w-5 text-primary" /> Tech Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {[
              { category: 'Frontend', icon: AppWindow, skills: [{ n: 'React', p: 90 }, { n: 'TypeScript', p: 85 }, { n: 'Tailwind CSS', p: 95 }, { n: 'HTML/CSS/JS', p: 95 }] },
              { category: 'Backend', icon: Database, skills: [{ n: 'Node.js', p: 80 }, { n: 'Express.js', p: 85 }] },
              { category: 'Database', icon: Database, skills: [{ n: 'MongoDB', p: 80 }] },
              { category: 'Programming', icon: Code, skills: [{ n: 'C++', p: 90 }, { n: 'Python', p: 75 }] },
              { category: 'Tools', icon: Terminal, skills: [{ n: 'Git', p: 85 }, { n: 'GitHub', p: 90 }, { n: 'VS Code', p: 95 }, { n: 'Postman', p: 85 }] },
            ].map((group, gIdx) => (
              <motion.div 
                key={group.category}
                whileHover={{ y: -5 }}
                className={`glass-panel p-5 rounded-2xl ${gIdx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                    <group.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{group.category}</span>
                </div>
                <div className="space-y-4">
                  {group.skills.map((skill) => (
                    <div key={skill.n} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{skill.n}</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.p}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 4. Featured Projects */}
      <section>
        <FadeIn>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Briefcase className="h-5 w-5 text-primary" /> Featured Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {[
              {
                title: 'LeetVision',
                desc: 'AI-powered LeetCode Analytics Platform with dashboard, contest analytics, heatmaps, developer profiles, progress tracking, and AI insights.',
                tech: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB']
              },
              {
                title: 'Food Waste Management Platform',
                desc: 'Platform connecting food donors with NGOs to reduce food waste efficiently in local communities.',
                tech: ['React', 'Node.js', 'MongoDB']
              },
              {
                title: 'Portfolio Website',
                desc: 'Modern responsive portfolio built using React and Tailwind CSS featuring 3D elements and dark mode.',
                tech: ['React', 'Tailwind', 'Framer Motion']
              }
            ].map((project, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-transparent hover:border-t-primary transition-all duration-300"
              >
                <div>
                  <h4 className="text-base font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white transition-colors">
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 py-2 text-xs font-semibold text-primary-foreground transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </button>
                </div>
              </motion.div>
            ))}

          </div>
        </FadeIn>
      </section>

      {/* 5 & 6. Education and Experience Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Education */}
        <FadeIn delay={0.1} direction="left">
          <div className="glass-panel p-6 rounded-3xl h-full">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-primary" /> Education
            </h3>
            <div className="relative border-l-2 border-zinc-800 pl-6 ml-2 space-y-8">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-black" />
                <h4 className="text-sm font-bold text-white">B.Tech Information Technology</h4>
                <p className="text-xs text-zinc-400 font-semibold mt-1">Swami Keshvanand Institute of Technology</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Jaipur
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded">
                  <Clock className="h-3 w-3" /> Expected Graduation: 2028
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Experience */}
        <FadeIn delay={0.2} direction="right">
          <div className="glass-panel p-6 rounded-3xl h-full">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-primary" /> Experience
            </h3>
            <div className="relative border-l-2 border-zinc-800 pl-6 ml-2 space-y-8">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-black" />
                <h4 className="text-sm font-bold text-white">AICTE Internship</h4>
                <p className="text-xs text-zinc-400 font-semibold mt-1">IIIT Bhagalpur</p>
                
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-zinc-300 font-medium"><strong className="text-zinc-500">Worked on:</strong> Machine Learning & Healthcare Analytics</p>
                  <p className="text-xs text-zinc-300 font-medium"><strong className="text-zinc-500">Project:</strong> Lung Cancer Prediction</p>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-zinc-300 border border-white/10">Python</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-zinc-300 border border-white/10">Scikit-learn</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

      </section>

      {/* 7. Coding Profiles */}
      <section className="max-w-4xl mx-auto w-full">
        <FadeIn delay={0.1}>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Globe className="h-5 w-5 text-primary" /> Coding Profiles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'LeetCode', icon: Code2, color: 'text-yellow-500', link: '#' },
              { name: 'GitHub', icon: Github, color: 'text-white', link: 'https://github.com/AmitKundal196' },
              { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', link: 'https://www.linkedin.com/in/amitkundal195/' },
              { name: 'Portfolio', icon: Globe, color: 'text-primary', link: '#' },
              { name: 'Email', icon: Mail, color: 'text-zinc-300', link: 'mailto:amitkundal196@gmail.com' }
            ].map(profile => (
              <a key={profile.name} href={profile.link} target={profile.link !== '#' && !profile.link.startsWith('mailto:') ? '_blank' : undefined} rel="noopener noreferrer" className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <profile.icon className={`h-4 w-4 ${profile.color}`} />
                  <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{profile.name}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-zinc-600 group-hover:text-white transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-300" />
              </a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 9. Why I Built LeetVision */}
      <section>
        <FadeIn>
          <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-1 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="glass-panel rounded-[22px] p-8 md:p-12 text-center relative z-10">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 ring-1 ring-primary/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">Why I Built LeetVision</h3>
              <div className="max-w-2xl mx-auto space-y-6 text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
                <p>
                  "I noticed that LeetCode only provides raw statistics. It shows you what you solved, but doesn't easily show you how you're growing or what you should do next."
                </p>
                <p>
                  "I wanted to build an AI-powered dashboard that helps developers understand their strengths, weaknesses, coding patterns, interview readiness, and overall progress in a beautiful and interactive way."
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 10. Future Roadmap */}
      <section>
        <FadeIn>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-8">
            <Rocket className="h-5 w-5 text-primary" /> Future Roadmap
          </h3>
          <div className="glass-panel p-8 rounded-3xl overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[100px]" />
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: 'AI Mentor', desc: 'Real-time coding guidance.' },
                { title: 'Interview Readiness Score', desc: 'Predictive interview success metrics.' },
                { title: 'Pattern Analysis', desc: 'Deep dive into algorithmic paradigms.' },
                { title: 'Company Preparation', desc: 'Targeted sets for FAANG.' },
                { title: 'AI Weekly Report', desc: 'Automated progress summaries.' },
                { title: 'Resume Generator', desc: 'Auto-generate skills from LC data.' },
                { title: 'Contest Prediction', desc: 'Rating change AI forecasting.' },
                { title: 'AI Chat Assistant', desc: 'Ask questions about your code.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-black/60 border border-white/5 p-4 rounded-xl flex flex-col justify-between"
                >
                  <div className="space-y-1 mb-4">
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
                  </div>
                  <div className="self-start px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Coming Soon
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 11. Contact Section */}
      <section>
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Get In Touch
              </h3>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold">
                  <MapPin className="h-4 w-4 text-zinc-500" /> Jaipur, Rajasthan, India
                </div>
                <div className="flex items-center gap-3 text-xs text-[#10b981] font-semibold">
                  <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse ml-1" /> 
                  Open for Internships
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="mailto:amitkundal196@gmail.com" className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-bold text-white">Send Email</span>
                <span className="text-[10px] text-zinc-400 font-medium truncate w-full text-center px-2">amitkundal196@gmail.com</span>
              </a>
              <a href="https://github.com/AmitKundal196" target="_blank" rel="noopener noreferrer" className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Github className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-white">Visit GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/amitkundal195/" target="_blank" rel="noopener noreferrer" className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="h-5 w-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-xs font-bold text-white">Connect on LinkedIn</span>
              </a>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* 12. Footer */}
      <footer className="pt-12 border-t border-white/5 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-xs font-bold text-zinc-300">Designed & Developed by Amit Kundal</p>
          <p className="text-[10px] font-semibold text-zinc-500 mt-1">© 2026 LeetVision</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mr-2">Built with</span>
          {['React', 'TypeScript', 'Tailwind', 'Node.js', 'MongoDB', 'Express'].map(tech => (
            <span key={tech} className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-bold text-zinc-400 border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </footer>

    </div>
  );
};

export default AboutDeveloper;
