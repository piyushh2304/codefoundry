import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const UpgradeButton = () => {
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please login to upgrade');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on the server
      const { data: order } = await api.post('/payment/create-order');

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SGMzOyDWRjdy15',
        amount: order.amount,
        currency: order.currency,
        name: 'CodeFoundry Pro',
        description: 'Monthly Pro Subscription',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify payment on the server
            const { data: verifyData } = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.plan === 'PRO') {
              toast.success('Successfully upgraded to PRO!');
              // Update local context
              if (user) {
                login(localStorage.getItem('token') || '', { ...user, plan: 'PRO' });
              }
            }
          } catch (err) {
            console.error('Verification failed', err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#FFBE1A',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Upgrade error', error);
      toast.error('Failed to initiate upgrade');
    } finally {
      setLoading(false);
    }
  };

  if (user?.plan === 'PRO') {
    return (
      <Button disabled className="bg-green-500/20 text-green-500 border-green-500/50 cursor-default hover:bg-green-500/20">
        <Zap className="mr-2 h-4 w-4 fill-green-500" /> Pro Plan Active
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleUpgrade} 
      disabled={loading}
      className="bg-[#FFBE1A] hover:bg-[#FFBE1A]/90 text-black font-bold px-6"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Zap className="mr-2 h-4 w-4 fill-black" /> 
      )}
      Upgrade to Pro (₹250/mo)
    </Button>
  );
};
