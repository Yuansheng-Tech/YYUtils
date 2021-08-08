import React, { useState, useEffect } from 'react';
import { createProvider } from './Provider';

interface IViewContext {
  getData(options: { url: string; method: string; payload: any }): {
    data: Object[];
    isLoading: boolean;
  };
}

export const ProviderViewContextName = 'ProviderView';

export const ProviderView = createProvider<IViewContext>({
  name: ProviderViewContextName,
  create() {
    return {
      getData({ url, method, payload }) {
        const [data, setData] = useState<Object[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);

        useEffect(() => {
          setIsLoading(true);

          Taro.request<Object[]>({
            url,
            data: payload,
            header: {
              method,
            },
          })
            .then((result) => {
              setData(result.data);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, []);

        return {
          data,
          isLoading,
        };
      },
    };
  },
});
