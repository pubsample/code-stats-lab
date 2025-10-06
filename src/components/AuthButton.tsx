import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AuthButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout');
      return;
    }
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogin}
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      Login
    </Button>
  );
};
