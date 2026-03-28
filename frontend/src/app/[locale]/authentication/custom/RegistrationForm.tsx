'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SVGIcon from '@/components/defaults/SVGIcons';

// Zod Schema for validation
const signupSchema = z
  .object({
    firstName: z.string().min(2, 'Required at least 2 characters'),
    lastName: z.string().min(2, 'Required at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // attach error to this field
  });
type SignupFormValues = z.infer<typeof signupSchema>;

const RegistrationForm = () => {
  const cardRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
	  try {
		const payload = {
		  firstName: data.firstName,
		  lastName: data.lastName,
		  email: data.email,
		  password: data.password,
		};

		const response = await fetch('http://localhost:5000/api/auth/register', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(payload),
		});

		const result = await response.json();

		if (!response.ok) {
		  console.error('Registration failed:', result);
		  alert(result.message || 'Registration failed');
		  return;
		}

		console.log('Registration successful:', result);
		alert('Registration successful! You can now login.');
	  } catch (error) {
		console.error('Network or server error:', error);
		alert('An error occurred. Please try again.');
	  }
	};

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  }, []);

  return (
    <div className='max-w-md py-1'>
      <form ref={cardRef} onSubmit={handleSubmit(onSubmit)}>
        {/* First Name Input */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* First Name Input */}
          <div className='mb-3'>
            <Label htmlFor='first_name' className='block text-sm font-medium text-[#667085] mb-2'>
              First Name
            </Label>
            <Input
              id='first_name'
              type='text'
              placeholder='First Name'
              {...register('firstName')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && <span className='text-red-500 text-sm mt-2'>{errors.firstName.message}</span>}
          </div>
          {/* Last Name Input */}
          <div className='mb-3'>
            <Label htmlFor='last_name' className='block text-sm font-medium text-[#667085] mb-2'>
              Last Name
            </Label>
            <Input
              id='last_name'
              type='text'
              placeholder='Last Name'
              {...register('lastName')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && <span className='text-red-500 text-sm mt-2'>{errors.lastName.message}</span>}
          </div>
        </div>
        {/* Email Input */}
        <div className='mb-3'>
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Password Input */}
          <div className='mb-2'>
            <Label htmlFor='password' className='block text-sm font-medium text-[#667085] mb-2'>
              Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              {...register('password')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <span className='text-red-500 text-sm mt-2'>{errors.password.message}</span>}
          </div>
          {/* Confirm Password */}
          <div className='mb-2'>
            <Label htmlFor='password' className='block text-sm font-medium text-[#667085] mb-2'>
              Confirm Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Confirm Password'
              {...register('confirmPassword')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 transition duration-200 focus-visible:border-ring focus-visible:ring-ring/10 focus-visible:ring-[1px] ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <span className='text-red-500 text-sm mt-2'>{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between text-sm mt-1 mb-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox id='special-offer' />
            <Label htmlFor='special-offer' className='text-[#1A1A1A] font-normal text-xs'>
              Send me special offers & promotions
            </Label>
          </div>
        </div>
        {/* Submit Button */}
        <Button
          type='submit'
          variant={'outline'}
          className='w-full py-3 text-[#B02D1C] border-[#B02D1C] rounded-md hover:bg-red-50 focus:ring-4 focus:ring-red-900'
        >
          Sign Up
        </Button>
      </form>
      <div className='static-options'>
        <div className='static-display'>or Signup With</div>
      </div>
      <div className='login-options'>
        <div className='login-option-wrapper'>
          <Button variant={'outline'} className='w-full items-start justify-baseline' asChild>
            <div className='flex items-start'>
              <SVGIcon fileName='google-socials.svg' width={20} height={16} alt='Mail' />
              <div className='w-1/2 mx-auto'>
                <span className='font-sans font-medium text-base leading-6'>Sign Up with Google</span>
              </div>
            </div>
          </Button>
          <Button variant={'outline'} className='w-full items-start justify-baseline' asChild>
            <div className='flex items-start'>
              <SVGIcon fileName='icon-apple.svg' width={20} height={16} alt='Mail' />
              <div className='w-1/2 mx-auto'>
                <span className='font-sans font-medium text-base leading-6'>Sign Up with Apple</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className='block max-w-2xs'>
        <h6 className='text-xs font-normal leading-3.5 text-[#909AAE]'>
          By proceeding, I acknowledge that i have read and agree to Travelstarts{' '}
          <span className='text-[#1DB2F5]'>Terms and Conditions</span>
        </h6>
      </div>
    </div>
  );
};

export default RegistrationForm;
