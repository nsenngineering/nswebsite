'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  User,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FadeIn from '@/components/animations/FadeIn';

interface FormData {
  // Step 1: Service Selection
  serviceType: string[];
  // Step 2: Project Details
  projectName: string;
  location: string;
  timeline: string;
  description: string;
  // Step 3: Contact Information
  fullName: string;
  email: string;
  phone: string;
  company: string;
}

const serviceOptions = [
  { id: 'pile-testing', label: 'Pile Testing (PDA, PIT, Static Load)' },
  { id: 'soil-lab', label: 'Soil Laboratory Testing' },
  { id: 'rock-lab', label: 'Rock Laboratory Testing' },
  { id: 'drilling', label: 'Drilling Services (up to 700m)' },
  { id: 'geophysical', label: 'Geophysical Surveys' },
  { id: 'ndt', label: 'Non-Destructive Testing (NDT)' },
];

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceType: [],
    projectName: '',
    location: '',
    timeline: '',
    description: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(serviceId)
        ? prev.serviceType.filter((id) => id !== serviceId)
        : [...prev.serviceType, serviceId],
    }));
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return formData.serviceType.length > 0;
      case 2:
        return formData.projectName && formData.location && formData.timeline;
      case 3:
        return formData.fullName && formData.email && formData.phone;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const nextStep = () => {
    if (canProceed(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <FadeIn>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quote Request Received!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for contacting NS Engineering. Our team will review your request and get back to you within 24 hours.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Our technical team reviews your requirements</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">We prepare a detailed quotation and timeline</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">You receive our proposal via email</p>
                </div>
              </div>
            </div>
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Request a Quote
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Tell us about your project and we'll provide a detailed quotation within 24 hours
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1">
            <FadeIn>
              <div className="space-y-6">
                {/* Contact Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Phone</div>
                          <div className="text-sm text-gray-600">+977-01-5260121</div>
                          <div className="text-sm text-gray-600">+977-9851228995</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Email</div>
                          <div className="text-sm text-gray-600">info@nsengineering.com.np</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Address</div>
                          <div className="text-sm text-gray-600">
                            Bishal Niwash, 4th Cross<br />
                            Jwagal, Lalitpur<br />
                            Nepal
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Business Hours</div>
                          <div className="text-sm text-gray-600">
                            Sunday - Friday: 9:00 AM - 6:00 PM<br />
                            Saturday: Closed
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ISO Badge */}
                <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                  <CardContent className="p-6">
                    <CheckCircle2 className="w-12 h-12 mb-3 opacity-80" />
                    <h3 className="text-lg font-bold mb-2">ISO 9001:2015 Certified</h3>
                    <p className="text-sm text-purple-100">
                      Quality management system certified to international standards
                    </p>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Multi-step Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            currentStep >= step
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`flex-1 h-1 mx-2 transition-all ${
                              currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                      Select Services
                    </span>
                    <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                      Project Details
                    </span>
                    <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                      Your Information
                    </span>
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        What services do you need?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Select one or more services (you can select multiple)
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceOptions.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.serviceType.includes(service.id)
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {service.label}
                              </span>
                              {formData.serviceType.includes(service.id) && (
                                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Tell us about your project
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Provide details to help us prepare an accurate quote
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., Bridge Construction - Kathmandu"
                            value={formData.projectName}
                            onChange={(e) => updateFormData('projectName', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., Lalitpur, Nepal"
                            value={formData.location}
                            onChange={(e) => updateFormData('location', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Timeline *
                          </label>
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            value={formData.timeline}
                            onChange={(e) => updateFormData('timeline', e.target.value)}
                          >
                            <option value="">Select timeline</option>
                            <option value="urgent">Urgent (Within 1 week)</option>
                            <option value="1-2weeks">1-2 weeks</option>
                            <option value="2-4weeks">2-4 weeks</option>
                            <option value="1-3months">1-3 months</option>
                            <option value="3+months">3+ months</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Description (Optional)
                          </label>
                          <Textarea
                            rows={4}
                            placeholder="Tell us more about your project, specific requirements, site conditions, etc."
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Your contact information
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We'll use this information to send you the quotation
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            type="text"
                            placeholder="Your full name"
                            value={formData.fullName}
                            onChange={(e) => updateFormData('fullName', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <Input
                            type="tel"
                            placeholder="+977-XXXXXXXXXX"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company / Organization (Optional)
                          </label>
                          <Input
                            type="text"
                            placeholder="Your company name"
                            value={formData.company}
                            onChange={(e) => updateFormData('company', e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed(currentStep)}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed(currentStep)}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Request
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
