import { Link } from 'react-router-dom';
import { Camera, Lightbulb, SearchCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Turn Product Photos Into <span className="text-blue-800">SEO-Optimized</span> Descriptions
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Save hours writing product descriptions. Our AI analyzes your photos and creates engaging, SEO-friendly content that sells.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary px-8 py-3 text-base">
                  {user ? "Go to Dashboard" : "Start for Free"}
                </Link>
                <Link to="/premium" className="btn btn-outline px-8 py-3 text-base">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-800 rounded-3xl rotate-3 opacity-5"></div>
                <img 
                  src="https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Product Photography" 
                  className="rounded-2xl shadow-lg relative z-10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes it easy to create compelling product descriptions in just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-hover text-center p-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Photo</h3>
              <p className="text-gray-600">
                Simply upload your product photo. We support common image formats like JPEG, PNG, and GIF.
              </p>
            </div>

            <div className="card card-hover text-center p-8">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI identifies your product features, benefits, and key selling points from the image.
              </p>
            </div>

            <div className="card card-hover text-center p-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchCheck className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get SEO Content</h3>
              <p className="text-gray-600">
                Receive professionally written, SEO-optimized product descriptions ready to use on your store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <blockquote className="text-xl italic text-gray-700 mb-8">
              "SEO Snap has been a game-changer for my Etsy store. I used to spend hours writing descriptions for store. Now I just upload a photo and get beautiful, SEO-friendly descriptions in seconds!"
            </blockquote>
            <div className="flex items-center justify-center">
              <img 
                src="/photo_2025-06-17_19-42-46.jpg" 
                alt="William McAuley" 
                className="w-12 h-12 rounded-full object-cover mr-4"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900">William McAuley</p>
                <p className="text-sm text-gray-600">Etsy Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to save time and boost sales?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of e-commerce sellers using SEO Snap to create better product listings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={user ? "/dashboard" : "/register"} className="btn bg-white text-blue-800 hover:bg-blue-50 px-8 py-3 text-base font-medium">
              {user ? "Go to Dashboard" : "Start Your Free Trial"}
            </Link>
            <Link to="/premium" className="btn bg-blue-700 text-white hover:bg-blue-600 px-8 py-3 text-base font-medium">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;