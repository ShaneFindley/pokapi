import React, { useState, useMemo } from 'react';
import { useFetch } from './useFetch';
// import { useXMLHttpRequest } from './useXMLHttpRequest';

const URLS = [
  "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100",
  "https://pokeapi.co/api/v2/pokemon?offset=100&limit=100",
  "https://pokeapi.co/api/v2/pokemon?offset=200&limit=100"
];

const App: React.FC = () => {

  const [input, setInput] = useState<string>();

  // Here you have 2 options, please uncomment to compare.
  const response = useFetch(input);
  // const response = useXMLHttpRequest(input, false);

  const buttons = useMemo(() =>
    URLS.map((o, k) => <button key={k} onClick={() => setInput(o)} value={o}>{o}</button>), []);

  return (
    <div>
      <div className="buttons">
        { buttons }
      </div>
      <pre className="response">
        { response }
      </pre>
    </div>
  );
}

export default App;