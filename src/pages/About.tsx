import { Link } from 'react-router-dom';
import { Camera, Users, Target, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About SEO Snap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing e-commerce content creation with AI-powered product descriptions 
            that help businesses sell more and rank higher in search results.
          </p>
        </div>

        {/* Mission Section */}
        <div className="card mb-12">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="h-8 w-8 text-blue-800" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To empower e-commerce businesses of all sizes with professional-grade product descriptions 
                that drive sales and improve search engine visibility. We believe that every product deserves 
                compelling copy that tells its story and connects with customers.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                SEO Snap was born from a simple observation: most e-commerce businesses struggle 
                with creating compelling product descriptions that both engage customers and rank 
                well in search engines.
              </p>
              <p>
                Our founders, experienced in both e-commerce and AI technology, recognized that 
                artificial intelligence could solve this problem at scale. By analyzing thousands 
                of successful product listings, we trained our AI to understand what makes 
                descriptions effective.
              </p>
              <p>
                Today, SEO Snap helps thousands of businesses create professional product content 
                in seconds, not hours. From small Etsy shops to large online retailers, our 
                platform democratizes access to high-quality copywriting.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Team working on AI technology" 
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Every feature we build starts with understanding our customers' needs and challenges.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Excellence</h3>
              <p className="text-gray-600">
                We're committed to delivering the highest quality AI-generated content in the industry.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible with AI and e-commerce technology.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-800 to-teal-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Product Descriptions?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses already using SEO Snap to create compelling, 
            SEO-optimized product descriptions that drive sales.
          </p>
          <Link to="/register" className="btn bg-white text-blue-800 hover:bg-blue-50 inline-flex items-center">
            Get Started Today
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;