# Quick Start Dev Env

```
npm install
npx prisma migrate dev
npm run dev
```

# Overview

Visualize the Discord servers you are part of in a graph.

Things that were done:

- A simple graph with floating nodes that represent each server.
- Show server icon if available. Include GIF if available.
- Show server name.
- Add Discord OAUTH2 sign in process with NextAuth.

Things that could have been done better:

- Code is not easy to read. Specially the functions that generate the graph.
- Interactivity with the nodes. Such as clicking on them to share/show more detail information.
- Render size of node base on the population of a server.
- Take better use of the force simulation provided by D3.

# Why build this?

We wanted to take this opportunity to challenge ourselves with something unfamiliar. Data visualization and OAUTH2.
