import Link from "next/link";
import HomeHeroClient from "./HomeHeroClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <HomeHeroClient />

      <section className="mx-auto mb-10 max-w-7xl rounded-[34px] border border-[#dbe8e5] bg-white px-6 py-10 md:px-10 md:py-14 lg:px-14">
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
              href="/batches"
              className="mt-8 inline-flex rounded-full bg-[#1f56e4] px-9 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(16,74,198,0.34)]"
            >
              Explore Batches
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[660px] rounded-[2.4rem] bg-white p-5 sm:p-7">
            <div className="rounded-[2rem] bg-[#f8fbff] p-5 sm:p-6">
              <div className="grid gap-3">
                <div className="flex gap-3">
                  <div className="h-4 w-[62%] rounded-full bg-[#59c7cf]" />
                  <div className="h-4 w-[28%] rounded-full bg-[#dbe5ef]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[14%] rounded-full bg-[#f56b6f]" />
                  <div className="h-4 w-[54%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 w-[16%] rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[38%] rounded-full bg-[#6fd1d7]" />
                  <div className="h-4 w-[24%] rounded-full bg-[#d89de0]" />
                  <div className="h-4 w-[10%] rounded-full bg-[#7dd7dd]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[10%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 w-[9%] rounded-full bg-[#72d2d8]" />
                  <div className="h-4 w-[25%] rounded-full bg-[#dbe5ef]" />
                  <div className="h-4 w-[20%] rounded-full bg-[#f56b6f]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[28%] rounded-full bg-[#d89de0]" />
                  <div className="h-4 w-[18%] rounded-full bg-[#dbe5ef]" />
                  <div className="h-4 w-[22%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[8%] rounded-full bg-[#f56b6f]" />
                  <div className="h-4 w-[17%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 w-[41%] rounded-full bg-[#5fc6cf]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[22%] rounded-full bg-[#6fd1d7]" />
                  <div className="h-4 w-[21%] rounded-full bg-[#f56b6f]" />
                  <div className="h-4 w-[18%] rounded-full bg-[#d89de0]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[8%] rounded-full bg-[#d89de0]" />
                  <div className="h-4 w-[50%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 w-[12%] rounded-full bg-[#e2e8f0]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[28%] rounded-full bg-[#d89de0]" />
                  <div className="h-4 w-[14%] rounded-full bg-[#e2e8f0]" />
                  <div className="h-4 flex-1 rounded-full bg-[#dbe5ef]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[10%] rounded-full bg-[#72d2d8]" />
                  <div className="h-4 w-[8%] rounded-full bg-[#ffc94d]" />
                  <div className="h-4 w-[24%] rounded-full bg-[#dbe5ef]" />
                  <div className="h-4 w-[8%] rounded-full bg-[#e2e8f0]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-[20%] rounded-full bg-[#f56b6f]" />
                  <div className="h-4 w-[38%] rounded-full bg-[#dbe5ef]" />
                  <div className="h-4 flex-1 rounded-full bg-[#e2e8f0]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
