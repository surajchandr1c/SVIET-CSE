import Link from "next/link";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-[900px] px-4 pt-16 pb-12">
      <h1 className="text-3xl font-extrabold text-[#191d25]">Forgot Password</h1>
      <p className="mt-4 text-[15px] leading-7 text-[#485c73]">
        If you can’t access your account, please contact the department/admin for password reset support.
      </p>
      <div className="mt-6">
        <Link href="/login" className="text-sm font-semibold text-[#08b8a8]">
          Back to Login &rarr;
        </Link>
      </div>
    </section>
  );
}

