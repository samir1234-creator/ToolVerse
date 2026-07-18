import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToolCard } from '@/components/tools/ToolCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { tools, categoryMeta } from '@/constants/tools';
import { pageVariants, staggerContainer, staggerItem } from '@/animations/variants';

export default function CategoryDetail() {
  const { id = '' } = useParams();
  const meta = categoryMeta[id];
  const list = tools.filter((t) => t.category === id);

  if (!meta) {
    return (
      <div>
        <PageHeader title="Not found" />
        <EmptyState icon={LayoutGrid} title="Category not found" />
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title={meta.label} subtitle={meta.description} />
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2.5 px-4 pb-28 pt-5">
        {list.map((t) => (
          <motion.div key={t.id} variants={staggerItem}>
            <ToolCard tool={t} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
