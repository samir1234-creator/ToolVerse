import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { Eye, Edit3 } from 'lucide-react';

export default function MarkdownPreviewerTool() {
  const [markdown, setMarkdown] = useState(
    '# ToolVerse Features\n\n- **Fast**: Built for mobile speed\n- **Offline**: Zero network latency\n- **Secure**: All calculations local\n\n```js\nconsole.log("Hello ToolVerse!");\n```'
  );
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');

  // Simple HTML renderer for markdown tags
  const renderHtml = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold my-2 text-[var(--color-text)]">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold my-2 text-[var(--color-text)]">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold my-2 text-[var(--color-text)]">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-[var(--color-accent)]">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-[var(--color-surface-2)] p-3 rounded-xl font-mono text-xs my-2 overflow-x-auto text-[var(--color-text)]">$1</pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded font-mono text-xs text-[var(--color-accent)]">$1</code>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-sm text-[var(--color-text)]">$1</li>');
    return html.replace(/\n/g, '<br />');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Markdown Previewer" subtitle="Write markdown & render live formatted preview" />
      <div className="space-y-4 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          <button
            onClick={() => setTab('editor')}
            className={`rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'editor' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Edit3 size={14} /> Editor
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'preview' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Eye size={14} /> Live Preview
          </button>
        </div>

        {tab === 'editor' ? (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        ) : (
          <div
            className="w-full min-h-[14rem] rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 leading-relaxed overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderHtml(markdown) }}
          />
        )}
      </div>
    </motion.div>
  );
}
