import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required').max(100),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [logisticsForm, setLogisticsForm] = useState({ username: '', password: '' });
  const [supportForm, setSupportForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Marked the function as 'async' to use the 'await' keyword.
  const handleLogin = async (role: 'logistics' | 'support') => {
    setError('');
    setLoading(true);

    const formData = role === 'logistics' ? logisticsForm : supportForm;

    try {
      // Validate input
      loginSchema.parse(formData);

      // Await the result of the API call from the auth store.
      const success = await login(formData.username, formData.password, role);

      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials or role mismatch. Please try again.');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="logistics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logistics">Logistics Team</TabsTrigger>
          <TabsTrigger value="support">Support Team</TabsTrigger>
        </TabsList>

        <TabsContent value="logistics" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="logistics-username">Username (Email)</Label>
            <Input
              id="logistics-username"
              placeholder="Enter email"
              value={logisticsForm.username}
              onChange={(e) => setLogisticsForm({ ...logisticsForm, username: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logistics-password">Password</Label>
            <Input
              id="logistics-password"
              type="password"
              placeholder="Enter password"
              value={logisticsForm.password}
              onChange={(e) => setLogisticsForm({ ...logisticsForm, password: e.target.value })}
              disabled={loading}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleLogin('logistics')}
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In as Logistics
          </Button>
        </TabsContent>

        <TabsContent value="support" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="support-username">Username (Email)</Label>
            <Input
              id="support-username"
              placeholder="Enter email"
              value={supportForm.username}
              onChange={(e) => setSupportForm({ ...supportForm, username: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-password">Password</Label>
            <Input
              id="support-password"
              type="password"
              placeholder="Enter password"
              value={supportForm.password}
              onChange={(e) => setSupportForm({ ...supportForm, password: e.target.value })}
              disabled={loading}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleLogin('support')}
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In as Support
          </Button>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};