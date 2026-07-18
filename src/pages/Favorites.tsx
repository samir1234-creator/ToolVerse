import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToolCard } from '@/components/tools/ToolCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getToolById } from '@/constants/tools';
import { useAppStore } from '@/hooks/useAppStore';
import { pageVariants, staggerContainer, staggerItem } from '@/animations/variants';

export default function Favorites() {
  const favorites = useAppStore((s) => s.favorites);
  const favoriteTools = favorites.map((id) => getToolById(id)).filter(Boolean) as ReturnType<typeof getToolById>[];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Favorites" subtitle={`${favoriteTools.length} saved tools`} />
      {favoriteTools.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" description="Tap the heart on any tool to save it here." />
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2.5 px-4 pb-28 pt-5">
          {favoriteTools.map((t) => (
            <motion.div key={t!.id} variants={staggerItem}>
              <ToolCard tool={t!} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
