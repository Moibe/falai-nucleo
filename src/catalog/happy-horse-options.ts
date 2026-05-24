export type HappyHorseOption = {
  slug: string;
  label: string;
};

export const HAPPY_HORSE_OPTIONS: HappyHorseOption[] = [
  { slug: 'image-to-video', label: 'Image / Text to Video' },
  { slug: 'reference-to-video', label: 'Reference to Video' },
  { slug: 'video-edit', label: 'Edit Video' }
];
