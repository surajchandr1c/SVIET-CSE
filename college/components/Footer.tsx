import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/faculty", label: "Faculty" },
  { href: "/notice", label: "Notice Board" },
  { href: "/semester", label: "Semesters" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

const fourthSemLinks = [
  { href: "/semester/4thSem/timetable", label: "Time Table" },
  { href: "/semester/4thSem/syllabus", label: "Syllabus" },
  { href: "/semester/4thSem/studentsList", label: "Students List" },
  { href: "/semester/4thSem/Previous", label: "Previous 5 Year Question Paper" },
  { href: "/semester/4thSem/assignment", label: "Assignment" },
  { href: "/semester/4thSem/notes", label: "Notes" },
  { href: "/semester/4thSem/ppt", label: "PPT" },
];

const sixthSemLinks = [
  { href: "/semester/6thSem/timetable", label: "Time Table" },
  { href: "/semester/6thSem/syllabus", label: "Syllabus" },
  { href: "/semester/6thSem/studentsList", label: "Students" },
  { href: "/semester/6thSem/Previous", label: "Previous 5 Year Question Paper" },
  { href: "/semester/6thSem/assignment", label: "Assignment" },
  { href: "/semester/6thSem/notes", label: "Notes" },
  { href: "/semester/6thSem/ppt", label: "PPT" },
];

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-12 text-slate-100">
      <div className="mx-auto max-w-[1380px] rounded-3xl border border-cyan-300/45 bg-gradient-to-r from-[#124a6d] to-[#175f84] px-5 py-6 lg:px-6 lg:py-7 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <img
              src="/Logo.webp"
              alt="logo"
              className="mb-4 h-10 w-auto object-contain lg:h-10"
            />
            <p className="max-w-xs text-[16px] leading-7 text-slate-100/95 md:text-[17px] lg:text-base">
              Department of Computer Science and Engineers 
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[19px] font-semibold md:text-[21px] lg:text-[1.45rem]">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[16px] hover:text-cyan-200 md:text-[17px] lg:text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[19px] font-semibold md:text-[21px] lg:text-[1.45rem]">4th Semester</h3>
            <ul className="space-y-2">
              {fourthSemLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[16px] hover:text-cyan-200 md:text-[17px] lg:text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[19px] font-semibold md:text-[21px] lg:text-[1.45rem]">6th Semester</h3>
            <ul className="space-y-2">
              {sixthSemLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[16px] hover:text-cyan-200 md:text-[17px] lg:text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-cyan-300/25 pt-4 text-center text-[16px] text-slate-100/95 md:text-[17px] lg:text-base">
          &copy; {new Date().getFullYear()} CSE Department
        </div>
      </div>
    </footer>
  );
}
