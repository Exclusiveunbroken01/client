// src/app/(website)/(Index)/(mobile)/_component/HeroSectionMobile

import { ITabItemMB } from '@/types/default.type';
import React from 'react';
import { FaPlaneDeparture, FaHome, FaCar } from 'react-icons/fa';
import HeroTabPanelMobile from './HeroTabPanelMobile';
import FlightSession from '@/components/flight/FlightSession';
import HotelHomes from '../../custom/HotelHomes';
import CarRentals from '../../custom/CarRentals';
import { TbSocial } from 'react-icons/tb';
import AttractionTabContent from '@/components/website/attraction-tours/AttractionTabContent';
import { heroProfileData } from '@/lib/constants/home.constant';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const HeroSectionMobile = () => {
  const tabs: ITabItemMB[] = [
    {
      label: 'Flight',
      value: 'flight',
      icon: <FaPlaneDeparture />,
      content: <FlightSession />,
    },
    {
      label: 'Hotel',
      value: 'hotel_home',
      icon: <FaHome />,
      content: <HotelHomes />,
    },
    {
      label: 'Car',
      value: 'car',
      icon: <FaCar />,
      content: <CarRentals />,
    },
    {
      label: 'Attraction',
      value: 'attractions',
      icon: <TbSocial />,
      content: <AttractionTabContent />,
    },
  ];
  const t = useTranslations('IndexPage');
  return (
    <section className='flex flex-col items-center w-full py-10 px-0'>
      <div className='container row-rep py-10 px-8'>
        <div className='pb-0'>
          <div className='w-full flex flex-col justify-center items-center gap-1'>
            <div className='w-full max-w-xl flex flex-row justify-center gap-2 my-1 border rounded-xl bg-gray-600 p-3'>
              {heroProfileData.map((profile, index) => (
                <div key={profile.name} className='px-4 flex items-center gap-0 w-full'>
                  <Separator orientation='vertical' className={index === 0 ? ' hidden' : ''} />
                  <Link
                    href={profile.link ? profile.link : '#'}
                    className='w-fit mx-auto hover:bg-transparent cursor-pointer hover:scale-110 px-1 text-gray-100 hover:text-gray-300 text-center'
                  >
                    <span className='font-semibold text-center text-xs leading-[150%]'>{t(`menu.${profile.key}`)}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col py-0 px-3 items-start gap-5 w-full'>
        <HeroTabPanelMobile tabs={tabs} />
      </div>
    </section>
  );
};

export default HeroSectionMobile;
