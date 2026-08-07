export interface Reel {
  /** Cloudinary public id, including the upload suffix. */
  id: string;
  /**
   * Optional caption shown on hover and in the lightbox. These reels are
   * standalone social work — they deliberately do NOT map to a case study, so
   * there is no slug or client link here. Fill these in as you go; a reel with
   * no label just shows its index.
   */
  label?: string;
}

/**
 * The vertical reel wall on /case-studies. Order is the display order — the
 * wall splits this list down the middle into two counter-scrolling rails.
 */
export const reels: Reel[] = [
  { id: 'vid-01_j76mdq' },
  { id: 'vid-02_podonv' },
  { id: 'vid-03_pr3mzw' },
  { id: 'vid-04_msrhdo' },
  { id: 'vid-05_zymaxe' },
  { id: 'vid-06_ondvoc' },
  { id: 'vid-07_z1qf07' },
  { id: 'vid-08_hboxfi' },
  { id: 'vid-09_asptxh' },
  { id: 'vid-10_lqjnoe' },
  { id: 'vid-11_sqzwpk' },
  { id: 'vid-12_wvmvwx' },
  { id: 'vid-13_sxnrwa' },
  { id: 'vid-14_hvqmdq' },
  { id: 'vid-15_bzoztz' },
  { id: 'vid-16_arlj4m' },
  { id: 'vid-17_st6xlp' },
  { id: 'vid-18_lz2zbt' },
];
