import { useEffect, useMemo, useRef, useState } from "react";

export const useXMLHttpRequest = (inputUrl: string | undefined, debug: boolean) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [response, setResponse] = useState<string>();

    const request = useMemo(() => {
        const xhr = new XMLHttpRequest();

        if (debug) {
            xhr.addEventListener('loadstart', handleEvent);
            xhr.addEventListener('load', (e) => {
                handleEvent(e);
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    setResponse(xhr.response);
                }
            });
            xhr.addEventListener('progress', handleEvent);
            xhr.addEventListener('error', handleEvent);
            xhr.addEventListener('abort', handleEvent);
            xhr.addEventListener('timeout', handleEvent);
        } else {
            xhr.addEventListener('load', () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    setResponse(xhr.response);
                }
            });
            xhr.addEventListener('abort', () => { console.log('Fetch was aborted.') });
        }

        return xhr;
    }, [debug, setResponse]);

    const getPokemon = useMemo(() => {
        return (url: string) => {
            request.open('GET', url);
            request.setRequestHeader('Cache-Control', 'no-cache');
            request.send();
        };
    }, [request]);

    useEffect(() => {
        if (!!timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        if (!inputUrl) {
            return;
        }

        request.abort();

        timeoutRef.current = setTimeout(() => {
            getPokemon(inputUrl);
        }, 2000);

        return () => {
            if (!!timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [getPokemon, inputUrl, request]);

    return response;
}

function handleEvent(e: ProgressEvent<XMLHttpRequestEventTarget>) {
    console.log(`${e.type}: ${e.loaded} bytes transferred\n`);
}