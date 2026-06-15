import Link from "next/link";
import StudentLoginForm from "./StudentLoginForm";

export const metadata = {
  title: "Student Login",
};

export default function StudentLoginPage() {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 pt-16 pb-12">
      <div className="grid min-h-[calc(100vh-240px)] items-center gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.42em] text-[#1e56d8]">
            STUDENT ACCESS
          </p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight text-[#191d25] sm:text-4xl">
            Login to your student portal
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#485c73] lg:max-w-none">
            Sign in to manage your profile and access student features.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#08b8a8]"
            >
              Back to Home <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center bg-transparent p-0 lg:justify-end">
          <StudentLoginForm />
        </div>
      </div>
    </section>
  );
}
