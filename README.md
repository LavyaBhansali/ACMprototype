# ACM DJ Sanghvi — 3D Cinematic Prototype

A scroll-driven 3D concept prototype for the ACM student chapter at DJ Sanghvi College of Engineering. The user controls a 3D camera moving through a cinematic world via page scrolling, transitioning into a 2D website interface.

## Tech Stack

- **Framework**: React 18 + Vite
- **3D & Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Post-Processing**: `@react-three/postprocessing` (Bloom, Vignette)
- **Typography**: Space Grotesk

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

## What Has Been Done

- **World 1 (Space)**:
  - 3D "ACM — DJ Sanghvi College of Engineering" hero title that rises overhead on scroll.
  - 4,000 instanced twinkling stars and procedural GLSL simplex noise nebulae.
  - 5 themed space objects (Research, Projects, Events, Community, Achievements) with proximity labels.
- **World 2 (Futuristic Dark City)**:
  - Procedural dark city at night with asphalt road, sidewalks, and streetlights.
  - 150 instanced background buildings with canvas-generated window textures.
  - 6 featured department buildings with pulsing accent strips and interactive labels.
- **Transition Zone**:
  - Camera descent and tilt from space towards the city skyline.
  - Dynamic atmospheric fog that activates as the camera approaches the city.
- **2D Website Interface**:
  - Clicking any building label opens the 2D ACM chapter website for that department.
  - "Return to Journey" button returns camera view back to the 3D street.

## What Has To Be Done

- **Non-Linear Space Traversal**: Update space camera movement to weave dynamically left and right rather than a linear forward path.
- **Earth Arrival**: Introduce a very large Earth in the center at the end of the space section.
- **Night-Side Entry**: Approach and enter through the dark side of the Earth at night.
- **Fast Cloud Rush**: Implement a rapid rush effect through atmospheric clouds before landing on the city street.
