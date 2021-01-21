import { useEffect, useMemo, useRef, useState } from "react";

export const useXMLHttpRequest = (inputUrl: string | undefined, debug: boolean) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [response, setResponse] = useState<string>();

    const request = useMemo(() => {
        const xhr = new XMLHttpRequest();

        if (debug) {
            xhr.onloadstart = (e: ProgressEvent) => handleEvent(e);
            xhr.onload = (e: ProgressEvent) => {
                handleEvent(e);
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    setResponse(xhr.response);
                }
            };

            // Progress can be used to show the loading of larger datasets. 
            // This is more often useful on the xhr.upload.onprogress for POST calls.
            xhr.onprogress = (e) => handleEvent(e);

            xhr.onerror = (e) => setResponse(`Something bad happened: ${e}`);
            xhr.onabort = (e) => handleEvent(e);
            xhr.ontimeout = (e) => handleEvent(e);
        } else {
            xhr.onload = (e) => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    setResponse(xhr.response);
                }
            };
            xhr.onabort = () => console.log('Fetch was aborted.');
            xhr.onerror = (e) => setResponse(`Something bad happened: ${e}`);
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

        setResponse(undefined);
        timeoutRef.current = setTimeout(() => {
            getPokemon(inputUrl);
        }, 2000);

        return () => {
            if (!!timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [getPokemon, inputUrl, request, setResponse]);

    return response;
}

function handleEvent(e: ProgressEvent) {
    // Should the server be returning Content-Length then we could report the e.total value.
    console.log(`${e.type}: ${e.loaded} bytes transferred\n`);
}