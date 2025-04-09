import React from "react";

function Home() {
  const [isHovered, setIsHovered] = React.useState(false);
  const features = [
    "Neural text-to-speech technology",
    "Lifelike speech conversion",
    "Personal audio library",
    "60+ voices in 30+ languages"
  ];
  const benefits = [
    "SSML support",
    "Intuitive interface",
    "High-quality output",
    "Fast processing"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center px-4 animate-gradient-x">
      <div className="flex flex-col items-center max-w-5xl mx-auto pt-8">
        <div
          className="flex items-center mb-8 transform hover:scale-110 transition-all duration-500 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            className={`w-12 h-12 text-blue-600 mr-4 ${isHovered
              ? "animate-bounce"
              : "animate-pulse"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
          </svg>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-text">
            Welcome to TextTones
          </h1>
        </div>
        <p className="text-2xl md:text-3xl mt-6 text-gray-700 text-center font-light animate-fade-in">
          Transform your text into natural-sounding audio with Amazon Polly
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8 w-full">
          {[
            {
              title: "Key Features",
              items: features,
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "Benefits",
              items: benefits,
              icon:
                "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            }
          ].map((section, idx) =>
            <div
              key={idx}
              className="group space-y-4 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-50 hover:border-blue-200"
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2 group-hover:animate-spin-slow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={section.icon}
                  />
                </svg>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, index) =>
                  <p
                    key={index}
                    className="text-gray-600 flex items-center transform hover:translate-x-2 transition-all duration-300"
                  >
                    <span className="text-blue-500 mr-2 group-hover:animate-bounce">
                      →
                    </span>{" "}
                    {item}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 flex items-center">
          <svg
            className="w-5 h-5 mr-2 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Get Started
        </button>

        <div className="mt-12 mb-8 text-center">
          <p className="text-gray-600 hover:text-gray-800 transition-all duration-300">
            Ready to transform your text? Start creating natural-sounding audio
            today!
          </p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center hover:text-blue-500 transition-all duration-300">
            <svg
              className="w-4 h-4 mr-1 animate-spin-slow"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            Powered by Amazon Polly's advanced technology
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
