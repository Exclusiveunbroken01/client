'use client';

import { useEffect, useMemo, useState } from 'react';
import { Command, CommandInput, CommandItem, CommandGroup } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounceControlFn } from '@/lib/hooks/context/useDebounceControl.hook';
import { apiClient } from '@/lib/api/apiClient';
import { Airport, AirportLocationValue } from '@/lib/types/server/airport.types';
import { addRecentSearch, getRecentSearches } from '@/lib/utils/recent-searches.util';

interface LocationPickerProps {
  value?: AirportLocationValue;
  onChange: (value: AirportLocationValue) => void;
}

export function LocationPickerField2({ value, onChange }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [recent, setRecent] = useState<AirportLocationValue[]>([]);
  const { debounced } = useDebounceControlFn(async (q: string) => {
    if (!q) return;
    try {
      const data = await apiClient<Airport[]>('/flights/airports', { query: { keyword: q } });
      setResults(data);
    } catch (err) {
      console.error('Airport search failed', err);
      setResults([]);
    }
  }, 400);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const grouped = useMemo(() => {
    return results.reduce<Record<string, AirportLocationValue[]>>((acc, airport) => {
      if (!acc[airport.country]) acc[airport.country] = [];
      acc[airport.country].push({
        city: airport.city,
        city_code: airport.city_code,
        country: airport.country,
      });
      return acc;
    }, {});
  }, [results]);

  const orderedCountries = useMemo(() => {
    const keys = Object.keys(grouped);
    return keys.sort();
  }, [grouped]);

  function handleSelect(item: AirportLocationValue) {
    addRecentSearch(item);
    setRecent(getRecentSearches());
    onChange(item);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          role='combobox'
          className='w-full lg:w-50 text-sm leading-[150%] text-gray-600 justify-start border-0 border-b-2 rounded-none lg:border-b-0 text-left p-0 shadow-none hover:bg-gray-50 cursor-pointer'
        >
          {value ? `${value.city} (${value.country})` : 'Select city'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a destination</DialogTitle>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput placeholder='Search city or country...' value={query} onValueChange={(v) => { setQuery(v); debounced(v); }} />
          <ScrollArea className='h-72'>
            {recent.length > 0 && !query && (
              <CommandGroup heading='Recent'>
                {recent.map((item, idx) => (
                  <CommandItem key={`${item.city_code}_${idx}`} onSelect={() => handleSelect(item)}>
                    {item.city}, {item.country} ({item.city_code})
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {orderedCountries.map((country, idx) => (
              <CommandGroup key={`${country}_${idx}`} heading={country} className='py-2'>
                <div className='grid grid-cols-[repeat(1,80px)] lg:grid-cols-[repeat(2,220px)]'>
                  {grouped[country]
                    .sort((a, b) => a.city.localeCompare(b.city))
                    .map((item, idx1) => (
                      <CommandItem
                        key={`${item.city_code}_${idx1}`}
                        value={`${item.city} ${item.city_code}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <div className='space-y-0'>
                          <div className='w-full flex flex-row gap-1'>
                            <h6 className='text-sm leading-[150%] text-neutral-800'>{item.city}</h6>
                            <span className='text-muted-foreground text-xs'>({item.city_code})</span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </div>
              </CommandGroup>
            ))}
          </ScrollArea>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
