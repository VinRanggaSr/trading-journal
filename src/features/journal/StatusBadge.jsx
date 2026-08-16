import { Badge } from '../../components/ui/badge';

const STATUS_MAP = {
  Pending: { label: 'Pending', tone: 'gray' },
  'No Entry': { label: 'No Entry', tone: 'gray' },
  Entry: { label: 'Entry', tone: 'purple' },
  'TP Partial': { label: 'TP Partial', tone: 'orange' },
  TP: { label: 'Take Profit', tone: 'green' },
  CL: { label: 'Cut Loss', tone: 'red' }
};

export function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { label: status || '-', tone: 'gray' };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
