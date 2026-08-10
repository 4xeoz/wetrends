export interface FoodPhoto {
  src: string;
  /** Intrinsic pixel size — the masonry lays each frame out at its own aspect
   *  ratio rather than cropping, so next/image needs the real numbers. */
  width: number;
  height: number;
}

export interface FoodShoot {
  slug: string;
  /** Display index, e.g. "01". */
  number: string;
  /**
   * Shoots are titled by what was on the plate, never by who commissioned them
   * — several of these are platform and white-label jobs we don't name. The
   * files under /public/food are renamed for the same reason: a client name in
   * an <img src> is still a client name.
   */
  title: string;
  /** Coarse job type: "Delivery menu", "Restaurant menu", "Full menu set". */
  category: string;
  /** Total frames published, header + singles. */
  frames: number;
  /** The multi-item header composition — cover on the index, hero on detail. */
  hero: FoodPhoto;
  /** Everything else, in gallery order. */
  photos: FoodPhoto[];
}

/**
 * Order here is the display order on /food-photography.
 *
 * Each shoot ships as one "header" (a styled multi-item composition, used as
 * the cover) plus a run of single-item frames. That split comes from how the
 * work is actually delivered: the header sells the menu, the singles sell the
 * individual line items.
 */
export const foodShoots: FoodShoot[] = [
  {
    slug: 'burgers',
    number: '01',
    title: 'Burgers',
    category: 'Delivery menu',
    frames: 6,
    hero: { src: '/food/burgers/header-01.avif', width: 1056, height: 598 },
    photos: [
      { src: '/food/burgers/01.avif', width: 962, height: 858 },
      { src: '/food/burgers/02.avif', width: 978, height: 858 },
      { src: '/food/burgers/03.avif', width: 888, height: 598 },
      { src: '/food/burgers/04.avif', width: 712, height: 484 },
      { src: '/food/burgers/05.avif', width: 724, height: 480 },
    ],
  },
  {
    slug: 'salads',
    number: '02',
    title: 'Salads',
    category: 'Delivery menu',
    frames: 8,
    hero: { src: '/food/salads/header-01.avif', width: 1958, height: 1098 },
    photos: [
      { src: '/food/salads/01.avif', width: 480, height: 322 },
      { src: '/food/salads/02.avif', width: 480, height: 322 },
      { src: '/food/salads/03.avif', width: 480, height: 322 },
      { src: '/food/salads/04.avif', width: 480, height: 322 },
      { src: '/food/salads/05.avif', width: 480, height: 322 },
      { src: '/food/salads/06.avif', width: 480, height: 322 },
      { src: '/food/salads/07.avif', width: 480, height: 322 },
    ],
  },
  {
    slug: 'bowls-and-thai-mains',
    number: '03',
    title: 'Bowls & Thai Mains',
    category: 'Restaurant menu',
    frames: 5,
    hero: {
      src: '/food/bowls-and-thai-mains/header-01.avif',
      width: 1960,
      height: 1114,
    },
    photos: [
      { src: '/food/bowls-and-thai-mains/01.avif', width: 744, height: 496 },
      { src: '/food/bowls-and-thai-mains/02.avif', width: 1200, height: 800 },
      { src: '/food/bowls-and-thai-mains/03.avif', width: 974, height: 652 },
      { src: '/food/bowls-and-thai-mains/04.avif', width: 974, height: 652 },
    ],
  },
  {
    slug: 'kebabs',
    number: '04',
    title: 'Kebabs',
    category: 'Restaurant menu',
    frames: 5,
    hero: { src: '/food/kebabs/header-01.avif', width: 1960, height: 1104 },
    photos: [
      { src: '/food/kebabs/01.avif', width: 720, height: 486 },
      { src: '/food/kebabs/02.avif', width: 1084, height: 698 },
      { src: '/food/kebabs/03.avif', width: 854, height: 698 },
      { src: '/food/kebabs/04.avif', width: 720, height: 486 },
    ],
  },
  {
    // Three headers came with this set; header-03 is the only one shot large
    // enough to hold a full-bleed hero, so the other two drop into the grid.
    //
    // Two source frames (07, 10) are held back: the packaging in shot carries
    // the client's own logo, which no anonymised file path can hide. They are
    // kept out of /public entirely — an unlinked file under public/ is still a
    // public URL — and live in the gitignored photo-source/_withheld-branded/
    // in case a credit is ever cleared.
    slug: 'burgers-sandwiches-and-bowls',
    number: '05',
    title: 'Burgers, Sandwiches & Bowls',
    category: 'Full menu set',
    frames: 25,
    hero: {
      src: '/food/burgers-sandwiches-and-bowls/header-03.avif',
      width: 1264,
      height: 846,
    },
    photos: [
      { src: '/food/burgers-sandwiches-and-bowls/header-02.avif', width: 1166, height: 780 },
      { src: '/food/burgers-sandwiches-and-bowls/header-01.avif', width: 686, height: 550 },
      { src: '/food/burgers-sandwiches-and-bowls/01.avif', width: 972, height: 778 },
      { src: '/food/burgers-sandwiches-and-bowls/02.avif', width: 626, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/03.avif', width: 628, height: 506 },
      { src: '/food/burgers-sandwiches-and-bowls/04.avif', width: 648, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/05.avif', width: 482, height: 384 },
      { src: '/food/burgers-sandwiches-and-bowls/06.avif', width: 638, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/08.avif', width: 1294, height: 1038 },
      { src: '/food/burgers-sandwiches-and-bowls/09.avif', width: 1312, height: 954 },
      { src: '/food/burgers-sandwiches-and-bowls/11.avif', width: 648, height: 470 },
      { src: '/food/burgers-sandwiches-and-bowls/12.avif', width: 638, height: 510 },
      { src: '/food/burgers-sandwiches-and-bowls/13.avif', width: 638, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/14.avif', width: 628, height: 506 },
      { src: '/food/burgers-sandwiches-and-bowls/15.avif', width: 482, height: 384 },
      { src: '/food/burgers-sandwiches-and-bowls/16.avif', width: 626, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/17.avif', width: 974, height: 778 },
      { src: '/food/burgers-sandwiches-and-bowls/18.avif', width: 638, height: 510 },
      { src: '/food/burgers-sandwiches-and-bowls/19.avif', width: 972, height: 778 },
      { src: '/food/burgers-sandwiches-and-bowls/20.avif', width: 482, height: 384 },
      { src: '/food/burgers-sandwiches-and-bowls/21.avif', width: 638, height: 472 },
      { src: '/food/burgers-sandwiches-and-bowls/22.avif', width: 628, height: 506 },
      { src: '/food/burgers-sandwiches-and-bowls/23.avif', width: 482, height: 384 },
      { src: '/food/burgers-sandwiches-and-bowls/24.avif', width: 688, height: 550 },
    ],
  },
];

export function getFoodShootBySlug(slug: string) {
  return foodShoots.find((shoot) => shoot.slug === slug);
}

export function getAllFoodShootSlugs() {
  return foodShoots.map((shoot) => shoot.slug);
}

/** Wraps, so the last shoot points back at the first. */
export function getNextFoodShoot(slug: string) {
  const i = foodShoots.findIndex((shoot) => shoot.slug === slug);
  if (i === -1) return undefined;
  return foodShoots[(i + 1) % foodShoots.length];
}

export const totalFoodFrames = foodShoots.reduce((sum, s) => sum + s.frames, 0);
