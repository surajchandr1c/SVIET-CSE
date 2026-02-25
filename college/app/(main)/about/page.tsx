export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto my-16 px-6">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-bold text-[#0b3c5d] mb-6">
          About the College
        </h1>

        {/* Paragraphs */}
        <p className="text-gray-700 leading-8 mb-4">
          <strong>
            Swami Vivekanand Group of Engineering and Technology
          </strong>{" "}
          was founded under the Shri Raghunath Rai Memorial Educational and Charitable Trust on September 29, 2003. The journey began with the establishment of Swami Vivekanand Institute of Engineering and Technology (SVIET) in 2004. Over the years, SVGOI expanded its horizons:
        </p>

        <p className="text-gray-700 leading-8 mb-6">
          The institute offers undergraduate programs in engineering and
          technology, focusing on innovation, research, and industry-oriented
          learning. Our curriculum is designed in alignment with university
          guidelines and modern technological advancements.
        </p>

        {/* Vision */}
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2 border-b-2 border-blue-500 w-fit pb-1">
          Our Vision
        </h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-6">
        <li>
            <h2 className="font-bold">Pursuing Excellence</h2>
            <span>Our vision is to create a world-class educational institution that nurtures talent and fosters a culture of excellence.</span>
          </li>
          <li>
            <h2 className="font-bold">Building Leaders</h2>
            <span>We envision a future where our graduates are leaders and innovators, making a positive impact on the world.</span>
          </li>
          <li>
            <h2 className="font-bold">Global Impact</h2>
            <span>Our vision includes making a global impact, collaborating with partners worldwide to address pressing challenges.</span>
          </li>
          <li>
            <h2 className="font-bold">Sustainable Future</h2>
            <span>We are committed to creating a sustainable future, integrating environmental responsibility into everything we do.</span>
          </li>
        </ul>

        {/* Mission */}
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2 border-b-2 border-blue-500 w-fit pb-1">
          Our Mission
        </h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-6">
          <li>
            <h2 className="font-bold
            ">Empowering Students</h2>
            <span>Our mission is to inspire and empower students to reach for the stars, guiding them towards academic excellence and personal growth.</span>
          </li>
          <li>
            <h2 className="font-bold
            ">Driving Positive Change</h2>
            <span>We strive to be a catalyst for positive change in society, fostering innovation and leadership among our students.</span>
          </li>
          <li>
            <h2 className="font-bold
            ">Fostering Community Engagement</h2>
            <span>We are committed to fostering community engagement, encouraging our students to become active participants in creating a better world.</span>
          </li>
          <li>
            <h2 className="font-bold">Promoting Diversity and Inclusion</h2>
            <span>Our mission includes promoting diversity and inclusion, ensuring that every student feels valued and respected.</span>
          </li>
        </ul>

        {/* Why Choose Us */}
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2 border-b-2 border-blue-500 w-fit pb-1">
          Why Choose Us?
        </h2>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Well-qualified and experienced faculty members</li>
          <li>Modern laboratories and computing facilities</li>
          <li>Industry-relevant curriculum</li>
          <li>Focus on practical learning and projects</li>
          <li>Supportive academic environment</li>
        </ul>
      </div>
    </section>
  );
}
