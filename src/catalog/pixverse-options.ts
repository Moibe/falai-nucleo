// Versions disponibles por task. La idea: cada form acepta un dropdown que
// solo lista las versiones que realmente exponen ese task en fal.ai.

export type PixVerseVersion = 'v6' | 'c1' | 'v5.6' | 'v5.5' | 'v5' | 'v4.5';

export type PixVerseVersionOption = {
  value: PixVerseVersion;
  label: string;
  hint: string;
};

const ALL_VERSIONS: Record<PixVerseVersion, PixVerseVersionOption> = {
  v6: { value: 'v6', label: 'v6', hint: 'última gen — más caps' },
  c1: { value: 'c1', label: 'c1', hint: 'character consistency' },
  'v5.6': { value: 'v5.6', label: 'v5.6', hint: 'estable' },
  'v5.5': { value: 'v5.5', label: 'v5.5', hint: 'multi-clip + audio' },
  v5: { value: 'v5', label: 'v5', hint: 'económico' },
  'v4.5': { value: 'v4.5', label: 'v4.5', hint: 'legacy / cheaper' }
};

export const I2V_VERSIONS: PixVerseVersionOption[] = [
  ALL_VERSIONS.v6,
  ALL_VERSIONS.c1,
  ALL_VERSIONS['v5.6'],
  ALL_VERSIONS['v5.5'],
  ALL_VERSIONS.v5,
  ALL_VERSIONS['v4.5']
];

export const T2V_VERSIONS: PixVerseVersionOption[] = [
  ALL_VERSIONS.v6,
  ALL_VERSIONS.c1,
  ALL_VERSIONS['v5.6'],
  ALL_VERSIONS['v5.5'],
  ALL_VERSIONS.v5
];

export const TRANSITION_VERSIONS: PixVerseVersionOption[] = [
  ALL_VERSIONS.v6,
  ALL_VERSIONS.c1,
  ALL_VERSIONS['v5.6'],
  ALL_VERSIONS['v5.5'],
  ALL_VERSIONS.v5,
  ALL_VERSIONS['v4.5']
];

export const EFFECTS_VERSIONS: PixVerseVersionOption[] = [
  ALL_VERSIONS['v5.5'],
  ALL_VERSIONS.v5,
  ALL_VERSIONS['v4.5']
];

export type PixVerseOption = { slug: string; label: string };

export const PIXVERSE_OPTIONS: PixVerseOption[] = [
  { slug: 'image-to-video', label: 'Image / Text to Video' },
  { slug: 'transition', label: 'Transition' },
  { slug: 'extend', label: 'Extend Video' },
  { slug: 'reference-to-video', label: 'Reference to Video (c1)' },
  { slug: 'effects', label: 'Effects' },
  { slug: 'swap', label: 'Swap (face/object/bg)' },
  { slug: 'lipsync', label: 'Lipsync' }
];

// Effects superset (de v5.5). fal.ai resuelve por enum a través de versiones.
export const PIXVERSE_EFFECTS: string[] = [
  'Kiss Me AI', 'Kiss', 'Muscle Surge', 'Warmth of Jesus', 'Anything', 'Robot',
  'The Tiger Touch', 'Hug', 'Holy Wings', 'Microwave', 'Zombie Mode', 'Squid Game',
  'Baby Face', 'Black Myth: Wukong', 'Long Hair Magic', 'Leggy Run',
  'Fin-tastic Mermaid', 'Punch Face', 'Creepy Devil Smile', 'Thunder God',
  'Eye Zoom Challenge', "Who's Arrested?", 'Baby Arrived', 'Werewolf Rage',
  'Bald Swipe', 'BOOM DROP', 'Huge Cutie', 'Liquid Metal', 'Sharksnap!',
  'Dust Me Away', '3D Figurine Factor', 'Bikini Up', 'My Girlfriends',
  'My Boyfriends', 'Subject 3 Fever', 'Earth Zoom', 'Pole Dance', 'Vroom Dance',
  'GhostFace Terror', 'Dragon Evoker', 'Skeletal Bae', 'Summoning succubus',
  'Halloween Voodoo Doll', '3D Naked-Eye AD', 'Package Explosion',
  'Dishes Served', 'Ocean ad', 'Supermarket AD', 'Tree doll',
  'Come Feel My Abs', 'The Bicep Flex', 'London Elite Vibe',
  'Flora Nymph Gown', 'Christmas Costume', "It's Snowy", 'Reindeer Cruiser',
  'Snow Globe Maker', 'Pet Christmas Outfit', 'Adopt a Polar Pal',
  'Cat Christmas Box', 'Starlight Gift Box', 'Xmas Poster', 'Pet Christmas Tree',
  'City Santa Hat', 'Stocking Sweetie', 'Christmas Night',
  'Xmas Front Page Karma', "Grinch's Xmas Hijack", 'Giant Product',
  'Truck Fashion Shoot', 'Beach AD', 'Shoal Surround', 'Mechanical Assembly',
  'Lighting AD', 'Billboard AD', 'Product close-up', 'Parachute Delivery',
  'Dreamlike Cloud', 'Macaron Machine', 'Poster AD', 'Truck AD',
  'Graffiti AD', '3D Figurine Factory', 'The Exclusive First Class',
  'Art Zoom Challenge', 'I Quit', 'Hitchcock Dolly Zoom', 'Smell the Lens',
  'I believe I can fly', 'Strikout Dance', 'Pixel World', 'Mint in Box',
  'Hands up', 'Hand', 'Flora Nymph Go', 'Somber Embrace', 'Beam me up',
  'Suit Swagger'
];

export const PIXVERSE_LIPSYNC_VOICES = [
  'Auto', 'Emily', 'James', 'Isabella', 'Liam', 'Chloe',
  'Adrian', 'Harper', 'Ava', 'Sophia', 'Julia', 'Mason',
  'Jack', 'Oliver', 'Ethan'
] as const;

export type PixVerseStyle = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';

export const PIXVERSE_STYLES: { value: '' | PixVerseStyle; label: string }[] = [
  { value: '', label: '— ninguno —' },
  { value: 'anime', label: 'Anime' },
  { value: '3d_animation', label: '3D animation' },
  { value: 'clay', label: 'Clay' },
  { value: 'comic', label: 'Comic' },
  { value: 'cyberpunk', label: 'Cyberpunk' }
];
