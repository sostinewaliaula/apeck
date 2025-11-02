import { useState, useEffect } from 'react';
import { XIcon, UserIcon, MailIcon, PhoneIcon, MessageSquareIcon, BookOpenIcon } from 'lucide-react';

interface EnrollFormProps {
  isOpen: boolean;
  onClose: () => void;
  programName?: string;
  programId?: string;
}

export function EnrollForm({ isOpen, onClose, programName, programId }: EnrollFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: programName || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update program field when programName prop changes
  useEffect(() => {
    if (programName) {
      setFormData(prev => ({ ...prev, program: programName }));
    }
  }, [programName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', { ...formData, programId });
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset form after 3 seconds and close
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        program: programName || '',
        message: ''
      });
      setSubmitStatus('idle');
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          >
            <XIcon size={20} className="text-gray-600" />
          </button>

          {/* Header */}
          <div className="px-8 pt-10 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 rounded-full flex items-center justify-center">
                <BookOpenIcon size={28} className="text-[#8B2332]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#8B2332]">Enroll in Program</h2>
                <p className="text-gray-600 mt-1">Fill in your details to get started</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Submitted!</h3>
                <p className="text-gray-600">We'll contact you shortly with more information.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      <UserIcon size={16} className="inline mr-2" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MailIcon size={16} className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <PhoneIcon size={16} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>

                {/* Program Selection */}
                <div>
                  <label htmlFor="program" className="block text-sm font-semibold text-gray-700 mb-2">
                    Program of Interest *
                  </label>
                  <input
                    type="text"
                    id="program"
                    name="program"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    readOnly={!!programName}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all ${
                      programName ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Select a program"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquareIcon size={16} className="inline mr-2" />
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B2332] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your ministry background or any questions you have..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-[#8B2332] text-white rounded-xl font-semibold hover:bg-[#6B1A28] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Enrollment'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2">
                  By submitting this form, you agree to be contacted about the program. We respect your privacy.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

