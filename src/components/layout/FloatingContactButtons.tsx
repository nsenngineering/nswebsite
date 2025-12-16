'use client';

import { Mail, MessageCircle, Phone, Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
};

export default function FloatingContactButtons() {
  const buttons: ContactButton[] = [
    {
      icon: Mail,
      href: `mailto:${siteConfig.contact.email}`,
      label: 'Send Email',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      ariaLabel: 'Send email to NS Engineering',
    },
    {
      icon: MessageCircle,
      href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20NS%20Engineering`,
      label: 'Chat on WhatsApp',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      ariaLabel: 'Chat with NS Engineering on WhatsApp',
    },
    {
      icon: Phone,
      href: `tel:${siteConfig.contact.phone}`,
      label: 'Call Us',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      ariaLabel: 'Call NS Engineering',
    },
    {
      icon: Facebook,
      href: siteConfig.social.facebook,
      label: 'Follow on Facebook',
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0c5ec7]',
      ariaLabel: 'Follow NS Engineering on Facebook',
    },
    {
      icon: Linkedin,
      href: siteConfig.social.linkedin,
      label: 'Connect on LinkedIn',
      bgColor: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#084d94]',
      ariaLabel: 'Connect with NS Engineering on LinkedIn',
    },
    {
      icon: Instagram,
      href: siteConfig.social.instagram,
      label: 'Follow on Instagram',
      bgColor: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      hoverColor: 'hover:opacity-90',
      ariaLabel: 'Follow NS Engineering on Instagram',
    },
    {
      icon: TikTokIcon,
      href: siteConfig.social.tiktok,
      label: 'Follow on TikTok',
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-900',
      ariaLabel: 'Follow NS Engineering on TikTok',
    },
  ];

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-30 flex flex-col gap-3 md:gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
              group relative flex items-center justify-center
              ${button.bgColor} ${button.hoverColor}
              text-white rounded-full shadow-lg hover:shadow-xl
              transition-all duration-300
              w-10 h-10 md:w-10 md:h-10
              focus:outline-none focus:ring-4 focus:ring-offset-2
            `}
            aria-label={button.ariaLabel}
            variants={buttonVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />

            {/* Tooltip - Desktop Only */}
            <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2
                          bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm
                          whitespace-nowrap opacity-0 group-hover:opacity-100
                          transition-opacity pointer-events-none shadow-lg">
              {button.label}
              {/* Tooltip Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2
                            border-4 border-transparent border-r-gray-900" />
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
