import CTA_Section from "../components/home/CTA_Section";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import Navbar from "../components/home/Navbar";


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-900">
      {/* Navigation Header */}
      <Navbar/>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />
      <CTA_Section/>
    </div>
  );
};

export default Index;
