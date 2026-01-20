# 9 Years Anniversary

A romantic digital love letter website built with Next.js, Three.js, and Framer Motion.

## Setup

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Locally:**
   ```bash
   npm run dev
   ```

## Adding Photos

This website is designed to display 25 photos in the "Memory Gallery" section.

The photos are currently located in `public/images/` and follow a mixed naming convention (e.g., `1.JPG`, `6.jpeg`).

If you want to add more photos, you will need to:

1. Add the photo to `public/images/`.
2. Update the `photos` array in `components/sections/Gallery.tsx` to include the new file.

## Customization

- **Milestones**: Edit `components/sections/Timeline.tsx` to change the yearly memories.
- **Love Letter**: Edit `components/sections/LoveLetter.tsx` to change the final message.
- **Visuals**: Tailwind theme variables are in `app/globals.css`.
