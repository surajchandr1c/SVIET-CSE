"use client";

import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Cpu, GraduationCap, Plus, Sparkles, Users } from "lucide-react";

const spotlightCards = [
  {
    title: "Dual-Degree Opportunities",
    description:
      "Pursue articulation programs, participate in study tours, and engage in cultural exchange programs through a globally aware CSE environment.",
    image: "/home/IMG_0294.JPG.jpeg",
  },
  {
    title: "Industry-Led Learning",
    description:
      "Workshops, guest sessions, and live technical exposure connect classroom learning with the expectations of the software industry.",
    image: "/events/Idea-ConClave/21.jpg",
  },
  {
    title: "Student Innovation Culture",
    description:
      "Hackathons, idea conclaves, project showcases, and collaborative events create a department culture that rewards experimentation.",
    image: "/home/IMG_0306.JPG.jpeg",
  },
  {
    title: "Department Community",
    description:
      "From technical clubs to mentorship-driven activities, students build visibility, confidence, and strong peer networks across semesters.",
    image: "/events/interection/11.jpg",
  },
  {
    title: "Career-Ready Exposure",
    description:
      "Students prepare for placements, portfolios, and real-world technical roles through structured practice and consistent presentation opportunities.",
    image: "/home/IMG_0299.JPG.jpeg",
  },
  {
    title: "Research Mindset",
    description:
      "Students are encouraged to explore new ideas, build prototypes, and approach technical challenges with experimentation and rigor.",
    image: "/events/Idea-ConClave/24.jpg",
  },
  {
    title: "Workshops & Talks",
    description:
      "Frequent technical sessions and invited speakers help students stay connected to practical tools, trends, and industry workflows.",
    image: "/events/interection/7.jpg",
  },
  {
    title: "Project Showcases",
    description:
      "Department showcases turn coursework and side projects into visible, presentable work that can support portfolios and placements.",
    image: "/home/IMG_0301.JPG.jpeg",
  },
  {
    title: "Collaborative Campus Life",
    description:
      "Team-based events and peer-driven activities create a stronger learning community inside and outside the classroom.",
    image: "/home/IMG_0286.JPG.jpeg",
  },
  {
    title: "Event-Led Confidence",
    description:
      "Stage exposure, presentations, and student participation build confidence that translates directly into interviews and leadership.",
    image: "/events/Idea-ConClave/11.jpg",
  },
] as const;

function ExpandableSpotlight() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-[2.1rem] bg-[linear-gradient(180deg,#fdfefe_0%,#f6fbff_100%)] p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          {spotlightCards.map((card, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={card.title}
                layout
                role="button"
                tabIndex={0}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={[
                  "relative flex min-h-[128px] cursor-default overflow-hidden rounded-[1.6rem] text-left",
                  "focus:outline-none",
                  "md:min-h-[500px]",
                  isActive
                    ? "w-full md:flex-[5.5]"
                    : "w-full md:flex-[0.48]",
                ].join(" ")}
                transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              >
                {isActive ? (
                  <>
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,30,0.10)_0%,rgba(9,16,30,0.34)_35%,rgba(8,13,26,0.84)_100%)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-white" />
                )}

                <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <span
                      className={[
                        "inline-flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm",
                        isActive
                          ? "border border-white/18 bg-white/14 text-white"
                          : "border border-[#d7e3ee] bg-white text-[#0f172a]",
                      ].join(" ")}
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </span>
                  </div>

                  {isActive ? (
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
                          Department Spotlight
                        </p>
                        <h3 className="mt-3 max-w-lg text-[26px] font-extrabold leading-[1.06] text-white sm:text-[34px] lg:text-[42px]">
                          {card.title}
                        </h3>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-white/78 sm:text-[15px] lg:text-base">
                          {card.description}
                        </p>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                          <span className="block text-sm font-extrabold uppercase tracking-[0.35em] text-[#0f172a] md:origin-center md:-rotate-90 md:whitespace-nowrap md:text-[13px]">
                            {card.title}
                          </span>
                        </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomeHeroClient() {
  const subjects = [
    {
      title: "Computer Organization & Architecture",
      desc: "Learn processors, memory hierarchy and system performance.",
      link: "/syllabus/4thsem/Computer organization and architecture.pdf",
    },
    {
      title: "Design & Analysis of Algorithms",
      desc: "Algorithm design, complexity analysis and problem solving.",
      link: "/syllabus/4thsem/Design and Analysis of Algorithms.pdf",
    },
    {
      title: "Discrete Mathematics",
      desc: "Logic, sets, relations, graphs and mathematical foundations.",
      link: "/syllabus/4thsem/Discrete mathematics.pdf",
    },
    {
      title: "Operating System",
      desc: "Process management, memory, file systems and OS concepts.",
      link: "/syllabus/4thsem/Operating system.pdf",
    },
  ];

  const heroHighlights = [
    {
      icon: Cpu,
      title: "Web Developer",
      desc: "Become proficient in web development technologies such as HTML, CSS, JavaScript, and various frameworks like React and Angular.",
    },
    {
      icon: Users,
      title: "Network Engineer",
      desc: "Learn about network infrastructure, protocols, and security measures to design, implement, and maintain computer networks.",
    },
    {
      icon: GraduationCap,
      title: "System Administrator",
      desc: "Along with your academics in B. Tech CSE, you can also build a great career as a system administrator. It can be a very rewarding job, and a demanding one too.",
    },
  ];

  const programHighlights = [
    {
      title: "Learn by Doing",
      desc: "Hands-on learning through case studies, live labs, and guided projects.",
    },
    {
      title: "Advanced Labs",
      desc: "Practice with modern computing infrastructure and updated technical environments.",
    },
    {
      title: "Industry Ready",
      desc: "Structured exposure that helps students prepare for internships and placements.",
    },
    {
      title: "Global Exposure",
      desc: "Academic opportunities, exchange awareness, and wider learning perspectives.",
    },
    {
      title: "Industry Connections",
      desc: "Workshops, invited experts, and department activities that bridge academia and industry.",
    },
    {
      title: "Beyond Academics",
      desc: "Communication, teamwork, and technical confidence built through co-curricular engagement.",
    },
    {
      title: "Entrepreneurship Support",
      desc: "Students are encouraged to shape ideas into practical solutions and visible outcomes.",
    },
    {
      title: "Expert Learning",
      desc: "Faculty guidance and industry sessions keep the learning journey grounded and relevant.",
    },
    {
      title: "Latest Technologies",
      desc: "Explore web, cloud, data, cybersecurity, AI, and other in-demand computing domains.",
    },
  ];

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="mx-auto mt-2 w-full max-w-[1380px] px-3 pt-2 sm:mt-12 sm:px-4 md:px-6">
        <div className="home-hero-shell relative overflow-hidden rounded-[2.4rem] bg-white px-4 py-6 transition-none sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="relative flex flex-col gap-8 lg:gap-10">
            <div className="mx-auto flex w-full max-w-[90rem] flex-col items-center justify-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.28em] text-[#1e56d8]">
                <Sparkles size={14} className="text-[#1e56d8]" />
                DEPARTMENT OF CSE
              </div>

              <h1 className="mt-1 flex flex-col items-center justify-center text-balance text-center text-[30px] font-extrabold leading-[1.06] text-[#191d25] sm:text-[40px] lg:text-[56px]">
                <span className="block text-[#485c73]">B.Tech</span>
                <span className="block text-center text-[#1e56d8]">Computer Science &amp; Engineering</span>
              </h1>

              <p className="mx-auto mt-5 max-w-[90rem] text-[15px] leading-8 text-[#485c73] sm:text-[16px]">
                One of the most important components of development in the many commercial, technological, and administrative organisations is now computer science. Information gathering in computer science exposes users to a wide range of trends' capabilities. A four-year bachelor's degree programme in Computer Science & Engineering is offered by the Department of Computer Engineering at the Faculty of Engineering. The curriculum is purposefully created to give students a solid foundation in the subject, as well as analysis and in-depth knowledge. The department is outfitted with computer facilities and laboratories that enable students to be engaged on a personal level and in the real-time processing of the technological processes involved in order to expose them to in-depth.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/semester"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f56e4] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-105"
                >
                  Explore Semesters <ArrowRight size={16} className="text-white !text-white" />
                </Link>
                <Link
                  href="/batches"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f56e4] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-105"
                >
                  Student Portfolios <Users size={16} className="text-white !text-white" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {heroHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-[1.5rem] bg-white p-5 transition duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f56e4] text-white">
                      <Icon size={20} className="text-white !text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#191d25]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#5b6c82]">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <section className="rounded-[2.2rem] bg-white px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
              <div className="grid gap-5 lg:grid-cols-[0.82fr_1.6fr] lg:gap-6">
                <div className="lg:pr-4">
                  <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#1e56d8]">
                    <span className="h-[3px] w-10 rounded-full bg-[#1e56d8]" />
                    Why This Program
                  </div>
                  <h2 className="mt-4 text-[30px] font-extrabold leading-[1.02] text-[#191d25] sm:text-[40px] lg:text-[48px]">
                    Program Highlights
                  </h2>
                  <p className="mt-4 max-w-sm text-[14px] leading-7 text-[#5b6c82]">
                    Built to develop industry-ready professionals through strong academics, practical learning, and real-world exposure.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {programHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] bg-[#f8fbff] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1e56d8] text-white shadow-[0_8px_18px_rgba(30,86,216,0.18)]">
                      <Check size={17} color="white" className="text-white !text-white" />
                        </span>
                        <div>
                          <h3 className="text-[18px] font-bold leading-snug text-[#191d25]">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-[13px] leading-6 text-[#5b6c82]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <ExpandableSpotlight />

          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[1380px] px-3 sm:px-4 md:px-6">
        <div className="rounded-[2.4rem] bg-white px-6 py-4 sm:px-10 sm:py-6 lg:px-14 lg:py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-4xl font-extrabold text-[#1f56e4] md:text-5xl">60 LPA</h3>
              <p className="mt-2 text-base font-bold text-[#191d25]">Highest Package</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5b6c82]">offered to our students</p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-4xl font-extrabold text-[#1f56e4] md:text-5xl">5.8 LPA</h3>
              <p className="mt-2 text-base font-bold text-[#191d25]">Average Package</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5b6c82]">consistent year-on-year growth</p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-4xl font-extrabold text-[#1f56e4] md:text-5xl">2,200+</h3>
              <p className="mt-2 text-base font-bold text-[#191d25]">Recruiting Companies</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5b6c82]">hired SVGOI students</p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-4xl font-extrabold text-[#1f56e4] md:text-5xl">95%+</h3>
              <p className="mt-2 text-base font-bold text-[#191d25]">Placement Rate</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5b6c82]">students placed every year</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-4 py-10 sm:mt-6 sm:py-12">
        <div className="absolute inset-0 -z-10 bg-white" />

        <div className="mx-auto w-full max-w-[1380px] px-6">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4e5fb] bg-white px-4 py-2 text-xs font-semibold tracking-[0.26em] text-[#1e56d8] shadow-[0_10px_24px_rgba(30,86,216,0.07)]">
                <BookOpen size={14} className="text-white !text-white" />
                COURSES
              </div>
              <h2 className="mt-4 text-[40px] font-extrabold leading-[1.05] text-black sm:text-[52px]">
                Courses
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5b6c82]">
                Explore the core subjects that shape the department&apos;s academic structure and technical depth.
              </p>
            </div>

            <Link
              href="/semester"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f56e4] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_24px_rgba(16,74,198,0.18)] transition hover:-translate-y-0.5"
            >
              View all resources <ArrowRight size={16} className="text-white !text-white" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {subjects.map((sub, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[1.8rem] border border-[#d8e7f7] bg-white p-7 shadow-[0_18px_38px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_46px_rgba(30,86,216,0.12)]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2rem] bg-white" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f56e4] text-white shadow-[0_10px_22px_rgba(31,86,228,0.20)]">
                  <BookOpen size={20} className="text-white !text-white" />
                </div>

                <h3 className="relative mt-6 text-[20px] font-bold leading-snug text-black md:text-[22px]">
                  {sub.title}
                </h3>

                <p className="relative mt-4 text-[15px] leading-7 text-gray-700">
                  {sub.desc}
                </p>

                <a
                  href={sub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[#08b8a8] transition hover:gap-3 hover:text-[#22d3ee]"
                >
                  View syllabus <ArrowRight size={16} className="text-[#08b8a8]" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
