import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { sessionAccountStatus, sessionStore } from './schoolData';

/**
 * Signs the person out when a platform admin has deactivated their account while they were using it.
 * Checked on load and whenever they move to another page.
 */
export function useAccountGuard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { showToast } = useToast();
  useEffect(() => {
    if (sessionAccountStatus() !== 'inactive') return;
    const role = sessionStore.get()?.role ?? 'student';
    sessionStore.clear();
    localStorage.removeItem('user_role');
    showToast('This account has been deactivated. Please contact your school or OAICC support.', 'error');
    navigate(`/auth/signin?role=${role}`, { replace: true });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}
