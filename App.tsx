import { useUser } from './lib/stack';
import { TrustBankLoginPage } from './components/trust-bank-login-page';
import { BankingDashboard } from './components/banking-dashboard';

export default function App() {
  const user = useUser();

  // If user is present but we want to force login after registration, 
  // we rely on the registration component to call signOut.
  // However, useUser() might still return the user for a split second before the signOut propagates state.
  
  return (
    <>
      {!user ? (
        <TrustBankLoginPage />
      ) : (
        <BankingDashboard onLogout={() => user.signOut()} />
      )}
    </>
  );
}
