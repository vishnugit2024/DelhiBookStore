import React from "react";
import banner from "../../Images/DBS/BANNER10.jpg";
import aboutimage1 from "../../Images/DBS/BANNER9.jpg";
import aboutimage2 from "../../Images/DBS/BANNER14.png";
import aboutimage3 from "../../Images/DBS/BANNER8.jpg";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-700 font-sans">
      {/* Banner Section */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl group">
        <Image
          src={banner}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[300px] md:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <div className="text-white space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-medium tracking-wide">
              About DBS Imprints
            </h3>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Do You Want To Know Us?
            </h1>
            <p className="text-md md:text-lg font-light text-gray-200">
              Let us introduce the furnob to you briefly&#34; so you will have a
              better understanding of our quality.
            </p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="mt-16 space-y-2 text-lg leading-relaxed md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6">
          About DBS Imprints
        </h2>
        <hr />
        <p>
          One of India&quot;s fastest-growing book publishing companies&#34; DBS
          Imprints was founded in 2012 and has rapidly become a trusted name in
          educational and academic publishing.
        </p>
        <p>
          With a strong focus on authenticity&#34; relevance&#34; and
          quality&#34; DBS IMPRINTS publishes cutting-edge and informative books
          written and edited by renowned experts.
        </p>
        <p>
          Their mission is to deliver best-in-class production&#34; immaculate
          printing&#34; and unmatched elegance in book binding.
        </p>
        <p>
          Customer satisfaction is a top priority—whether you&quot;re a
          customer&#34; author&#34; or reader&#34; DBS strives for win-win
          outcomes that lead to greater heights.
        </p>
        <p>
          The company stays ahead by embracing new technologies and fostering
          communication with all stakeholders.
        </p>
        <p>
          DBS IMPRINTS is proudly associated with DELHI BOOK STORE – the largest
          bookstore in Asia&#34; offering access to a vast and diverse
          readership.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mt-16 text-center px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          A Vision for a Comprehensive Publishing Experience
        </h2>
        <hr />
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
          DBS ventured into publishing with a clear vision to serve the nation
          through world-class academic books. Their focus includes producing
          handbooks across a broad range of subjects from agriculture to hotel
          management&#34; climate change&#34; journalism&#34; and beyond.
        </p>
      </section>

      {/* Image Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {[aboutimage1, aboutimage2].map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={img}
              alt={`About image ${idx + 1}`}
              width={600}
              height={400}
              className="w-full h-[250px] md:h-[300px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <section className="mt-15 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <hr />
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
          Proudly embarked on a journey of publishing that brings an increasing
          number of outstanding titles to the world every year.
        </p>
      </section>

      {/* Mission Details */}
      <section className="mt-2 text-lg text-gray-700 leading-relaxed md:px-6">
        <p>
          We publish high-quality handbooks on all academic subjects at
          reasonable prices. Our initiative &quot;Make in India&quot; is
          reflected through our imprint &quot;DBS Imprints&quot;.
        </p>
        <p>
          Our mission envisions a new&#34; enlightened world dedicated to
          reshaping education — with a core message: &quot;Read&#34; Lead&#34;
          Succeed.&quot;
        </p>
        <p>
          Handbooks are priced affordably with a goal to bring 500 new handbooks
          to market soon.
        </p>
      </section>

      {/* Topics Covered */}
      <section className="mt-16 flex flex-col md:flex-row gap-10 px-4 md:px-0">
        <div className="w-full md:w-1/2">
          <Image
            src={aboutimage3}
            alt="Academic Books"
            width={700}
            height={700}
            className="rounded-xl shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-5 text-lg leading-relaxed">
          <p className="font-medium">
            Topics we cover include but are not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Agriculture</li>
            <li>Science</li>
            <li>Higher Education</li>
            <li>Hotel Management</li>
            <li>Journalism</li>
            <li>Global Warming</li>
            <li>Climate Change</li>
            <li>Agriculture Technology</li>
            <li>Chemistry&#34; Covid-19</li>
            <li>Science & Information Technology</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
