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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [otpStatus, setOtpStatus] = useState<boolean>(false);
  const cardRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const toggleOTPStatus = () => {
    setOtpStatus(!otpStatus); // Toggles the state
  };

  const onSubmit = async (data: LoginFormValues) => {
	  try {
		const response = await fetch('http://localhost:5000/api/auth/login', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data),
		});

		if (!response.ok) {
		  const errorData = await response.json();
		  console.error('Login failed:', errorData.message || 'Unknown error');
		  alert(errorData.message || 'Login failed');
		  return;
		}

		const result = await response.json();
		console.log('Login successful:', result);

		// Store token if returned by backend
		if (result.token) {
		  localStorage.setItem('authToken', result.token);
		  // Optionally redirect user
		  window.location.href = '/dashboard';
		}
	  } catch (error) {
		console.error('Error connecting to API:', error);
		alert('An error occurred while logging in.');
	  }
  };

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  }, []);
  return (
    <div className='max-w-md py-4'>
      <form ref={cardRef} onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className={`${!otpStatus ? 'mb-5' : 'mb-1'}`}>
          <Label htmlFor='email' className='block text-sm font-medium text-[#667085] mb-2'>
            Email
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='Email'
            {...register('email')}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <span className='text-red-500 text-sm mt-2'>{errors.email.message}</span>}
        </div>
        {/* Password Input */}
        {!otpStatus ? (
          <div className='mb-5'>
            <Label htmlFor='password' className='block text-sm font-medium text-[#667085] mb-2'>
              Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              {...register('password')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <span className='text-red-500 text-sm mt-2'>{errors.password.message}</span>}
            <div className='flex items-center justify-between text-sm mt-1'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <Label htmlFor='remember' className='text-[#1A1A1A] font-normal text-sm'>
                  Remember Me
                </Label>
              </div>
              <a href='#' className='text-[#009DC4] text-sm font-light leading-normal hover:underline'>
                Forgot your password?
              </a>
            </div>
          </div>
        ) : (
          <div className='mb-0'>
            <span className='text-[#062231] text-xs font-normal leading-[18px]'>We’ll send an OTP via Email</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          variant={'outline'}
          className='w-full py-3 text-sm text-[#B02D1C] border-[#B02D1C] rounded-md hover:bg-red-50 focus:ring-4 focus:ring-red-900 cursor-pointer'
        >
          {!otpStatus ? 'Log In' : 'Get OTP'}
        </Button>
      </form>
      <div className='static-options'>
        <div className='static-display'>or Login With</div>
      </div>
      <div className='login-options'>
        <div className='login-option-wrapper'>
          <Button
            onClick={toggleOTPStatus}
            variant={'outline'}
            className='w-full items-start justify-baseline cursor-pointer'
            asChild
          >
            <div className='flex items-start'>
              <SVGIcon
                fileName={`${!otpStatus ? 'icon-mail.svg' : 'icon-lock.svg'}`}
                width={20}
                height={16}
                alt={`${!otpStatus ? 'Mail' : 'Lock'}`}
              />
              <div className='w-1/2 mx-auto'>
                <span className='font-sans font-medium text-base leading-6'>
                  {!otpStatus ? 'Login with OTP' : 'Login with Password'}
                </span>
              </div>
            </div>
          </Button>
          <Button variant={'outline'} className='w-full items-start justify-baseline cursor-pointer' asChild>
            <div className='flex items-start'>
              <SVGIcon fileName='google-socials.svg' width={20} height={16} alt='Mail' />
              <div className='w-1/2 mx-auto'>
                <span className='font-sans font-medium text-base leading-6'>Login with Google</span>
              </div>
            </div>
          </Button>
          <Button variant={'outline'} className='w-full items-start justify-baseline cursor-pointer' asChild>
            <div className='flex items-start'>
              <SVGIcon fileName='icon-apple.svg' width={20} height={16} alt='Mail' />
              <div className='w-1/2 mx-auto'>
                <span className='font-sans font-medium text-base leading-6'>Login with Apple</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
