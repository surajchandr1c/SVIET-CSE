"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    asmission_no: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Message sent successfully");
      setForm({ name: "", asmission_no: "", email: "", message: "" });
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <section className="mx-auto my-16 max-w-[1280px] px-6">
      <h1 className="mb-4 text-center text-4xl font-bold text-slate-200 md:text-5xl">
        Contact Us
      </h1>

      <p className="mb-14 text-center text-lg text-slate-300 md:text-2xl">
        Feel free to reach out to us for admissions, academic queries, or
        general information.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="rounded-3xl border border-cyan-400/20 bg-[#0b1c47]/75 p-10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 mt-2 text-3xl font-semibold text-slate-200">College Address</h2>
          <p className="text-lg leading-8 text-slate-300">
            Swami Vivekanand Group of Engineering and Technology <br />
            Near XYZ Road, ABC Area <br />
            Himachal Pradesh, India
          </p>

          <h2 className="mb-3 mt-8 text-3xl font-semibold text-slate-200">Phone</h2>
          <p className="text-lg text-slate-300">+91 9XXXXXXXXX</p>

          <h2 className="mb-3 mt-8 text-3xl font-semibold text-slate-200">Email</h2>
          <p className="text-lg text-slate-300">info@svget.edu.in</p>

          <h2 className="mb-3 mt-8 text-3xl font-semibold text-slate-200">Office Hours</h2>
          <p className="text-lg text-slate-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-[#0b1c47]/75 p-10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <h2 className="mb-6 text-3xl font-semibold text-slate-200">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-xl border border-cyan-300/25 bg-[#071433] p-4 text-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/55"
            />

            <input
              type="text"
              name="asmission_no"
              placeholder="Admission Number"
              value={form.asmission_no}
              onChange={handleChange}
              required
              className="rounded-xl border border-cyan-300/25 bg-[#071433] p-4 text-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/55"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="rounded-xl border border-cyan-300/25 bg-[#071433] p-4 text-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/55"
            />

            <textarea
              rows={5}
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="rounded-xl border border-cyan-300/25 bg-[#071433] p-4 text-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/55"
            />

            <button
              type="submit"
              className="cursor-pointer rounded-xl border border-cyan-300/45 bg-[#155a80] py-4 text-lg font-semibold text-white transition hover:bg-[#1a6a95]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
