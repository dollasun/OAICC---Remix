import type { AccountStatus } from '../types';

/** How an account status is shown everywhere (invited accounts read as "Pending"). */
export const STATUS_BADGE: Record<AccountStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-600' },
  invited: { label: 'Pending', className: 'bg-amber-50 text-amber-600' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500' },
};
