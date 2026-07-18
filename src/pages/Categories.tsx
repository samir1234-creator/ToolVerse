import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculator, Ruler, Code2, Type } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { tools, categoryMeta } from '@/constants/tools';
import { pageVariants, staggerContainer, staggerItem, scaleTap } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

const icons: Record<string, typeof Calculator> = {
  calculators: Calculator,
  converters: Ruler,
  devtools: Code2,
  texttools: Type,
};

export default function Categories() {
  const navigate = useNavigate();
  const categoryIds = Object.keys(categoryMeta);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Categories" subtitle="Browse every tool by type" />
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3 px-4 pb-28 pt-5">
        {categoryIds.map((id) => {
          const meta = categoryMeta[id];
          const Icon = icons[id];
          const count = tools.filter((t) => t.category === id).length;
          return (
            <motion.button
              key={id}
              variants={staggerItem}
              whileTap={scaleTap}
              onClick={() => {
                haptics.light();
                navigate(`/category/${id}`);
              }}
              className="flex flex-col items-start gap-3 rounded-3xl bg-[var(--color-surface)] p-5 text-left shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-[15px] font-semibold text-[var(--color-text)]">{meta.label}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{count} tools</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
