'use client';

import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';
import { RootState, AppDispatch } from './redux/store';
import { setSearchValue } from './redux/features/search/searchSlice';

export default function NavbarWrapper() {
  const dispatch = useDispatch<AppDispatch>();
  const searchValue = useSelector((state: RootState) => state.search.searchValue);

  return (
    <Navbar
      searchValue={searchValue}
      setSearchValue={(val: string) => dispatch(setSearchValue(val))}
    />
  );
}
