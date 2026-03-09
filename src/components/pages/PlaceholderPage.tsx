"use client";

import { motion } from "framer-motion";
import { type LucideProps } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
  breadcrumb: string;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  color,
  breadcrumb,
}: PlaceholderPageProps) {
  return (
    <div className="h-full flex flex-col px-7 pt-7 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[12px] text-[#3A3A48] mb-2">{breadcrumb}</p>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[11px] flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
          >
            <Icon size={20} color={color} />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
              {title}
            </h1>
            <p className="text-[12px] text-[#4A4A58]">{description}</p>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center gap-4"
      >
        <div
          className="w-20 h-20 rounded-[20px] flex items-center justify-center"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}
        >
          <Icon size={36} color={color} opacity={0.7} />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-[#4A4A58] mb-1">{title} em construção</p>
          <p className="text-[13px] text-[#2A2A36]">Esta seção estará disponível em breve</p>
        </div>
      </motion.div>
    </div>
  );
}
