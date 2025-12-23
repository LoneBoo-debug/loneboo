export const LOCAL_ASSET_MAP: Record<string, string> = {
  // UI & LOGHI
  "https://lh3.googleusercontent.com/d/1jnecFUan677BId1slOSsP532hZ_DKWee": "assets/images/ui/logo-main.webp",
  "https://i.postimg.cc/tCZGcq9V/official.png": "assets/images/ui/official.webp",
  "https://i.postimg.cc/9M6v55V8/logsede.png": "assets/images/ui/home-icon.webp",
  "https://i.postimg.cc/SKdgjcXW/ghhhhost.png": "assets/images/ui/hero-boo-float.webp",
  "https://i.postimg.cc/P5NtznBj/Immagine-2025-12-05-dd090957.png": "assets/images/ui/btn-city.webp",
  "https://i.postimg.cc/nV79BBqS/Immagine-2025-12-05-0dd90736.png": "assets/images/ui/btn-house.webp",
  "https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png": "assets/images/ui/btn-close.webp",

  // SFONDI PRINCIPALI
  "https://i.postimg.cc/vBmvH8Nw/dfggsh.jpg": "assets/images/bg/home-mobile.webp",
  "https://i.postimg.cc/j2RYjF7J/psfrdds.jpg": "assets/images/bg/home-desktop.webp",
  "https://i.postimg.cc/Hn1FHWYb/mappaa.png": "assets/images/bg/city-map-desktop.webp",
  "https://i.postimg.cc/bJtG5PNV/mappssa22.png": "assets/images/bg/city-map-mobile.webp",
  "https://i.postimg.cc/9F308yt9/houseplanss-(1).png": "assets/images/bg/house-map-mobile.webp",
  "https://i.postimg.cc/7YLR63CN/hpuse169.jpg": "assets/images/bg/house-map-desktop.webp",

  // SFONDI STANZE
  "https://i.postimg.cc/bNw01THX/cucina1692-(1).jpg": "assets/images/bg/rooms/kitchen-mobile.webp",
  "https://i.postimg.cc/tTtyjxgs/cuxdfr.jpg": "assets/images/bg/rooms/kitchen-desktop.webp",
  "https://i.postimg.cc/J41wZGh9/salotto1689.jpg": "assets/images/bg/rooms/living-mobile.webp",
  "https://i.postimg.cc/59BWYLb2/salotttreer.jpg": "assets/images/bg/rooms/living-desktop.webp",
  "https://i.postimg.cc/sxwjLq6j/stanzalettoh44.jpg": "assets/images/bg/rooms/bedroom-mobile.webp",
  "https://i.postimg.cc/6pVR2HTG/stanzadaletto.jpg": "assets/images/bg/rooms/bedroom-desktop.webp",
  "https://i.postimg.cc/448VtJVN/bagnitt.jpg": "assets/images/bg/rooms/bathroom-mobile.webp",
  "https://i.postimg.cc/cCGKGMks/bgno169.jpg": "assets/images/bg/rooms/bathroom-desktop.webp",
  "https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg": "assets/images/bg/rooms/garden.webp"
};

export const getAsset = (url: string): string => {
  if (!url) return "";
  
  // Se è già un percorso locale, non fare nulla
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;

  try {
      const forceRemote = localStorage.getItem('force_remote_assets') === 'true';
      if (forceRemote) return url;
  } catch (e) {}

  if (!LOCAL_ASSET_MAP) return url;
  return LOCAL_ASSET_MAP[url] || url;
};