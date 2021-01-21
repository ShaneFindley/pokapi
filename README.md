# Pokapi

### Requirements

* Create a react app using npx create-react-app my-app --template typescript   
* DO NOT INSTALL ANY OTHER PACKAGES   
* You don’t have to do any styling   
* Given the following code snippet, render URLS as buttons inside div.buttons element   
* By clicking on each button it must run the following procedure:   
  * wait for 2 seconds   
  * then send a get request to the corresponding URL   
  * dump the response inside pre.response element   
* Please do not cache the response!   
* Cancellation Procedure: considering that user can click on a different button while the previous Wait and Get procedure is running, we expect cancelling the previous process before running the new procedure.

### Information

App.tsx contains two options for requesting the data. To test XMLHttpRequest please uncomment this option.

```
import { useFetch } from './useFetch';
// import { useXMLHttpRequest } from './useXMLHttpRequest';

...

const response = useFetch(input);
  // const response = useXMLHttpRequest(input, false);
```