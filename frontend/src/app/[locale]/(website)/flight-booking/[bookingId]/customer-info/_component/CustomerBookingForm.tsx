// src/app/[locale]/(website)/flight-booking/[bookingId]/customer-info/_component/CustomerBookingForm.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import {
  BookingFormSchema,
  TBookingProviderRequestForm,
  TBookingRegistrationForm,
  TPassengerInfoForm,
} from '@/lib/schemas/website/flight-booking.schema';
import { FlightSearchQuery } from '@/lib/types/flight-search/flight-search-url';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import PhoneInput from 'react-phone-number-input';
import { Edit3Icon, NotebookPenIcon } from 'lucide-react';
import InputField from '@/components/defaults/InputField';
import RadioGroupField, { RadioOption } from '@/components/defaults/RadioGroupField';
import { useMemo, useState } from 'react';
import { getFormErrorMessages } from '@/lib/helper/get-form-error.helper';
import DatePickerField from '@/components/defaults/DatePickerField';
import { Separator } from '@/components/ui/separator';
import { RHFCountrySelect } from '@/components/defaults/RHFCountrySelect';
//import { loadStripe } from '@stripe/stripe-js';
import { useInitiateFlightBooking } from '@/lib/hooks/website/flight-booking.hook';
import { validateAndNormalizePhone } from '@/lib/utils/phone.util';
import { IAlertProps } from '@/components/custom/AlertDisplayField';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

//const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ICustomerBookingFormProps {
  flightId: string;
  totalAmount: number;
  searchParams: FlightSearchQuery;
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: Date;
}

const titleOptions: RadioOption[] = [
  {
    value: 'Mr',
    label: 'Mr',
  },
  {
    value: 'Mrs',
    label: 'Mrs',
  },
  {
    value: 'Ms',
    label: 'Ms',
  },
  {
    value: 'Miss',
    label: 'Miss',
  },
  {
    value: 'Mstr',
    label: 'Mstr',
  },
];

const CustomerBookingForm = ({
  flightId,
  searchParams,
  departureCity,
  arrivalCity,
  departureDate,
  totalAmount = 0.0,
}: ICustomerBookingFormProps) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  console.log('Customer Booking', alert);
  const adultCount = Number(searchParams?.adult ?? 1);
  const childCount = Number(searchParams?.child ?? 0);
  const totalPassengers = adultCount + childCount;

  const defaultPassengers: TPassengerInfoForm[] = Array.from({ length: totalPassengers }, (_, index) => ({
    passengerType: index + 1 < adultCount ? 'child' : 'adult',
    title: 'Mr',
    email: '',
    phone_number: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: new Date(),
    passportNumber: '',
    issuingDate: undefined,
    passportExpiry: undefined,
    nationalityCountry: '',
    issuingCountry: '',
    holder: true,
  }));

  type PassengerDraft = TBookingRegistrationForm['passengers'][number];
  const isPassengerComplete = (p: PassengerDraft) => {
    if (!p) return false;
    return (
      p?.firstName &&
      p?.lastName &&
      p?.gender &&
      p?.dateOfBirth &&
      p?.passportNumber &&
      p?.passportExpiry &&
      p?.nationalityCountry &&
      p?.issuingCountry
    );
  };

  const initiateBooking = useInitiateFlightBooking();

  const form = useForm<TBookingRegistrationForm>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      passengers: defaultPassengers,
      contact: {
        email: '',
        phone_number: '',
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = form;
  const { fields } = useFieldArray({
    control,
    name: 'passengers',
  });

  const errorMessages = useMemo(() => getFormErrorMessages(errors), [errors]);

  const onSubmit = async (values: TBookingRegistrationForm) => {
    try {
      const parsed = BookingFormSchema.parse(values); // now dates are real Date objects

      // 1️⃣ Create booking in your backend
      const validatePhoneNumber = validateAndNormalizePhone(parsed.contact.phone_number, 'NG');
      if (!validatePhoneNumber.isValid) {
        setAlert({
          type: 'error',
          title: 'Failed to validate phone number',
          description: validatePhoneNumber.error,
        });
        return;
      }
      if (!validatePhoneNumber.normalized) {
        setAlert({
          type: 'error',
          title: 'Failed!!!',
          description: 'Phone number cannot be empty',
        });
        return;
      }

      const bookingFlight: TBookingRegistrationForm = {
        ...parsed,
        contact: {
          email: parsed.contact.email,
          phone_number: validatePhoneNumber.normalized,
        },
      };
      const serverBooking: TBookingProviderRequestForm = {
        flightId,
        totalAmount,
        origin: departureCity,
        destination: arrivalCity,
        travelDate: departureDate,
        travellerCount: totalPassengers,
        userRegistrying: bookingFlight,
      };
      //console.log('Customer Booking Profile: ', serverBooking);
      toast.success(`Booking Profile ${JSON.stringify(serverBooking)}`);

      initiateBooking.mutateAsync(serverBooking);
      setAlert({
        type: 'success',
        title: 'Registration Booking Successful',
        description: 'Flight Booking Created!',
      });

    } catch (err) {
      const message = getErrorMessage(err);
      console.error(`Book Ticket error: ${message}`);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
      const checkAuth = () => {
        // Check for 'isLoggedIn=true' instead of 'token='
        const cookies = document.cookie.split(';');
        const isUserLoggedIn = cookies.some((item) => item.trim().startsWith('isLoggedIn=true'));
        
        setIsLoggedIn(isUserLoggedIn);
      };

      checkAuth();
      
      // This listener helps if the user logs out in another tab
      window.addEventListener('focus', checkAuth); 
      return () => window.removeEventListener('focus', checkAuth);
    }, []);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='gap-2'>
          <CardHeader>
            <CardTitle className='py-0'>
              <div className='flex items-start justify-baseline gap-3'>
                <NotebookPenIcon size={28} color='#E17100' />
                <div className='block space-y-1 md:space-y-2'>
                  <p className='mt-0.5 font-bold text-base md:text-xl leading-[150%] text-gray-800'>
                    Passenger Information
                  </p>
                  <p className='mb-6 text-gray-600 text-sm md:text-lg leading-[150%]'>
                    Please provide details for{' '}
                    {adultCount > 0 ? (adultCount > 1 ? `${adultCount} adults ` : `${adultCount} adult `) : undefined}
                    {childCount > 0 ? (childCount > 1 ? `${childCount} children` : `${childCount} child`) : undefined}
                  </p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type='multiple' defaultValue={fields.map((_, i) => `p-${i}`)}>
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={`p-${index}`}>
                  <AccordionTrigger className={`py-0 ${index > 0 ? 'mt-8' : undefined}`}>
                    <div className='flex items-center gap-2'>
                      <p className='mt-0.5 font-bold text-base md:text-xl lg:text-2xl leading-[150%] text-gray-800'>
                        Passenger {index + 1} ({field.passengerType})
                      </p>
                      {isPassengerComplete(form.watch(`passengers.${index}`)) && (
                        <span className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full'>✓ Complete</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col gap-4 pt-4'>
                    <div className='w-full my-2'>
                      <RadioGroupField<TBookingRegistrationForm>
                        name={`passengers.${index}.title`}
                        control={control}
                        options={titleOptions}
                        orientation='horizontal'
                        label='Gender'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='mt-2 w-full'>
                        <InputField<TBookingRegistrationForm>
                          name={`passengers.${index}.email`}
                          control={control}
                          type='email'
                          label='Email'
                        />
                      </div>
                      <div className='w-full'>
                        <FormField
                          control={control}
                          name={`passengers.${index}.phone_number`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-medium text-sm leading-[150%]'>Phone Number</FormLabel>
                              <FormControl>
                                <PhoneInput
                                  defaultCountry='NG'
                                  international
                                  value={field.value}
                                  onChange={(val) => {
                                    field.onChange(val);
                                    if (val) {
                                      form.clearErrors(`passengers.${index}.phone_number`);
                                    }
                                  }}
                                  className='w-full md:max-w-[85%] text-sm'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <InputField<TBookingRegistrationForm>
                        name={`passengers.${index}.firstName`}
                        control={control}
                        label='First Name'
                        placeholder='First Name'
                      />
                      <InputField<TBookingRegistrationForm>
                        name={`passengers.${index}.lastName`}
                        control={control}
                        label='Last Name'
                        placeholder='Last Name'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='w-full block space-y-2.5'>
                        <Label>Gender</Label>
                        <Select
                          onValueChange={(v) => form.setValue(`passengers.${index}.gender`, v as 'Male' | 'Female')}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Gender' />
                          </SelectTrigger>
                          <SelectContent>
                            {['Male', 'Female'].map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <InputField<TBookingRegistrationForm>
                        name={`passengers.${index}.passportNumber`}
                        control={control}
                        label='Passport Number'
                        placeholder='Passport Number'
                      />
                    </div>

                    <div className='w-full flex flex-col md:flex-row items-start gap-2'>
                      <DatePickerField<TBookingRegistrationForm>
                        name={`passengers.${index}.dateOfBirth`}
                        control={control}
                        label='Date of birth'
                      />
                      <Separator className='hidden lg:inline' orientation='vertical' />
                      <DatePickerField<TBookingRegistrationForm>
                        name={`passengers.${index}.issuingDate`}
                        control={control}
                        label='Issuance Date'
                      />
                      <Separator className='hidden lg:inline' orientation='vertical' />
                      <DatePickerField<TBookingRegistrationForm>
                        name={`passengers.${index}.passportExpiry`}
                        control={control}
                        label='Passport Expiration'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <RHFCountrySelect<TBookingRegistrationForm>
                        control={control}
                        name={`passengers.${index}.nationalityCountry`}
                        label='Nationality'
                      />

                      <RHFCountrySelect<TBookingRegistrationForm>
                        control={control}
                        name={`passengers.${index}.issuingCountry`}
                        label='Issuing Country'
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        {!isLoggedIn ? (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>
              <div className='flex items-start justify-baseline gap-3'>
                <Edit3Icon className='mt-1' size={20} color='#E17100' />
                <div className='block space-y-2'>
                  <p className='mt-0.5 font-bold text-sm md:text-base lg:text-xl leading-[150%] text-gray-800 bg'>
                    Traveller Information & Contact Details
                  </p>
                  <span className='font-light text-gray-500 text-xs md:text-sm leading-[150%]'>
                    We will send you your booking confirmation to these contact details
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const p1 = form.getValues('passengers.0');
                      if (!p1) return;

                      form.setValue('contact.email', p1.email ?? '');
                      form.setValue('contact.phone_number', p1.phone_number ?? '');
                    }}
                    className='mt-4 border border-gray-600 bg-purple-200 hover:bg-purple-600 hover:text-white text-gray-800 font-bold cursor-pointer'
                  >
                    Click to Use Passenger 1 Contact
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='w-full mt-1'>
              <InputField<TBookingRegistrationForm>
                name={'contact.email'}
                control={control}
                type='email'
                label='Email'
              />
            </div>
            <FormField
              control={control}
              name='contact.phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm leading-[150%]'>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry='NG'
                      value={field.value!}
                      onChange={async (val) => {
                        field.onChange(val);
                        if (val) {
                          clearErrors('contact.phone_number');
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        ) : (<></>)}
        <Button
          type='submit'
          size='lg'
          className='w-full bg-[#E63A24] hover:bg-[#c5311e] text-white font-bold cursor-pointer'
          disabled={initiateBooking.isPending}
        >
          {initiateBooking.isPending ? 'Initiating Booking request ...' : 'Continue to Payment'}
        </Button>
        {errorMessages.length > 0 && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-4'>
            <ul className='list-disc pl-5 space-y-1 text-sm text-red-700'>
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CustomerBookingForm;
