"use client";

import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, type TouchEvent } from "react";
import Link from "next/link";

export default function Home() {
  const images = [
    "/home/IMG_0279.JPG.jpeg",
    "/home/IMG_0291.JPG.jpeg",
    "/home/IMG_0293.JPG.jpeg",
    "/events/Idea-ConClave/4.jpg",
    "/events/Idea-ConClave/11.jpg",
    "/events/Idea-ConClave/20.jpg",
    "/events/interection/1.jpg",
    "/events/interection/11.jpg",
    "/events/interection/8.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) {
      return;
    }

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

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

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative mt-2 w-full overflow-hidden rounded-2xl px-3 pt-2 sm:mt-3 sm:rounded-3xl sm:px-4 md:px-6">
        <div
          className="group relative h-[38vh] overflow-hidden rounded-2xl sm:h-[52vh] md:h-[62vh] lg:h-[78vh] sm:rounded-3xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                current === index
                  ? "opacity-100 scale-100"
                  : "pointer-events-none opacity-0 scale-[1.02]"
              }`}
            >
              <Image
                src={src}
                alt={`slide-${index + 1}`}
                fill
                className="rounded-2xl object-cover sm:rounded-3xl"
                priority={index === 0}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black/70 to-black/20 sm:rounded-3xl" />
            </div>
          ))}

          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-10 text-white sm:px-20">
            <h1 className="mb-0 text-[26px] font-bold sm:mb-4 sm:text-[33px] md:text-[54px] lg:text-[56px]">
              CSE Department
            </h1>
            <p className="mb-3 text-[16px] sm:mb-6 md:text-[18px] lg:text-[17px]">Learn | Code | Innovate</p>
            <button className="rounded-lg bg-sky-600 px-6 py-2 text-[14px] hover:bg-sky-700 md:text-[15px] lg:text-[14px]">
              <Link href="/gallery">Explore</Link>
            </button>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-3xl text-white transition-opacity duration-300 lg:flex lg:opacity-0 lg:group-hover:opacity-100"
          >
            &#10094;
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-3xl text-white transition-opacity duration-300 lg:flex lg:opacity-0 lg:group-hover:opacity-100"
          >
            &#10095;
          </button>

          <div className="absolute bottom-5 z-20 flex w-full justify-center gap-3">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-3 w-3 cursor-pointer rounded-full ${
                  current === index ? "bg-cyan-200" : "bg-cyan-200/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-5">
        <div>
          <h1 className="mb-4 text-[26px] font-bold text-[#0b3c5d] md:text-[33px] lg:text-[2.4rem]">
            B.Tech Computer Science & Engineering
          </h1>

          <p className="mb-4 text-[14px] text-gray-700 md:text-[15px] lg:text-[14px]">
            Department of Computer Science and Engineering is dedicated to providing quality education, research, and innovation in the field   of computing and technology. It focuses on equipping students with a strong foundation in computer. The science principles, programming, software development, data management, networking, and emerging technologies such as artificial intelligence, machine learning, and cloud computing.
<br />
<br />
In addition to academic activities, the department organizes workshops, seminars, hackathons, and industry collaborations to foster innovation and real-world problem-solving skills. With a vision to create competent professionals and researchers, the department strives to prepare students for successful careers in software development, data science, cyber security, and other advanced technology domains.
          </p>

          <p className="text-[14px] text-gray-700 md:text-[15px] lg:text-[14px]">
            We are committed to academic excellence, innovation and overall
            student development.
          </p>
        </div>
      </section>

      <section className="bg-transparent py-12">
        <h2 className="mb-8 text-center text-[28px] font-bold tracking-widest text-[#2c3e50] md:text-[30px] lg:text-[2.15rem]">
          SUBJECTS
        </h2>

        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {subjects.map((sub, index) => (
            <div
              key={index}
              className="rounded-lg border-l-4 border-blue-600 bg-white p-6 shadow transition hover:-translate-y-2 hover:shadow-lg"
            >
              <h3 className="mb-2 text-[16px] font-semibold text-[#2c3e50] md:text-[18px] lg:text-[1.2rem]">
                {sub.title}
              </h3>

              <p className="mb-4 text-[13px] text-gray-600 md:text-[14px] lg:text-[0.95rem]">{sub.desc}</p>

              <a href={sub.link} className="text-[14px] font-semibold text-blue-600 hover:underline md:text-[15px] lg:text-[14px]">
                View Syllabus {"->"}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/semester" className="text-[16px] font-semibold hover:underline md:text-[18px] lg:text-[1.2rem]">
            View more...
          </a>
        </div>
      </section>

      <section className="mx-auto mb-10 max-w-7xl rounded-[34px] border border-[#dbe8e5] bg-gradient-to-br from-[#eaf4f2] to-[#f3f7f6] px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-5 text-xs tracking-[0.42em] text-[#1e56d8] md:text-sm">STUDENT VISIBILITY & TECHNICAL GROWTH</p>
            <h2 className="max-w-xl text-[34px] font-extrabold leading-[1.12] text-[#191d25] md:text-[46px]">
              Showcase <span className="text-[#1e56d8]">Your Skills</span> to the Industry
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#485c73]">
              Highlight student projects, technical achievements and event participation to attract recruiters,
              mentors and collaborators on one professional platform.
            </p>
            <Link
              href="/techxplore"
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-9 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(8,184,168,0.34)]"
            >
              Explore TechXplore
            </Link>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[460px]">
            <div className="group absolute right-2 top-3 z-0 h-[290px] w-[230px] overflow-hidden rounded-3xl border-4 border-white shadow-xl transition duration-500 hover:z-30 hover:-translate-y-2 hover:rotate-1 sm:w-[250px]">
              <Image src="/home/IMG_0309.JPG.jpeg" alt="Technical activity" fill className="object-cover transition duration-500 group-hover:scale-110" />
            </div>
            <div className="group absolute right-10 top-12 z-10 h-[320px] w-[250px] overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition duration-500 hover:z-30 hover:-translate-y-2 hover:rotate-2 sm:w-[280px]">
              <Image src="/home/IMG_0299.JPG.jpeg" alt="Students in lab" fill className="object-cover transition duration-500 group-hover:scale-110" />
            </div>
            <div className="group absolute left-2 top-20 z-20 h-[330px] w-[255px] overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition duration-500 hover:z-30 hover:-translate-y-3 hover:-rotate-1 sm:w-[290px]">
              <Image src="/home/IMG_0306.JPG.jpeg" alt="Student presentation" fill className="object-cover transition duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
