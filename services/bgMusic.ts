
let subMusicAudio: HTMLAudioElement | null = null;
const SUB_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diamond_tunes-spectral-resonance-269427.mp3';

export const getSubMusic = () => {
    if (!subMusicAudio) {
        subMusicAudio = new Audio(SUB_MUSIC_URL);
        subMusicAudio.loop = true;
        subMusicAudio.volume = 0.5;
    }
    return subMusicAudio;
};

export const playSubMusic = () => {
    const audio = getSubMusic();
    const enabled = localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false'; // Default active
    if (enabled) {
        audio.play().catch(e => console.log("Sub music play blocked", e));
    } else {
        audio.pause();
    }
};

export const pauseSubMusic = () => {
    if (subMusicAudio) {
        subMusicAudio.pause();
    }
};

export const setSubMusicVolume = (vol: number) => {
    const audio = getSubMusic();
    audio.volume = vol;
};
