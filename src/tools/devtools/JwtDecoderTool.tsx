import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JwtDecoderTool() {
  const [jwt, setJwt] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );

  const decoded = useMemo(() => {
    if (!jwt.trim()) return { header: null, payload: null, error: null };
    try {
      const parts = jwt.trim().split('.');
      if (parts.length < 2) return { header: null, payload: null, error: 'Invalid JWT format (must have 3 parts separated by dots)' };

      const base64Decode = (str: string) => {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        while (output.length % 4) output += '=';
        return decodeURIComponent(
          atob(output)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const header = JSON.parse(base64Decode(parts[0]));
      const payload = JSON.parse(base64Decode(parts[1]));

      return { header, payload, error: null };
    } catch (err: any) {
      return { header: null, payload: null, error: 'Failed to parse JSON payload or header' };
    }
  }, [jwt]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="JWT Decoder & Inspector" subtitle="Decode JSON Web Tokens and inspect header & payload claims" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste encoded JWT token here..."
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none break-all"
        />

        {decoded.error ? (
          <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-danger-soft)]/20 border border-[var(--color-danger)]/40 p-3.5 text-[var(--color-danger)] text-xs font-semibold">
            <AlertCircle size={16} />
            <span>{decoded.error}</span>
          </div>
        ) : (
          decoded.header && (
            <div className="space-y-4">
              <CopyField label="Header (Algorithm & Token Type)" value={JSON.stringify(decoded.header, null, 2)} />
              <CopyField label="Payload (Claims & User Data)" value={JSON.stringify(decoded.payload, null, 2)} />
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
