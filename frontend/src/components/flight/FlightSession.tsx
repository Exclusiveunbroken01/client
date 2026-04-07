// src/app/[locale]/(website)/(Index)/custom/FlightSession.tsx

'use client';
import React, { useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2, Minus, Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { CABIN_CLASS_LABELS, FLIGHT_TYPE_OPTIONS as flight_options } from '@/lib/constants/default-layout.constant';
import { Switch } from '@/components/ui/switch';
import DatePickerField from '@/components/defaults/DatePickerField';
import RadioGroupField from '@/components/defaults/RadioGroupField';
import { TFlightFormSchema } from '@/lib/hooks/website/landing-page.hook';
import { flightFormSchema } from '@/lib/schemas/website/landing-page.schema';
import { CabinClassSchema } from '@/lib/schemas/enums/flight-types.enum';
import { RHFLocationPicker } from '@/app/[locale]/(website)/(Index)/custom/controls/location-picker-field';
import { getFormErrorMessages } from '@/lib/helper/get-form-error.helper';
import { buildFlightSearchUrl, FlightSearchQuery } from '@/lib/types/flight-search/flight-search-url';
import { parseFlightSearchParams } from '@/lib/types/flight-search/flight-search-parser';
import { getErrorMessage } from '@/utils/errors';
import { useFlightBookingStore } from '@/store/website/flight/flight-booking.store';

const FlightSession = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const flightForm = useForm<TFlightFormSchema>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      flightType: 'one_way',
      leavingFrom: undefined,
      goingTo: undefined,
      departureDate: undefined,
      returnDate: undefined,
      guestNumber: {
        adult: 1,
        child: 0,
        isInfant: false,
        type: 'economy',
        totalGuest: 1,
      },
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = flightForm;

  const setSearchURL = useFlightBookingStore((state) => state.setFlightSearchUrl);

  useEffect(() => {
    const searchParamsProfile = Object.fromEntries(searchParams.entries()) as FlightSearchQuery;
    const parsed = parseFlightSearchParams(watch('flightType'), searchParamsProfile);

    if (Object.keys(parsed).length > 0) {
      flightForm.reset(parsed);
    }
  }, [flightForm, searchParams, watch]);

  const errorMessages = useMemo(() => getFormErrorMessages(errors), [errors]);

  const adultNumber = watch('guestNumber.adult');
  const childNumber = watch('guestNumber.child');
  watch('guestNumber.type');
  const flightType = watch('flightType');

  useEffect(() => {
    setValue('guestNumber.totalGuest', adultNumber + childNumber, { shouldValidate: true });
  }, [adultNumber, childNumber, setValue]);

 const handleAdultUpdate = (isAddition: boolean) => {
    const next = Math.max(0, adultNumber + (isAddition ? 1 : -1));
    setValue('guestNumber.adult', next);
    };

    const handleChildUpdate = (isAddition: boolean) => {
    const next = Math.max(0, childNumber + (isAddition ? 1 : -1));
    setValue('guestNumber.child', next);
    };

  const handleFlightInit = async (data: TFlightFormSchema) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const flight_search_url = buildFlightSearchUrl(data.flightType, data);
      setSearchURL(flight_search_url);
      router.push(flight_search_url);
    } catch (err) {
      const message = getErrorMessage(err);
      console.log('FlightSession component form:', message);
    }
  };

  return (
    <div className='py-4 flex flex-col gap-1 items-start'>
      <RadioGroupField<TFlightFormSchema>
        name='flightType'
        control={control}
        options={flight_options}
        orientation='horizontal'
      />
      <div className='flight-content w-full'>
        <Card className='w-full py-0 px-2 border-none rounded-none shadow-none lg:border lg:rounded-xl'>
          {errorMessages.length > 0 && (
            <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-4'>
              <ul className='list-disc pl-5 space-y-1 text-sm text-red-700'>
                {errorMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
          <Form {...flightForm}>
            <form onSubmit={handleSubmit(handleFlightInit)}>
              <div className='flex flex-col items-start lg:flex-row lg:items-center gap-6 lg:h-24 lg:divide-x lg:divide-gray-300 w-full'>
                <RHFLocationPicker<TFlightFormSchema> control={control} name='leavingFrom' label='Leaving from?' />
                <RHFLocationPicker<TFlightFormSchema> control={control} name='goingTo' label='Going to?' />
                <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row items-start w-full lg:w-fit'>
                  <DatePickerField<TFlightFormSchema>
                    name='departureDate'
                    label='Departure Date'
                    control={control}
                    placeholder='Select Date...'
                    disablePrevious
                  />
                  {flightType === 'round_trip' && (
                    <DatePickerField<TFlightFormSchema>
                      name='returnDate'
                      label='Return Date'
                      control={control}
                      placeholder='Select Date...'
                      disablePrevious
                    />
                  )}
                </div>
                <FormField
                  control={control}
                  name='guestNumber'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'ghost'}
                              className='w-full flex justify-between overflow-x-hidden border-0 border-b-2 rounded-none lg:border-b-0 text-left font-normal p-0 h-auto shadow-none hover:bg-gray-50'
                            >
                              <div className='flex-1 flex flex-col'>
                                <span className='mx-1 text-sm lg:text-xs font-medium text-gray-500'>Guest Profile</span>
                                <div className='flex items-center box-border cursor-pointer text-sm lg:text-xs h-auto leading-10 rounded px-0 py-0'>
                                  {field.value.totalGuest > 0 ? (
                                    <span className='w-full overflow-hidden whitespace-nowrap font-normal text-[#051a37] text-sm lg:text-[9px]'>
                                      {`${field.value.totalGuest} Guest expected, ${field.value.type}`}
                                    </span>
                                  ) : (
                                    <span className='font-medium text-gray-600 text-sm lg:text-xs'>
                                      Select Profile...
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronDown className='ml-2 h-4 w-4' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-[220px] flex items-center justify-center overflow-hidden p-0'>
                            <div className='w-full flex flex-col gap-4 px-4 py-6'>
                              <div className='flex items-center justify-center space-x-2'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-6 w-6 shrink-0 rounded-full text-gray-600 disabled:text-gray-400 cursor-pointer disabled:cursor-default'
                                  onClick={() => handleAdultUpdate(false)}
                                  disabled={adultNumber <= 0}
                                >
                                  <Minus />
                                  <span className='sr-only'>Decrease Adult</span>
                                </Button>
                                <div className='flex-1 text-center'>
                                  <div className='text-lg font-bold tracking-tighter'>{adultNumber}</div>
                                  <div className='text-gray-500 text-[10px] uppercase'>Adults</div>
                                </div>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-6 w-6 shrink-0 rounded-full text-gray-600 disabled:text-gray-400 cursor-pointer disabled:cursor-default'
                                  onClick={() => handleAdultUpdate(true)}
                                  disabled={adultNumber >= 50}
                                >
                                  <Plus />
                                  <span className='sr-only'>Increase Adult</span>
                                </Button>
                              </div>
                              <div className='flex items-center justify-center space-x-2'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-6 w-6 shrink-0 rounded-full text-gray-600 disabled:text-gray-400 cursor-pointer disabled:cursor-default'
                                  onClick={() => handleChildUpdate(false)}
                                  disabled={childNumber <= 0}
                                >
                                  <Minus />
                                  <span className='sr-only'>Decrease Child</span>
                                </Button>
                                <div className='flex-1 text-center'>
                                  <div className='text-lg font-bold tracking-tighter'>{childNumber}</div>
                                  <div className='text-gray-500 text-[10px] uppercase'>
                                    {childNumber > 1 ? 'Children' : 'Child'}
                                  </div>
                                </div>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-6 w-6 shrink-0 rounded-full text-gray-600 disabled:text-gray-400 cursor-pointer disabled:cursor-default'
                                  onClick={() => handleChildUpdate(true)}
                                  disabled={childNumber >= 50}
                                >
                                  <Plus />
                                  <span className='sr-only'>Increase Child</span>
                                </Button>
                              </div>
                              <div className='block'>
                                <FormField
                                  control={control}
                                  name='guestNumber.type'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Flight' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CabinClassSchema.options.map((cabin) => (
                                              <SelectItem key={cabin} value={cabin}>
                                                {CABIN_CLASS_LABELS[cabin]}
                                              </SelectItem>
                                            ))}
                                            {/* {typeConst.map((item) => (
                                              <SelectItem key={item} value={item}>
                                                {item}
                                              </SelectItem>
                                            ))} */}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                ></FormField>
                              </div>
                              <div className='block'>
                                <FormField
                                  control={control}
                                  name='guestNumber.isInfant'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className='flex items-center space-x-2'>
                                          <Switch
                                            id='is-infant-mode'
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                          />
                                          <Label htmlFor='is-infant-mode'>Include Infant</Label>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                ></FormField>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full lg:w-fit lg:mx-4 bg-[#E63A24] py-5 px-4 hover:bg-orange-700 rounded-xl text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Search className='w-6 h-6' />
                      <span className='block lg:hidden'>Search</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default FlightSession;
