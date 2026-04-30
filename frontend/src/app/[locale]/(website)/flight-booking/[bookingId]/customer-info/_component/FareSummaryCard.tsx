'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { ConfirmPriceResponseData } from '@/lib/types/flight-booking/confirm-price.types';
import { formatNGN, truncateText } from '@/lib/helper/string-manipulator.helper';
import { FlightSearchQuery } from '@/lib/types/flight-search/flight-search-url';
import { PlaneIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

type FareSummaryProps = {
  data: ConfirmPriceResponseData;
  params: FlightSearchQuery;
};

const FareSummaryCard = ({ data, params }: FareSummaryProps) => {
  const first = data.outbound?.[0];
  const last = data.outbound?.[data.outbound.length - 1];

  const travellers =
    Number(params.adult ?? 0) + Number(params.child ?? 0);

  const cityFrom =
    first?.airport_from_details?.city ?? params.from_code;

  const cityTo =
    last?.airport_to_details?.city ?? params.to_code;

  const departureTime =
    first?.departure_time
      ? format(new Date(first.departure_time), 'HH:mm')
      : '--:--';

  const markup =
    typeof data.pricing.markup === 'object'
      ? data.pricing.markup?.markup_value ?? 0
      : Number(data.pricing.markup ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="lg:sticky lg:top-24 h-fit"
    >
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Price details</h3>

          <div className="space-y-2">
            <p className="font-semibold text-base text-gray-700">
              Flight
            </p>

            <div className="flex items-start gap-1 mt-3">
              <PlaneIcon width={12} height={12} />
              <span className="font-medium text-sm text-gray-600">
                {truncateText(cityFrom, 16)} ({params.from_code}) to{' '}
                {truncateText(cityTo, 16)} ({params.to_code})
              </span>
            </div>

            <div className="flex items-start gap-1">
              <span className="text-sm text-gray-600">
                Departure date:
              </span>
              <span className="text-sm text-gray-500">
                {params.departure}
              </span>
              <span className="text-sm text-gray-500">
                {departureTime}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-base text-gray-700">
              Flight Pricing Summary
            </p>

            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>Base Fare</span>
                <span className="text-xs text-gray-500">
                  for {travellers}{' '}
                  {travellers > 1 ? 'travellers' : 'traveller'}
                </span>
              </div>

              <span>{formatNGN(data.pricing.base_fare)}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>{formatNGN(data.pricing.tax)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>{formatNGN(markup)}</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatNGN(data.pricing.payable)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FareSummaryCard;
