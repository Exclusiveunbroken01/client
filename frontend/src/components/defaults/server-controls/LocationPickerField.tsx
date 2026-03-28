'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandInput, CommandItem, CommandGroup, CommandList, CommandEmpty } from '@/components/ui/command';
import { useDebounceControlFn } from '@/lib/hooks/context/useDebounceControl.hook';
import { apiClient } from '@/lib/api/apiClient';
import { Airport, AirportListResponse } from '@/lib/types/server/airport.types';
import { Button } from '@/components/ui/button';

// utils to replace Tiqwa recent searches
import { addRecentSearch, getRecentSearches } from '@/lib/utils/recent-searches.util';

interface ILocationPickerProps {
  value?: string;
  onSelect: (cityCode: string, airport: Airport) => void;
}

export function LocationPickerField({ value, onSelect }: ILocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AirportListResponse>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<AirportListResponse>([]);

  const { debounced } = useDebounceControlFn(async (q: string) => {
    try {
      setLoading(true);
      const data = await apiClient<AirportListResponse>('/flights/airports', {
        query: { keyword: q },
      });
      setResults(data);
    } catch (err) {
      console.error('Airport search failed', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  function handleSelect(airport: Airport) {
    addRecentSearch(airport);
    setRecent(getRecentSearches());
    if (airport.city_code) {
      onSelect(airport.city_code, airport);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{value ?? 'Select city'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a destination</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder='Search city or country...'
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              debounced(v);
            }}
          />
          <CommandList>
            {recent.length > 0 && (
              <CommandGroup heading='Recent'>
                {recent.map((airport) => (
                  <CommandItem key={airport.iata_code} onSelect={() => handleSelect(airport)}>
                    {airport.city}, {airport.country} ({airport.city_code})
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading='Results'>
              {loading && <CommandItem disabled>Searching…</CommandItem>}
              {!loading && results.length === 0 && <CommandEmpty>No results found</CommandEmpty>}
              {results.map((airport) => (
                <CommandItem key={airport.iata_code} onSelect={() => handleSelect(airport)}>
                  {airport.city}, {airport.country} ({airport.city_code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
