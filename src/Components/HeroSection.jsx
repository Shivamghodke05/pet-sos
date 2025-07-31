import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import SosForm from "./SOSForm";
import ReportsFeed from "./ReportsFeed";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
          photo: currentUser.photoURL,
        });
        console.log("✅ User logged in:", currentUser.displayName);
      } else {
        setUser(null);
        console.log("✅ No user logged in");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photo: user.photoURL,
      };

      console.log("✅ User authenticated:", userData);

      const response = await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.error || "Failed to save user in database"
        );
      }

      console.log("✅ User saved to DB:", responseData);
      alert("Login successful!");
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  // Navigation links, conditionally include "Reports" if user is logged in
  const navLinks = ["home", "services", "aboutus", "gallery"];
  if (user) {
    navLinks.push("reports");
  }
  navLinks.push("contactUs");

  return (
    <>
      <SosForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* nav bar section */}
      <nav className="flex flex-wrap items-center justify-between p-3 bg-[#e8e8e5]">
        <div className="font-medium text-xl">
          <h1>
            PET <span className="text-red-600 font-bold">SOS</span>
          </h1>
        </div>
        <div className="flex md:hidden">
          <button id="hamburger">
            <img
              className="toggle block"
              src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
              width={40}
              height={40}
            />
            <img
              className="toggle hidden"
              src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
              width={40}
              height={40}
            />
          </button>
        </div>
        <div className="toggle hidden w-full md:w-auto md:flex text-right text-bold mt-5 md:mt-0 md:border-none">
          {navLinks.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              {id.charAt(0).toUpperCase() +
                id.slice(1).replace(/([A-Z])/g, " $1")}
            </a>
          ))}
        </div>
        <div className="toggle w-full text-end hidden md:flex md:w-auto px-2 py-2 md:rounded">
          <div className="flex flex-row justify-end">
            {user ? (
              <button
                onClick={() => auth.signOut()}
                className="mr-5 px-6 shadow-lg shadow-emerald-300 btn btn-ghost inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border-2 border-emerald-300 bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="mr-5 px-6 shadow-lg shadow-emerald-300 btn btn-ghost inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border-2 border-emerald-300 bg-gray-50 sm:mt-0 sm:w-auto"
              >
                <svg
                  aria-label="Google icon"
                  className="amplify-icon w-5 h-5 mr-2"
                  viewBox="0 0 256 262"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center h-10 w-30 rounded-md bg-[#c28e3bff] text-white font-medium p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              Send <span className="text-red-700 font-bold pl-1">SOS</span>
            </button>
          </div>
        </div>
      </nav>

      {/* hero section */}
      <div className="relative w-full h-[320px]" id="home">
        <div className="absolute inset-0 opacity-70">
          <img
            src="./src/assets/cats.jpg"
            alt="Background Image"
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="absolute inset-9 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h1 className="text-grey-700 font-medium text-4xl md:text-5xl leading-tight mb-2">
              PET <span className="text-red-700 font-bold">SOS</span>
            </h1>
            <p className="font-regular text-xl mb-8 mt-4">
              Abandoned, Lost, or Hurt — <br />
              We're Their Last Hope.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#c28e3bff] text-white font-medium rounded-full hover:bg-[#c09858] transition duration-200"
            >
              Send <span className="text-red-700 font-bold pl-2">SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* reports feed - only show if user is logged in */}
      {user && <ReportsFeed />}
      {/* our services section */}
      <section className="py-10" id="services">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xxl">
              <img
                src="./src/assets/rescue.jpeg"
                alt="wheat flour grinding"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center" href="#reports">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Emergency Rescue Requests
                </h3>
                <p className="text-gray-700 text-base">
                  You can instantly report injured, lost, or abandoned animals
                  by uploading images, adding a short description, and sharing
                  their live location. Nearby volunteers or NGOs get notified in
                  real-time to take immediate action and track the case.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg overflow-hidden min-h-full transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-center text-white font-medium">
                Special product
              </div>
              <img
                src="./src/assets/chatbot.jpeg"
                alt="Coffee"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6 bg-white text-center rounded-b-lg md:min-h-full">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  🤖 AI Pet Health Assistant
                </h3>
                <p className="text-gray-700 text-base">
                  An intelligent chatbot trained to answer questions about pet
                  care, nutrition, behavior, and common health issues. Whether
                  it's "Why is my dog not eating?" or "How often should I bathe
                  my cat?"
                </p>
                <details>
                  <summary>Read More</summary>
                  <p>
                    — the AI gives fast, reliable guidance tailored to your pet
                    type. Available 24/7 for instant help, even in emergencies.
                  </p>
                </details>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src="./src/assets/vetsupport.jpeg"
                alt="Coffee"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Medical Aid & Vet Support
                </h3>
                <p className="text-gray-700 text-base">
                  Connects animals in need with nearby veterinary services.
                  Users can request treatment, donate to urgent medical cases,
                  or sponsor surgeries and long-term care through verified vet
                  listings.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src="./src/assets/petstudy.jpeg"
                alt="Coffee"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Education & Rescue Resources
                </h3>
                <p className="text-gray-700 text-base">
                  Access bite-sized guides and videos on how to handle rescues,
                  perform basic first aid, and care for pets properly. Perfect
                  for new fosters, volunteers, and compassionate individuals who
                  want to help but don't know where to start.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src="./src/assets/petfood.jpeg"
                alt="Coffee"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Pet Essentials Marketplace
                </h3>
                <p className="text-gray-700 text-base">
                  A built-in store offering affordable pet food, medicines, and
                  care supplies — especially for rescued or adopted animals.
                  Prioritizes low-cost, high-need items for fosters, shelters,
                  and pet parents on a budget.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src="./src/assets/donation.jpeg"
                alt="papad"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Donations & Sponsorships
                </h3>
                <p className="text-gray-700 text-base">
                  Support active rescue cases by donating or sponsoring food,
                  treatment, or shelter for specific animals. Each donation is
                  transparent and directly linked to an impact story, with
                  updates provided to supporters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about us */}
      <section className="bg-gray-100" id="aboutus">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                About Us
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                At PET SOS, we believe animals don’t need words to ask for help
                — their eyes, their cries, and their silence say it all. We're
                here to answer those silent SOS calls. Whether it’s a limping
                street dog, a lost kitten hiding under a car, or a pet in need
                of a home, PET SOS makes it easy for real people to step up and
                save lives. We’re blending heart with tech — using real-time
                maps, rescue alerts, adoption boards, and a volunteer system to
                connect animals in danger with the people who care enough to
                act. Anyone can make a difference here. Just a few taps, and
                you're part of a life-saving mission. And it doesn’t stop at
                rescue. Need pet food or meds but can’t break the bank? Our pet
                store has your back with affordable essentials. Got questions
                like “Why is my cat being dramatic at 3 AM?” or “Is this rash
                serious?” Our AI pet assistant is ready 24/7 with answers, not
                judgment. PET SOS isn’t just a platform — it’s a movement. A
                digital safety net for strays. A second chance factory. A
                community of everyday heroes who believe that every paw matters.
                And if you’re reading this… maybe you’re one of them. 🐾
              </p>
            </div>
            <div className="mt-12 md:mt-0">
              <img
                src="./src/assets/aboutus.jpeg"
                alt="About Us Image"
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
      {/* why us */}
      <section className="text-gray-700 body-font mt-10">
        <div className="flex justify-center text-3xl font-bold text-gray-800 text-center">
          Why Us?
        </div>
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap text-center justify-center">
            <div className="p-4 md:w-1/4 sm:w-1/2">
              <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div className="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/58/97/7C/E53960D1295621EFCB5B13F335_1623567851299.png?output-format=webp"
                    className="w-32 mb-3"
                  />
                </div>
                <h2 className="title-font font-regular text-2xl text-gray-900">
                  Real Impact
                </h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2">
              <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div className="flex justify-center">
                  <img
                    src="https://image2.jdomni.in/banner/13062021/3E/57/E8/1D6E23DD7E12571705CAC761E7_1623567977295.png?output-format=webp"
                    className="w-32 mb-3"
                  />
                </div>
                <h2 className="title-font font-regular text-2xl text-gray-900">
                  Affordable Care
                </h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2">
              <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div className="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/16/7E/7E/5A9920439E52EF309F27B43EEB_1623568010437.png?output-format=webp"
                    className="w-32 mb-3"
                  />
                </div>
                <h2 className="title-font font-regular text-2xl text-gray-900">
                  Live Tracking
                </h2>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2">
              <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div className="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/EB/99/EE/8B46027500E987A5142ECC1CE1_1623567959360.png?output-format=webp"
                    className="w-32 mb-3"
                  />
                </div>
                <h2 className="title-font font-regular text-2xl text-gray-900">
                  All-in-One Pet Solution
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* gallery */}
      <section className="text-gray-700 body-font" id="gallery">
        <div className="flex justify-center text-3xl font-bold text-gray-800 text-center py-10">
          Gallery
        </div>
        <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <div className="group relative">
            <img
              src="./src/assets/galary1.jpeg"
              alt="Image 1"
              className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
            />
          </div>
          <div className="group relative">
            <img
              src="./src/assets/galary3.jpeg"
              alt="Image 1"
              className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
            />
          </div>
          <div className="group relative">
            <img
              src="./src/assets/galary4.jpeg"
              alt="Image 1"
              className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
            />
          </div>
          <div className="group relative">
            <img
              src="./src/assets/galary5.jpeg"
              alt="Image 1"
              className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* footer */}
      <section>
        <footer className="bg-gray-200 text-white py-4 px-3">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full md:w-1/2 md:text-center md:mb-4 mb-8">
              <p className="text-xs text-gray-400 md:text-sm">
                Copyright 2024 © All Rights Reserved
              </p>
              <p className="text-xs text-gray-400 md:text-sm">
                Location data powered by{" "}
                <a href="https://www.openstreetmap.org" className="underline">
                  OpenStreetMap
                </a>
              </p>
            </div>
            <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-8">
              <ul className="list-reset flex justify-center flex-wrap text-xs md:text-sm gap-3">
                <li>
                  <a
                    href="#contactUs"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
                <li className="mx-4">
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default HeroSection;
