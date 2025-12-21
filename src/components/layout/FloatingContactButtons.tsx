'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Phone, Facebook, Linkedin, Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/site-config';

// Custom TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface ContactButton {
  icon: React.ElementType;
  href: string;
  label: string;
  bgColor: string;
  hoverColor: string;
  ariaLabel: string;
}

export default function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const buttons: ContactButton[] = [
    {
      icon: Mail,
      href: `mailto:${siteConfig.contact.email}`,
      label: 'Email',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      ariaLabel: 'Send email to NS Engineering',
    },
    {
      icon: MessageCircle,
      href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20NS%20Engineering`,
      label: 'WhatsApp',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      ariaLabel: 'Chat with NS Engineering on WhatsApp',
    },
    {
      icon: Phone,
      href: `tel:${siteConfig.contact.phone}`,
      label: 'Call',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      ariaLabel: 'Call NS Engineering',
    },
    {
      icon: Facebook,
      href: siteConfig.social.facebook,
      label: 'Facebook',
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0c5ec7]',
      ariaLabel: 'Follow NS Engineering on Facebook',
    },
    {
      icon: Linkedin,
      href: siteConfig.social.linkedin,
      label: 'LinkedIn',
      bgColor: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#084d94]',
      ariaLabel: 'Connect with NS Engineering on LinkedIn',
    },
    {
      icon: Instagram,
      href: siteConfig.social.instagram,
      label: 'Instagram',
      bgColor: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      hoverColor: 'hover:opacity-90',
      ariaLabel: 'Follow NS Engineering on Instagram',
    },
    {
      icon: TikTokIcon,
      href: siteConfig.social.tiktok,
      label: 'TikTok',
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-900',
      ariaLabel: 'Follow NS Engineering on TikTok',
    },
  ];

  return (
    <>
      {/* Desktop: Hover to expand - Right Middle */}
      <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-30">
        <div
          className="group relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Tab/Binder Edge */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary-600 text-white
                        px-3 py-6 rounded-l-lg shadow-lg cursor-pointer
                        hover:bg-primary-700 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div className="text-xs font-semibold whitespace-nowrap [writing-mode:vertical-rl]">
                CONTACT US
              </div>
            </div>
          </div>

          {/* Expanded Buttons */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-16
                         bg-white rounded-l-xl shadow-2xl p-4 flex flex-col gap-3
                         border-l-4 border-primary-600"
              >
                {buttons.map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <motion.a
                      key={index}
                      href={button.href}
                      target={button.icon !== Mail && button.icon !== Phone ? '_blank' : undefined}
                      rel={button.icon !== Mail && button.icon !== Phone ? 'noopener noreferrer' : undefined}
                      className={`
                        group/btn relative flex items-center gap-3
                        ${button.bgColor} ${button.hoverColor}
                        text-white rounded-lg shadow-md hover:shadow-lg
                        transition-all duration-300
                        px-4 py-2.5
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                      `}
                      aria-label={button.ariaLabel}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">{button.label}</span>
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: Click to expand - Bottom Right */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        {/* Floating Action Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full
                   shadow-lg hover:shadow-xl transition-all duration-300
                   w-14 h-14 flex items-center justify-center
                   focus:outline-none focus:ring-4 focus:ring-primary-300"
          aria-label="Toggle contact menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Expanded Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl
                       p-4 flex flex-col gap-2 border border-gray-200 min-w-[200px]"
            >
              {/* Header */}
              <div className="text-center pb-2 border-b border-gray-200">
                <p className="text-sm font-bold text-gray-900">Contact Us</p>
              </div>

              {/* Buttons */}
              {buttons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <motion.a
                    key={index}
                    href={button.href}
                    target={button.icon !== Mail && button.icon !== Phone ? '_blank' : undefined}
                    rel={button.icon !== Mail && button.icon !== Phone ? 'noopener noreferrer' : undefined}
                    className={`
                      flex items-center gap-3
                      ${button.bgColor} ${button.hoverColor}
                      text-white rounded-lg shadow-md
                      transition-all duration-300
                      px-4 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                    `}
                    aria-label={button.ariaLabel}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{button.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
