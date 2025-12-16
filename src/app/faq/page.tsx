'use client';

import { useState, useMemo } from 'react';
import { Search, HelpCircle, Wrench, DollarSign, FileQuestion, Info } from 'lucide-react';
import FAQAccordion from '@/components/faq/FAQAccordion';
import { faqData, faqCategories } from '@/data/faq';

const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Wrench,
  DollarSign,
  FileQuestion,
  Info,
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on category and search query
  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl">
            Find answers to common questions about our geotechnical services, testing procedures,
            pricing, and more. Can't find what you're looking for? Contact us directly.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => {
              const Icon = iconMap[category.icon] || HelpCircle;
              const isActive = activeCategory === category.id;

              // Count items in this category
              const count = category.id === 'all'
                ? faqData.length
                : faqData.filter(item => item.category === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.label}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredFAQs.length}</span>{' '}
            {filteredFAQs.length === 1 ? 'question' : 'questions'}
            {searchQuery && (
              <span>
                {' '}
                matching "<span className="font-semibold">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* FAQ Accordion */}
        <FAQAccordion items={filteredFAQs} />

        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Our team is here to help. Contact us for personalized assistance with your project.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+97715260121"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              Call +977-01-5260121
            </a>
            <a
              href="mailto:info@nsengineering.com.np"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Request Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
