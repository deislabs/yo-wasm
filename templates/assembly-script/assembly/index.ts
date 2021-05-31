import "wasi";

import { Console } from "as-wasi";

<% if (wagi) { %>Console.log("Content-Type: text/plain\n");
<% } %>Console.log("Hello, world!");
