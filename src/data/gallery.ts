/* =============================================================
   GALLERY
   Replace `src` with a real image path (put files in /public/gallery)
   and keep `alt` meaningful. `span` drives the editorial rhythm of
   the album: 'wide' and 'tall' images anchor the composition,
   'small' ones fill the quieter beats.

   With `src: null` the frame renders as an empty album plate — a
   deliberate placeholder, not a broken image.
   ============================================================= */

export type GalleryItem = {
  id: string;
  src: string | null;
  alt: string;
  caption?: string;
  span: 'wide' | 'tall' | 'small';
  /** −4…4 degrees. Keeps the album feeling hand-laid rather than gridded. */
  tilt: number;
  /** 0…1 — how far this plate drifts against the scroll. */
  depth: number;
};

/** Shown under the album while it is still empty. */
export const galleryNote = 'Photographs to follow';

export const galleryItems: readonly GalleryItem[] = [
  { id: 'g1', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'tall', tilt: -2.5, depth: 0.75 },
  { id: 'g2', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'wide', tilt: 1.5, depth: 0.35 },
  { id: 'g3', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'small', tilt: 3, depth: 0.9 },
  { id: 'g4', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'small', tilt: -3.5, depth: 0.5 },
  { id: 'g5', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'tall', tilt: 2, depth: 0.65 },
  { id: 'g6', src: null, alt: 'Photograph of Prithvi Raj and Harshini', span: 'wide', tilt: -1.5, depth: 0.25 },
];
