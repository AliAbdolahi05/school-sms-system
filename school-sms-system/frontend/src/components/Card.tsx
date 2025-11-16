import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </motion.div>
  );
}