import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setTrackOutOfPocket as setTrackOutOfPocketAction } from '@/store/preferencesSlice';
import { RootState } from '@/store/store';

export function usePreferences() {
  const dispatch = useDispatch();
  const trackOutOfPocket = useSelector(
    (state: RootState) => state.preferences?.trackOutOfPocket ?? false,
  );

  const setTrackOutOfPocket = useCallback(
    (value: boolean) => {
      dispatch(setTrackOutOfPocketAction(value));
    },
    [dispatch],
  );

  return {
    trackOutOfPocket,
    setTrackOutOfPocket,
  };
}
