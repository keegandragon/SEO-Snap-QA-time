import React, { useState } from 'react';
import { Check, Copy, Mail, XCircle, Tag, Download } from 'lucide-react';
import { ProductDescription } from '../types';
import { exportSingleDescriptionToCSV } from '../services/csvService';
import { useAuth } from '../context/AuthContext';
import EmailForm from './EmailForm';

interface DescriptionCardProps {
  description: ProductDescription;
  onSendEmail: (email: string, description: ProductDescription) => Promise<boolean>;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ description, onSendEmail }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'seo'>('description');

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async (email: string) => {
    const success = await onSendEmail(email, description);
    if (success) {
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setShowEmailForm(false);
      }, 3000);
    }
    return success;
  };

  const handleExportCSV = () => {
    exportSingleDescriptionToCSV(description);
  };

  // Check if user has Pro plan (usage limit 200 indicates Pro)
  const isProUser = user?.isPremium && user?.usageLimit === 200;

  return (
    <div className="card card-hover animate-fade-in">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={description.imageSrc} 
              alt={description.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {description.keywords.map((keyword, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex space-x-4 mb-4 border-b">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 text-sm font-medium ${
                activeTab === 'description'
                  ? 'text-blue-800 border-b-2 border-blue-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`pb-2 text-sm font-medium ${
                activeTab === 'seo'
                  ? 'text-blue-800 border-b-2 border-blue-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              SEO Metadata
            </button>
          </div>

          {activeTab === 'description' ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{description.title}</h3>
              <div className="prose prose-sm max-w-none mb-4">
                {description.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-2">{paragraph}</p>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">SEO Title</h4>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">{description.seoMetadata.title}</p>
                  <button
                    onClick={() => handleCopyClick(description.seoMetadata.title)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Meta Description</h4>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">{description.seoMetadata.description}</p>
                  <button
                    onClick={() => handleCopyClick(description.seoMetadata.description)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">SEO Tags</h4>
                <div className="p-2 bg-gray-50 rounded-md">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {description.seoMetadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCopyClick(description.seoMetadata.tags.join(', '))}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy all tags
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              onClick={() => handleCopyClick(activeTab === 'description' ? description.text : description.seoMetadata.tags.join(', '))}
              className="btn btn-outline flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy {activeTab === 'description' ? 'Text' : 'All'}</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="btn btn-primary flex items-center space-x-1"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>

            {/* CSV Export - Pro Feature */}
            {isProUser && (
              <button 
                onClick={handleExportCSV}
                className="btn btn-secondary flex items-center space-x-1"
                title="Export to CSV (Pro Feature)"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
          
          {showEmailForm && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-slide-up">
              {emailSent ? (
                <div className="text-center py-2">
                  <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-700">Description sent successfully!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Send via Email</h4>
                    <button 
                      onClick={() => setShowEmailForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <EmailForm onSubmit={handleSendEmail} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;