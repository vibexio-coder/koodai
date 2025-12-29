import React, { useState } from 'react';
import { Phone, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { toast } from 'sonner';
import { useUser } from '../contexts/UserContext';

interface LoginScreenProps {
  onComplete: () => void;
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const { t } = useLanguage();
  const { login } = useUser();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOTP = async () => {
    if (phone.length === 10) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStep('otp');
        toast.success('OTP Sent Successfully! (Mock: 123456)');
        setLoading(false);
      }, 1000);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        // Any OTP is valid for mock
        login(phone);
        toast.success('Login Successful!');
        onComplete();
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg mb-6">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-black mb-2">KOODAI</h1>
        <p className="text-gray-600 text-center mb-8">{t('loginDesc')}</p>

        <div className="w-full max-w-md space-y-6">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">{t('mobileNumber')}</label>
                <div className="flex gap-2">
                  <div className="w-16 px-3 py-3 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-black">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 px-4 py-6 bg-gray-100 border-0 rounded-xl"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={phone.length !== 10 || loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending...' : t('sendOTP')}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">{t('otpSent')}</p>
                  <p className="text-black font-medium">+91 {phone}</p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                      <InputOTPSlot index={1} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                      <InputOTPSlot index={2} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                      <InputOTPSlot index={3} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                      <InputOTPSlot index={4} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                      <InputOTPSlot index={5} className="w-12 h-12 border-2 border-gray-300 rounded-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-center text-yellow-600 hover:underline"
                >
                  {t('resendOTP')}
                </button>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : t('verify')}
              </Button>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-gray-600"
              >
                {t('back')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
