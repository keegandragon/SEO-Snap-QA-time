import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import DescriptionCard from '../components/DescriptionCard';
import { UploadedImage, ProductDescription } from '../types';
import { generateProductDescription, sendDescriptionByEmail } from '../services/aiService';
import { Sparkles, Info, AlertCircle, User } from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [descriptions, setDescriptions] = useState<ProductDescription[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationLimit, setGenerationLimit] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'account'>('generate');

  useEffect(() => {
    if (user && !user.isPremium && user.usageCount >= user.usageLimit) {
      setGenerationLimit(true);
    } else {
      setGenerationLimit(false);
    }
  }, [user]);

  const handleImageUpload = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages);
    setError(null);
  };

  const getPlanFeatures = () => {
    if (!user) return { maxTags: 5, maxWords: 150, planName: 'Free', maxImages: 1 };
    
    if (!user.isPremium) {
      return { maxTags: 5, maxWords: 150, planName: 'Free', maxImages: 1 };
    } else if (user.usageLimit === 50) {
      return { maxTags: 10, maxWords: 300, planName: 'Starter', maxImages: 2 };
    } else if (user.usageLimit === 200) {
      return { maxTags: 15, maxWords: 500, planName: 'Pro', maxImages: 10 };
    }
    
    return { maxTags: 5, maxWords: 150, planName: 'Free', maxImages: 1 };
  };

  const getPlanType = (): 'free' | 'starter' | 'pro' => {
    if (!user || !user.isPremium) return 'free';
    if (user.usageLimit === 50) return 'starter';
    if (user.usageLimit === 200) return 'pro';
    return 'free';
  };

  const handleGenerateDescription = async () => {
    if (!user) return;
    
    if (!user.isPremium && user.usageCount >= user.usageLimit) {
      setError("You've reached your monthly usage limit.");
      return;
    }
    
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const completedImages = images.filter(img => img.status === 'complete');
    if (completedImages.length !== images.length) {
      setError("Please wait for all images to finish uploading.");
      return;
    }
    
    setError(null);
    setGenerating(true);
    
    try {
      const image = images[0];
      const description = await generateProductDescription(
        image.file,
        image.preview,
        user.id,
        user.usageLimit,
        user.isPremium
      );
      
      setDescriptions(prev => [description, ...prev]);
      setImages([]);
      
      // Update user usage count
      setUser({
        ...user,
        usageCount: user.usageCount + 1
      });
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : "Failed to generate description");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendEmail = async (email: string, description: ProductDescription) => {
    try {
      return await sendDescriptionByEmail(email, description);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
      return false;
    }
  };

  if (!user) return null;

  const planFeatures = getPlanFeatures();

  const getCurrentPlanName = () => {
    if (!user.isPremium) return 'Free Plan';
    if (user.usageLimit === 50) return 'Starter Plan';
    if (user.usageLimit === 200) return 'Pro Plan';
    return 'Free Plan';
  };

  const canGenerate = images.length > 0 && 
                     images.every(img => img.status === 'complete') && 
                     !generating && 
                     (!(!user.isPremium && generationLimit));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="h-4 w-4 inline mr-1" />
                Generate
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'account'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="h-4 w-4 inline mr-1" />
                Account
              </button>
            </div>

            {activeTab === 'generate' ? (
              <>
                {/* Usage Indicator */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Description Generations</h3>
                    <span className="text-sm text-blue-800">{getCurrentPlanName()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="h-2.5 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.min((user.usageCount / user.usageLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">
                      {user.usageCount} of {user.usageLimit} used
                    </span>
                    <span className="text-gray-600">
                      {Math.max(user.usageLimit - user.usageCount, 0)} remaining
                    </span>
                  </div>
                </div>
                
                {!user.isPremium && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Need more descriptions?</h3>
                    <Link to="/plans" className="btn btn-outline w-full">
                      Upgrade Plan
                    </Link>
                  </div>
                )}
              </>
            ) : (
              /* Account Management Section */
              <div className="space-y-6">
                {/* Current Plan */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Current Plan</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{getCurrentPlanName()}</span>
                      {user.isPremium && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {user.usageLimit} generations per month</p>
                      <p>• {planFeatures.maxTags} SEO tags per product</p>
                      <p>• Up to {planFeatures.maxWords} words per description</p>
                      <p>• {planFeatures.maxImages} image{planFeatures.maxImages > 1 ? 's' : ''} per batch</p>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-3">
                  <Link 
                    to="/plans" 
                    className="btn btn-outline w-full flex items-center justify-center"
                  >
                    {user.isPremium ? 'Manage Subscription' : 'Upgrade Plan'}
                  </Link>
                </div>

                {/* Account Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Account Statistics</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Member since</span>
                      <span className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total generations</span>
                      <span className="text-gray-900">{user.usageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current plan</span>
                      <span className="text-gray-900">{getCurrentPlanName()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {activeTab === 'generate' && (
            <div className="card bg-blue-50 border-blue-100">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-800 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Your Plan Features</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• <strong>{planFeatures.planName} Plan</strong></p>
                    <p>• Up to {planFeatures.maxTags} SEO tags</p>
                    <p>• Max {planFeatures.maxWords} words</p>
                    <p>• {user.usageLimit} generations/month</p>
                    <p>• {planFeatures.maxImages} image{planFeatures.maxImages > 1 ? 's' : ''} per batch</p>
                  </div>
                  {!user.isPremium && (
                    <p className="text-sm text-gray-700 mt-2">
                      You have <span className="font-semibold">{Math.max(0, user.usageLimit - user.usageCount)}</span> free generations remaining this month.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'generate' ? (
            <>
              {/* Generation Section */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Description</h2>
                
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Error:</span>
                      <span className="text-sm ml-1">{error}</span>
                    </div>
                  </div>
                )}
                
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  className="mb-6"
                  maxImages={planFeatures.maxImages}
                  planType={getPlanType()}
                />
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleGenerateDescription}
                    disabled={!canGenerate}
                    className="btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>
                          Generate Description{images.length > 1 ? 's' : ''} ({planFeatures.planName})
                        </span>
                      </>
                    )}
                  </button>
                </div>
                
                {!user.isPremium && generationLimit && (
                  <div className="mt-4">
                    <p className="text-sm text-red-600 mb-2">
                      You've reached your monthly limit. Please upgrade your plan for more generations.
                    </p>
                    <Link to="/plans" className="btn btn-primary w-full sm:w-auto">
                      Upgrade Now
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Generated Descriptions */}
              {descriptions.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Descriptions ({descriptions.length})</h2>
                  
                  {descriptions.map(description => (
                    <DescriptionCard 
                      key={description.id}
                      description={description}
                      onSendEmail={handleSendEmail}
                    />
                  ))}
                </div>
              )}
              
              {descriptions.length === 0 && !generating && (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No descriptions yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Upload {planFeatures.maxImages > 1 ? `up to ${planFeatures.maxImages} product photos` : 'a product photo'} and click "Generate Description{planFeatures.maxImages > 1 ? 's' : ''}" to create your first AI-powered, SEO-optimized product description{planFeatures.maxImages > 1 ? 's' : ''} with {planFeatures.planName} plan features.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Account Management Content */
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                {/* Profile Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          disabled
                          className="input bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="input bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Contact support to update your profile information.
                    </p>
                  </div>

                  {/* Plan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{getCurrentPlanName()}</h4>
                          <p className="text-sm text-gray-600">
                            {user.isPremium ? 'Premium subscription' : 'Free plan'}
                          </p>
                        </div>
                        {user.isPremium && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{user.usageLimit}</p>
                          <p className="text-xs text-gray-600">Monthly Limit</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{user.usageCount}</p>
                          <p className="text-xs text-gray-600">Used This Month</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{planFeatures.maxTags}</p>
                          <p className="text-xs text-gray-600">SEO Tags</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{planFeatures.maxWords}</p>
                          <p className="text-xs text-gray-600">Max Words</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{planFeatures.maxImages}</p>
                          <p className="text-xs text-gray-600">Images/Batch</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link 
                        to="/plans" 
                        className="btn btn-primary flex items-center justify-center"
                      >
                        {user.isPremium ? 'Change Plan' : 'Upgrade to Premium'}
                      </Link>
                      
                      <Link 
                        to="/subscription"
                        className="btn btn-outline flex items-center justify-center"
                      >
                        Subscription Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Getting Started:</strong> Upload product images to generate SEO-optimized descriptions 
                    that help your products rank better in search results.
                  </p>
                  <p>
                    <strong>Usage Limits:</strong> Your plan includes {user.usageLimit} generations per month. 
                    Upgrade to a premium plan for higher limits and additional features.
                  </p>
                  <p>
                    <strong>Support:</strong> Contact our support team at{' '}
                    <a href="mailto:support@seosnap.com" className="text-blue-800 hover:text-blue-700">
                      support@seosnap.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;