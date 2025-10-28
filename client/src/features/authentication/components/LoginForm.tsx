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
import { loginUser, getCurrentUser } from '../api'; // Import the API functions
import { AxiosError } from 'axios'; // Import AxiosError for type checking

const loginSchema = z.object({
  // Use email validation for username
  username: z.string().trim().email('Invalid email address').max(100),
  password: z.string().min(1, 'Password is required').max(100),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  // Get the login action directly from the store
  const storeLogin = useAuthStore((state) => state.login);
  const [logisticsForm, setLogisticsForm] = useState({ username: '', password: '' });
  const [supportForm, setSupportForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logistics' | 'support'>('logistics'); // Track active tab

  const handleLogin = async () => { // Removed role parameter
    setError('');
    setLoading(true);
    // Use data from the currently active tab
    const formData = activeTab === 'logistics' ? logisticsForm : supportForm;

    try {
      // 1. Validate input using Zod schema
      const validatedData = loginSchema.parse(formData);

      // 2. Call the REAL API function
      const tokenData = await loginUser({
        email: validatedData.username, // Use validated email
        password: validatedData.password,
      });

      // 3. If login is successful, store the token TEMPORARILY
      //    We need to fetch user details next.
      //    The axios interceptor will need this token immediately.
      useAuthStore.setState({ token: tokenData.access_token }); // Temporarily set token

      // 4. Fetch the current user's details using the token
      const userData = await getCurrentUser();

      // 5. Check if the user's role matches the selected tab (optional but good practice)
      if (userData.role !== activeTab) {
          useAuthStore.setState({ token: null }); // Clear temporary token
          throw new Error(`User role (${userData.role}) does not match selected login tab (${activeTab}).`);
      }


      // 6. NOW store the token AND user data permanently in Zustand
      storeLogin(tokenData.access_token, {
          role: userData.role,
          name: userData.full_name,
          // Add other fields from UserRead if needed
      });


      // 7. Navigate to the main application
      navigate('/');

    } catch (err) {
       useAuthStore.setState({ token: null }); // Clear token on any error
      if (err instanceof z.ZodError) {
        // Handle validation errors
        setError(err.errors[0].message);
      } else if (err instanceof AxiosError) {
        // Handle API errors (like 401 Unauthorized)
        const errorMessage = err.response?.data?.detail || err.message || 'Login failed. Please check credentials.';
        setError(errorMessage);
      } else if (err instanceof Error) {
        // Handle other errors (like role mismatch)
         setError(err.message);
      }
      else {
        // Fallback error message
        setError('An unexpected error occurred. Please try again.');
        console.error("Login Error:", err); // Log unexpected errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Update Tabs to control activeTab state */}
      <Tabs
        defaultValue="logistics"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'logistics' | 'support')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logistics">Logistics Team</TabsTrigger>
          <TabsTrigger value="support">Support Team</TabsTrigger>
        </TabsList>

        {/* Logistics Tab Content */}
        <TabsContent value="logistics" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="logistics-username">Email</Label> {/* Changed label */}
            <Input
              id="logistics-username"
              type="email" // Use email input type
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
          {/* Update Button to call handleLogin without role */}
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading || activeTab !== 'logistics'}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In as Logistics
          </Button>
          {/* Optional: Remove demo credentials text */}
          {/* <p className="text-xs text-muted-foreground text-center">
            Demo: logistics / logistics123
          </p> */}
        </TabsContent>

        {/* Support Tab Content */}
        <TabsContent value="support" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="support-username">Email</Label> {/* Changed label */}
            <Input
              id="support-username"
              type="email" // Use email input type
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
          {/* Update Button to call handleLogin without role */}
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading || activeTab !== 'support'}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In as Support
          </Button>
          {/* Optional: Remove demo credentials text */}
          {/* <p className="text-xs text-muted-foreground text-center">
             Demo: support / support123
          </p> */}
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