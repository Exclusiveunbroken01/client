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
import { loginService } from '@/app/service/domain/auth/auth.service';
import { ApiError } from '@/lib/utils/errors/api-error.util';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const cardRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginService(data);

      console.log('Login successful:', result);

      // IMPORTANT: force fresh navigation so cookie is picked up
      window.location.href = '/dashboard';

    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        console.error(error);
        alert('Something went wrong');
      }
    }
  };

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className='max-w-md py-4'>
      <form ref={cardRef} onSubmit={handleSubmit(onSubmit)}>
        
        {/* Email */}
        <div className='mb-5'>
          <Label>Email</Label>
          <Input
            type='email'
            placeholder='Email'
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className='mb-5'>
          <Label>Password</Label>
          <Input
            type='password'
            placeholder='Password'
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}

          <div className='flex items-center justify-between text-sm mt-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox id='remember' />
              <Label htmlFor='remember'>Remember Me</Label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button type='submit' className='w-full'>
          Log In
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
