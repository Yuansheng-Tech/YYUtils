import React, { useCallback, useState, useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import fetch from './fetch';

export interface DataProviderQuery {
  method: keyof Taro.request.method | undefined;
  url: string;
  body: object;
}

export interface UseQueryOptions {
  action?: string;
  enabled?: boolean;
  // onSuccess?: OnSuccess | DeclarativeSideEffect;
  // onFailure: onFailure | DeclarativeSideEffect;
}

export interface UseQueryValue {
  data?: any;
  page?: {
    count: number;
  };
  statusCode?: number;
  message?: string;

  error?: any;
  loading: boolean;
  loaded?: boolean;
  refetch?: () => void;
}

export function useSafeSetState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initialState);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeSetState = useCallback(
    (args) => {
      if (mountedRef.current) {
        return setState(args);
      }
    },
    [mountedRef, setState]
  );

  return [state, safeSetState];
}

export const useQuery = (query: DataProviderQuery, options: UseQueryOptions): UseQueryValue => {
  const { method = 'GET', url, body = {} } = query;
  const { ...otherOptions } = options;
  // const version = userVersion();
  const [innerVersion, setInnerVersion] = useState(0);

  const refetch = useCallback(() => {
    setInnerVersion((preInnerVersion) => preInnerVersion + 1);
  }, []);

  const requestSignature = JSON.stringify({
    query,
    options: otherOptions,
    // version,
    innerVersion,
  });

  const [state, setState] = useSafeSetState<UseQueryValue>({
    data: undefined,
    error: null,
    loading: true,
    loaded: false,
    refetch,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    fetch({
      url: url,
      data: body,
      method: method,
    })
      .then((result) => {
        console.log('result', result);
        // const {
        //   data
        // } = result
        setState({
          ...result,
          loading: false,
          loaded: true,
          refetch,
        });
      })
      .catch((error) => {
        setState({
          error,
          loading: false,
          loaded: false,
          refetch,
        });
      });
  }, [requestSignature, setState]);

  return state;
};

export const useQueryWithStore = () => {
  return {
    data: '',
    loading: '',
    error: '',
  };
};
