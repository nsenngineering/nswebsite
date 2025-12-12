'use client';

import { Mail, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/site-config';

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
  hidden: { opacity: 0, x: 50 },
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
  ];

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-30 flex flex-col gap-4 md:gap-4"
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
            target={button.icon === MessageCircle ? '_blank' : undefined}
            rel={button.icon === MessageCircle ? 'noopener noreferrer' : undefined}
            className={`
              group relative flex items-center justify-center
              ${button.bgColor} ${button.hoverColor}
              text-white rounded-full shadow-lg hover:shadow-xl
              transition-all duration-300
              w-12 h-12 md:w-14 md:h-14
              focus:outline-none focus:ring-4 focus:ring-offset-2
            `}
            aria-label={button.ariaLabel}
            variants={buttonVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" />

            {/* Tooltip - Desktop Only */}
            <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2
                          bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm
                          whitespace-nowrap opacity-0 group-hover:opacity-100
                          transition-opacity pointer-events-none shadow-lg">
              {button.label}
              {/* Tooltip Arrow */}
              <div className="absolute left-full top-1/2 -translate-y-1/2
                            border-4 border-transparent border-l-gray-900" />
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
