import { useCallback, useEffect, useRef, useState } from "react";

export const useFetch = (inputUrl: string | undefined) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [response, setResponse] = useState<string>();

    const fetcher = useCallback(async (url, controller) => {
        return await fetch(url, { signal: controller.signal, cache: 'no-cache' })
          .then(response => response.json())
          .then(res => {
            setResponse(JSON.stringify(res));
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              console.log('Fetch was aborted.');
            } else {
              console.error(`Something bad happened: ${error}`);
              setResponse(error.message);
            }
          });
      }, []);

    console.log("blah");
    
      useEffect(() => {
        if (!!timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (!inputUrl) {
          return;
        }
    
        const controller = new AbortController();
    
        setResponse(undefined);
        timeoutRef.current = setTimeout(() => {
          fetcher(inputUrl, controller);
        }, 2000);
    
        return () => {
          if (!!timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          controller.abort();
        };
      }, [fetcher, inputUrl, setResponse]);

      return response;
}
