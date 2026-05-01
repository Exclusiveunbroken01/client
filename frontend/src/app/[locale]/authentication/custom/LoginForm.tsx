'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SVGIcon from '@/components/defaults/SVGIcons';
import { useRouter } from 'next/navigation';
import { loginService } from '@/app/service/domain/auth/auth.service'; // Import service

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [otpStatus, setOtpStatus] = useState<boolean>(false);
  const cardRef = useRef(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const toggleOTPStatus = () => setOtpStatus(!otpStatus);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Use the service instead of manual fetch
      const result = await loginService(data);
      
      console.log('Login successful:', result);

      // Hard redirect to dashboard to refresh auth state in middleware
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Invalid Credentials');
    }
  };

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  }, []);

  return (
    <div className='max-w-md py-4'>
      <form ref={cardRef} onSubmit={handleSubmit(onSubmit)}>
        <div className={`${!otpStatus ? 'mb-5' : 'mb-1'}`}>
          <Label htmlFor='email' className='block text-sm font-medium text-[#667085] mb-2'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='Email'
            {...register('email')}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <span className='text-red-500 text-sm mt-2'>{errors.email.message}</span>}
        </div>

        {!otpStatus ? (
          <div className='mb-5'>
            <Label htmlFor='password' className='block text-sm font-medium text-[#667085] mb-2'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              {...register('password')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <span className='text-red-500 text-sm mt-2'>{errors.password.message}</span>}
            <div className='flex items-center justify-between text-sm mt-1'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <Label htmlFor='remember' className='text-[#1A1A1A] font-normal text-sm'>Remember Me</Label>
              </div>
              <a href='#' className='text-[#009DC4] text-sm hover:underline'>Forgot your password?</a>
            </div>
          </div>
        ) : (
          <div className='mb-4'>
            <span className='text-[#062231] text-xs'>We’ll send an OTP via Email</span>
          </div>
        )}

        <Button
          type='submit'
          disabled={isSubmitting}
          variant={'outline'}
          className='w-full py-3 text-[#B02D1C] border-[#B02D1C] rounded-md hover:bg-red-50'
        >
          {isSubmitting ? 'Loading...' : (!otpStatus ? 'Log In' : 'Get OTP')}
        </Button>
      </form>
      
      {/* ... rest of your social buttons ... */}
    </div>
  );
};

export default LoginForm;
