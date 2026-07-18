import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { ToolCard } from '@/components/tools/ToolCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { searchTools } from '@/constants/tools';
import { pageVariants, staggerContainer, staggerItem } from '@/animations/variants';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = searchTools(query);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Search" />
      <div className="px-4 pt-4">
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>

      <div className="px-4 pb-28 pt-4">
        <AnimatePresence mode="wait">
          {query && results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState icon={SearchX} title="No tools found" description={`Nothing matches "${query}"`} />
            </motion.div>
          ) : (
            <motion.div key="results" variants={staggerContainer} initial="initial" animate="animate" className="space-y-2.5">
              {results.map((t) => (
                <motion.div key={t.id} variants={staggerItem}>
                  <ToolCard tool={t} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
