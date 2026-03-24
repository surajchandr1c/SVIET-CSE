"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import AboutTabsClient, { type AboutTabKey } from "./AboutTabsClient";

export default function AboutPageClient() {
  const [active, setActive] = useState<AboutTabKey>("about");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    asmission_no: "",
    email: "",
    message: "",
  });

  const visionItems = [
    {
      title: "Pursuing Excellence",
      desc: "Create a world-class educational institution that nurtures talent and fosters a culture of excellence.",
    },
    {
      title: "Building Leaders",
      desc: "Develop graduates into leaders and innovators who make a positive impact on the world.",
    },
    {
      title: "Global Impact",
      desc: "Collaborate with partners worldwide to address pressing challenges with meaningful impact.",
    },
    {
      title: "Sustainable Future",
      desc: "Integrate environmental responsibility into everything we do for a sustainable tomorrow.",
    },
  ];

  const missionItems = [
    {
      title: "Empowering Students",
      desc: "Inspire and empower students to reach academic excellence and personal growth.",
    },
    {
      title: "Driving Positive Change",
      desc: "Foster innovation and leadership to be a catalyst for positive change in society.",
    },
    {
      title: "Fostering Community Engagement",
      desc: "Encourage students to become active participants in building a better world.",
    },
    {
      title: "Promoting Diversity and Inclusion",
      desc: "Ensure every student feels valued and respected through diversity and inclusion.",
    },
  ];

  const whyChooseItems = [
    "Well-qualified and experienced faculty members",
    "Modern laboratories and computing facilities",
    "Industry-relevant curriculum",
    "Focus on practical learning and projects",
    "Supportive academic environment",
  ];

  const aboutImages = [
    "/about/WhatsApp Image 2025-07-01 at 12.32.12 AM (1).jpeg",
    "/about/WhatsApp Image 2025-07-01 at 12.32.13 AM.jpeg",
  ];

  const developers = [
    {
      name: "Suraj Kumar",
      image: "/about/suraj.jpeg",
      portfolio: "https://surajchandr1c.vercel.app/",
    },
    {
      name: "Chhaya Kumari",
      image: "/about/chhaya.png",
      portfolio: "https://github.com/",
    },
    {
      name: "Vivek Kumar",
      image: "/about/vivek.png",
      portfolio: "https://preeminent-brioche-0fc0b8.netlify.app/",
    },
  ];

  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_420px_at_15%_10%,rgba(11,60,93,0.12),transparent_60%),radial-gradient(700px_420px_at_90%_15%,rgba(250,204,21,0.12),transparent_55%)]" />
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl bg-white/80 p-6 shadow-[0_18px_70px_rgba(2,6,23,0.14)] ring-1 ring-black/5 backdrop-blur md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.45em] text-slate-500">
              SVIET • CSE
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0b3c5d] sm:text-4xl">
              About
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
              Learn more about the institute, the department, and the team
              behind this website.
            </p>
          </div>

          <AboutTabsClient value={active} onChange={setActive} />

        {active === "about" ? (
          <>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-base leading-8 text-gray-700">
                  <span className="font-semibold text-slate-900">
                    Swami Vivekanand Group of Engineering and Technology
                  </span>{" "}
                  was founded under the Shri Raghunath Rai Memorial Educational
                  and Charitable Trust on September 29, 2003. The journey began
                  with the establishment of Swami Vivekanand Institute of
                  Engineering and Technology (SVIET) in 2004.
                </p>

                <p className="mt-5 text-base leading-8 text-gray-700">
                  The institute offers undergraduate programs in engineering and
                  technology with a focus on innovation, research, and
                  industry-oriented learning. The curriculum is designed in
                  alignment with university guidelines and modern technological
                  advancements.
                </p>

                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3c5d] text-sm font-bold text-white">
                      V
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      Our Vision
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visionItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl bg-slate-50 p-5 ring-1 ring-black/5"
                      >
                        <p className="text-base font-bold text-[#0b3c5d]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-slate-900">
                      M
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      Our Mission
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {missionItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm"
                      >
                        <p className="text-base font-bold text-[#0b3c5d]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-black/5">
                  <div className="grid gap-4 p-4">
                    {aboutImages.map((src, index) => (
                      <div
                        key={src}
                        className="group relative overflow-hidden rounded-2xl"
                      >
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={encodeURI(src)}
                            alt={
                              index === 0
                                ? "SVIET campus and activities"
                                : "SVIET college building and campus"
                            }
                            fill
                            sizes="(max-width: 1024px) 100vw, 420px"
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/5 px-5 py-4">
                    <p className="text-center text-xs font-semibold tracking-wide text-slate-500">
                      GLIMPSES FROM CAMPUS
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-[#0b3c5d] p-6 text-white shadow-[0_18px_60px_rgba(11,60,93,0.22)]">
                  <p className="text-xs font-semibold tracking-[0.35em] text-white/70">
                    WHY CHOOSE US
                  </p>
                  <ul className="mt-4 space-y-3 text-[15px] text-white/90">
                    {whyChooseItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {active === "department" ? (
          <>
            <div className="mt-6 overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-black/5">
              <div className="relative aspect-[16/7]">
                <Image
                  src={encodeURI(
                    "/about/WhatsApp Image 2026-03-12 at 12.39.21 PM (1).jpeg"
                  )}
                  alt="CSE Department"
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3c5d] text-sm font-bold text-white">
                    C
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Computer Science & Engineering (CSE)
                  </h2>
                </div>

                <p className="mt-4 text-base leading-8 text-gray-700">
              The Department of Computer Science and Engineering is dedicated to
              providing quality education, research, and innovation in the field
              of computing and technology. It focuses on building strong
              foundations in programming, software development, data management,
              networking, and emerging areas such as AI/ML and cloud computing.
            </p>
                <p className="mt-4 text-base leading-8 text-gray-700">
              The department also organizes workshops, seminars, hackathons, and
              industry collaborations to foster real-world problem solving and
              innovation, preparing students for careers in software
              development, data science, cybersecurity, and related domains.
            </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold tracking-[0.35em] text-slate-500">
                  FOCUS AREAS
                </p>
                <div className="mt-5 grid gap-3">
                  {[
                    "Programming & Software Engineering",
                    "Data Structures, Algorithms & Problem Solving",
                    "AI/ML, Data Science & Cloud Computing",
                    "Computer Networks & Cybersecurity",
                    "Industry projects, workshops & hackathons",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5"
                    >
                      <p className="text-base font-semibold text-[#0b3c5d]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {active === "developer" ? (
          <>
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-[0.35em] text-slate-500">
                TEAM PROFILES
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {developers.map((dev) => (
                  <div
                    key={dev.name}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-slate-50">
                      <Image
                        src={encodeURI(dev.image)}
                        alt={dev.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <p className="text-lg font-bold text-[#0b3c5d]">
                        {dev.name}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <a
                          href={dev.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-800 shadow-sm transition hover:bg-slate-50"
                          aria-label={`Open portfolio: ${dev.name}`}
                          title="Portfolio"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <a
                          href={dev.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
                        >
                          View More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-[#0b3c5d] p-7 text-white shadow-[0_18px_60px_rgba(11,60,93,0.22)]">
                <p className="text-xs font-semibold tracking-[0.35em] text-white/70">
                  DEVELOPERS
                </p>
                <h2 className="mt-3 text-xl font-bold">Website Team</h2>
                <p className="mt-3 text-base leading-7 text-white/85">
                  This website is maintained by the department team. If you have
                  suggestions or find an issue, share feedback with the admin
                  team.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold tracking-[0.35em] text-slate-500">
                  OPEN SOURCE
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  GitHub Repository
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Source code, issues, and improvements are tracked publicly.
                </p>
                <a
                  href="https://github.com/surajchandr1c/SVIET-CSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-semibold tracking-[0.35em] text-slate-500">
                FEEDBACK
              </p>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Send us your feedback
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Share suggestions, report issues, or request new features for the
                website.
              </p>

              <form
                className="mt-6 grid gap-4 md:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFeedbackLoading(true);
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(feedbackForm),
                    });

                    const data = await res.json().catch(() => null);
                    if (!data?.success) {
                      throw new Error("Something went wrong");
                    }

                    alert("Feedback sent successfully");
                    setFeedbackForm({
                      name: "",
                      asmission_no: "",
                      email: "",
                      message: "",
                    });
                  } catch (error) {
                    alert(
                      error instanceof Error
                        ? error.message
                        : "Something went wrong"
                    );
                  } finally {
                    setFeedbackLoading(false);
                  }
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={feedbackForm.name}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]/30 md:col-span-1"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={feedbackForm.email}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]/30 md:col-span-1"
                />

                <input
                  type="text"
                  name="asmission_no"
                  placeholder="Role / Class / Admission No (optional)"
                  value={feedbackForm.asmission_no}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      asmission_no: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]/30 md:col-span-2"
                />

                <textarea
                  name="message"
                  placeholder="Write your feedback..."
                  value={feedbackForm.message}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]/30 md:col-span-2"
                />

                <div className="flex items-center justify-end md:col-span-2">
                  <button
                    type="submit"
                    disabled={feedbackLoading}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#0b3c5d] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#0a3553] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {feedbackLoading ? "Sending..." : "Submit Feedback"}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : null}
        </div>
      </div>
    </section>
  );
}
