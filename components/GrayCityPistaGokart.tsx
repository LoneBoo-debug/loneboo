
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from '../types';
import { CAR_DATA } from '../services/carData';
import { getOwnedCars, getSelectedCar, setSelectedCar as saveSelectedCar, addCarLaps } from '../services/tokens';
import { Trophy, Timer, Car as CarIcon, AlertCircle, X, Plus, Volume2, VolumeX } from 'lucide-react';
import { useMotionValue, useTransform, animate, useAnimationFrame } from 'framer-motion';

const BACKGROUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pistagokartgrigia.webp';
const AUDIO_BG_MUSIC = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/poorartistt-synth-racing-music-car-theme-no-copyright-485221.mp3';
const AUDIO_COUNTDOWN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freesound_community-robotic-countdown-43935.mp3';
const AUDIO_RACE_LOOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freesound_community-015522_go-kart-racing-outdoors-54107.mp3';
const AUDIO_TOGGLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

const trackWidth = 8; // Approx width of the track in percentage units

interface CarSpec {
  id: number;
  name: string;
  image: string;
  displayImage: string;
  stats: { speed: number; grip: number; accel: number; reliability: number; safety: number; braking: number };
  color: string;
}

interface CarPathPoint {
  x: number;
  y: number;
  isLapEnd?: boolean;
}

type CarPath = CarPathPoint[];

const INITIAL_PATHS_STRINGS: Record<number, string> = {
  1: "16.80,54.87 23.47,87.11 51.73,90.55 79.73,87.11 85.33,74.81 76.53,63.42 55.73,50.22 57.33,35.83 66.40,26.69 51.47,21.89 38.13,31.93 40.27,72.26 54.13,78.41 64.53,68.07 57.33,55.32 55.73,39.73 72.27,29.39 84.00,20.54 71.47,13.79 26.93,14.69 20.00,28.34 20.00,85.16 46.40,91.45 74.67,90.70 81.87,77.96 80.53,65.52 53.87,44.83 63.73,32.08 58.40,22.34 39.20,25.49 40.00,75.41 64.27,76.31 58.67,62.07 54.40,41.83 82.93,24.74 80.53,15.59 52.53,12.14 20.80,18.74 17.33,80.81 35.20,91.15 78.40,89.21 83.73,69.42 53.60,48.13 66.13,29.84 55.20,20.39 38.13,28.64 42.13,69.87 50.13,79.76 66.93,72.56 61.87,58.62 59.47,33.88 86.93,23.24 76.80,13.04 33.33,11.99 18.67,25.34 15.73,68.22 M:19.47,60.27",
  2: "16.80,54.87 23.47,87.11 51.73,90.55 79.73,87.11 85.33,74.81 76.53,63.42 55.73,50.22 57.33,35.83 66.40,26.69 51.47,21.89 38.13,31.93 40.27,72.26 54.13,78.41 64.53,68.07 57.33,55.32 55.73,39.73 72.27,29.39 84.00,20.54 71.47,13.79 26.93,14.69 20.00,28.34 20.00,85.16 46.40,91.45 74.67,90.70 81.87,77.96 80.53,65.52 53.87,44.83 63.73,32.08 58.40,22.34 39.20,25.49 40.00,75.41 64.27,76.31 58.67,62.07 54.40,41.83 82.93,24.74 80.53,15.59 52.53,12.14 20.80,18.74 17.33,80.81 35.20,91.15 78.40,89.21 83.73,69.42 53.60,48.13 66.13,29.84 55.20,20.39 38.13,28.64 42.13,69.87 50.13,79.76 66.93,72.56 61.87,58.62 59.47,33.88 86.93,23.24 76.80,13.04 33.33,11.99 18.67,25.34 15.73,68.22 M:19.47,60.27",
  3: "16.80,54.87 23.47,87.11 51.73,90.55 79.73,87.11 85.33,74.81 76.53,63.42 55.73,50.22 57.33,35.83 66.40,26.69 51.47,21.89 38.13,31.93 40.27,72.26 54.13,78.41 64.53,68.07 57.33,55.32 55.73,39.73 72.27,29.39 84.00,20.54 71.47,13.79 26.93,14.69 20.00,28.34 20.00,85.16 46.40,91.45 74.67,90.70 81.87,77.96 80.53,65.52 53.87,44.83 63.73,32.08 58.40,22.34 39.20,25.49 40.00,75.41 64.27,76.31 58.67,62.07 54.40,41.83 82.93,24.74 80.53,15.59 52.53,12.14 20.80,18.74 17.33,80.81 35.20,91.15 78.40,89.21 83.73,69.42 53.60,48.13 66.13,29.84 55.20,20.39 38.13,28.64 42.13,69.87 50.13,79.76 66.93,72.56 61.87,58.62 59.47,33.88 86.93,23.24 76.80,13.04 33.33,11.99 18.67,25.34 15.73,68.22 M:19.47,60.27",
  4: "16.80,54.87 23.47,87.11 51.73,90.55 79.73,87.11 85.33,74.81 76.53,63.42 55.73,50.22 57.33,35.83 66.40,26.69 51.47,21.89 38.13,31.93 40.27,72.26 54.13,78.41 64.53,68.07 57.33,55.32 55.73,39.73 72.27,29.39 84.00,20.54 71.47,13.79 26.93,14.69 20.00,28.34 20.00,85.16 46.40,91.45 74.67,90.70 81.87,77.96 80.53,65.52 53.87,44.83 63.73,32.08 58.40,22.34 39.20,25.49 40.00,75.41 64.27,76.31 58.67,62.07 54.40,41.83 82.93,24.74 80.53,15.59 52.53,12.14 20.80,18.74 17.33,80.81 35.20,91.15 78.40,89.21 83.73,69.42 53.60,48.13 66.13,29.84 55.20,20.39 38.13,28.64 42.13,69.87 50.13,79.76 66.93,72.56 61.87,58.62 59.47,33.88 86.93,23.24 76.80,13.04 33.33,11.99 18.67,25.34 15.73,68.22 M:19.47,60.27",
};

interface FinishLineMarker {
  x: number;
  y: number;
}

const parsePath = (pathStr: string): { points: CarPath, markers: FinishLineMarker[] } => {
  const points: CarPath = [];
  const markers: FinishLineMarker[] = [];
  const parts = pathStr.trim().split(/\s+/);
  
  parts.forEach(part => {
    if (part.startsWith('M:')) {
      const coords = part.substring(2).split(',');
      if (coords.length === 2) {
        markers.push({ x: parseFloat(coords[0]), y: parseFloat(coords[1]) });
      }
      return;
    }
    
    if (part === '|') {
      if (points.length > 0) {
        points[points.length - 1].isLapEnd = true;
      }
      return;
    }
    
    const coords = part.split(',');
    if (coords.length !== 2) return;
    const x = parseFloat(coords[0]);
    const y = parseFloat(coords[1]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  });
  
  return { points, markers };
};

// Catmull-Rom Spline interpolation for smooth curves
const getCatmullRomPoint = (p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}, p3: {x:number, y:number}, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  };
};

const smoothPath = (path: CarPath, segmentsPerPoint: number = 20, isLoop: boolean = true): CarPath => {
  if (path.length < 3) return path;
  const smoothed: CarPath = [];
  
  // If it's a loop, we ensure we don't have a duplicate point at the end
  // that would cause a "stop" in the interpolation.
  const loopPath = isLoop ? (
    Math.sqrt(Math.pow(path[0].x - path[path.length-1].x, 2) + Math.pow(path[0].y - path[path.length-1].y, 2)) < 0.5 
    ? path.slice(0, -1) : path
  ) : path;
  
  const len = loopPath.length;

  for (let i = 0; i < (isLoop ? len : len - 1); i++) {
    let p0: {x: number, y: number}, 
        p1: {x: number, y: number}, 
        p2: {x: number, y: number}, 
        p3: {x: number, y: number};
    
    if (isLoop) {
      p1 = loopPath[i];
      p2 = loopPath[(i + 1) % len];
      p0 = loopPath[(i - 1 + len) % len];
      p3 = loopPath[(i + 2) % len];
    } else {
      p0 = loopPath[i === 0 ? i : i - 1];
      p1 = loopPath[i];
      p2 = loopPath[i + 1];
      p3 = i + 2 >= len ? loopPath[i + 1] : loopPath[i + 2];
    }
    
    for (let j = 0; j < segmentsPerPoint; j++) {
      smoothed.push(getCatmullRomPoint(p0, p1, p2, p3, j / segmentsPerPoint));
    }
  }
  
  if (!isLoop) {
    smoothed.push(path[path.length - 1]);
  }
  
  return smoothed;
};

const getPointAtDistance = (smoothedPath: CarPath, distance: number, totalDist: number, isLoop: boolean) => {
  const d = isLoop ? distance % totalDist : Math.min(distance, totalDist);
  
  // Calculate cumulative distances if not already done (this is a simplified version for the loop)
  // In a real app we'd pre-calculate this, but for gokart we can do it simply
  let current = 0;
  for (let i = 0; i < smoothedPath.length; i++) {
    const p1 = smoothedPath[i];
    const p2 = smoothedPath[(i + 1) % smoothedPath.length];
    const segDist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    
    if (current + segDist >= d) {
      const fraction = (d - current) / segDist;
      return {
        x: p1.x + (p2.x - p1.x) * fraction,
        y: p1.y + (p2.y - p1.y) * fraction,
        dx: p2.x - p1.x,
        dy: p2.y - p1.y
      };
    }
    current += segDist;
  }
  return { x: smoothedPath[0].x, y: smoothedPath[0].y, dx: 1, dy: 0 };
};

const getPathTimes = (path: CarPath) => {
  const distances: number[] = [0];
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const d = Math.sqrt(Math.pow(path[i+1].x - path[i].x, 2) + Math.pow(path[i+1].y - path[i].y, 2));
    totalDistance += d;
    distances.push(totalDistance);
  }
  
  return distances.map(d => d / totalDistance);
};

const getPathRotations = (path: CarPath, grip: number) => {
  const rotations: number[] = [];
  // grip is now 1-100. 100 means no wobble, 1 means max wobble.
  const wobbleAmount = (100 - grip) * 0.08; // Up to 8 degrees wobble for low grip

  let lastAngle = 0;

  for (let i = 0; i < path.length; i++) {
    let angle = 0;
    if (i < path.length - 1) {
      const dx = path[i+1].x - path[i].x;
      const dy = path[i+1].y - path[i].y;
      angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
    } else {
      angle = lastAngle;
    }
    
    // Normalize angle to prevent jumping from 179 to -179
    if (i > 0) {
      while (angle - lastAngle > 180) angle -= 360;
      while (angle - lastAngle < -180) angle += 360;
    }
    
    lastAngle = angle;
    
    // Add wobble based on grip
    const wobble = (Math.sin(i * 0.5) * wobbleAmount);
    rotations.push(angle + wobble);
  }
  return rotations;
};

interface GrayCityPistaGokartProps {
  setView: (view: AppView) => void;
}

const GrayCityPistaGokart: React.FC<GrayCityPistaGokartProps> = ({ setView }) => {
  const [isRacing, setIsRacing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [raceFinished, setRaceFinished] = useState(false);
  const [activeCars, setActiveCars] = useState<CarSpec[]>([]);
  const [carPaths, setCarPaths] = useState<Record<number, any[]>>({});
  const [showCarSelection, setShowCarSelection] = useState(false);
  const [carSelectionError, setCarSelectionError] = useState<string | null>(null);
  const [playerCarId, setPlayerCarId] = useState<number | null>(null);
  const [raceResults, setRaceResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userWon, setUserWon] = useState(false);
  const [currentLaps, setCurrentLaps] = useState<Record<number, number>>({});
  const [maxLaps] = useState(3);
  const [raceStartTime, setRaceStartTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  // Animation Progress
  const raceProgress = useMotionValue(0);
  const totalTrackDist = useRef(0);

  const [raceId, setRaceId] = useState(0);

  const currentLapDisplay = useTransform(raceProgress, (v) => {
    if (!isRacing || activeCars.length === 0) return 1;
    
    const globalTime = v * ((window as any).raceTimeout || 20);
    const exactIdx = globalTime / 0.01;
    
    let maxLap = 1;
    activeCars.forEach(car => {
      const points = carPaths[car.id];
      if (points) {
        const idx = Math.min(Math.floor(exactIdx), points.length - 1);
        const lap = points[idx]?.lap || 1;
        if (lap > maxLap) maxLap = lap;
      }
    });
    
    return Math.min(maxLaps, maxLap);
  });

  useEffect(() => {
    // We don't setup cars automatically anymore, we wait for startRace
  }, []);

  const startRace = () => {
    const ownedCarNames = getOwnedCars();
    
    if (ownedCarNames.length === 0) {
      setCarSelectionError("Non possiedi auto per poter gareggiare");
      setShowCarSelection(true);
      return;
    }

    if (ownedCarNames.length > 1) {
      setShowCarSelection(true);
      return;
    }

    // Se ne ha solo una, usa quella
    initRace(ownedCarNames[0]);
  };

  const initRace = (carName: string) => {
    setShowCarSelection(false);
    setRaceFinished(false);
    setShowResults(false);
    setUserWon(false);
    raceProgress.set(0);
    
    const allCars = [...CAR_DATA];
    let userCarData = allCars.find(c => c.name === carName);
    if (!userCarData) userCarData = allCars[0];

    const opponents = allCars
      .filter(c => c.name !== userCarData!.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const raceCars: CarSpec[] = [userCarData, ...opponents].map((car, index) => ({
      id: index + 1,
      name: car.name,
      image: (car as any).raceImage || car.image,
      displayImage: car.image,
      stats: car.stats,
      color: ['#ef4444', '#3b82f6', '#eab308', '#22c55e'][index]
    }));

    setPlayerCarId(1); // The player is always the first in our list
    setActiveCars(raceCars);

    // Ensure background music plays on user interaction
    if (!isMuted) {
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.8;
        bgMusicRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
    }

    // Generate collision-aware paths for all cars
    const { points: basePoints, markers } = parsePath(INITIAL_PATHS_STRINGS[1]);
    const { paths, results } = simulateRace(basePoints, markers, raceCars, maxLaps);
    
    setCarPaths(paths);
    setRaceResults(results);
    
    const initialLaps: Record<number, number> = {};
    raceCars.forEach(car => initialLaps[car.id] = 1);
    setCurrentLaps(initialLaps);
    
    // Calculate total duration for the animation (when the 3rd car finishes)
    const sortedTimes = results.map(r => r.rawTime).sort((a, b) => a - b);
    const finishTime = sortedTimes[Math.min(2, sortedTimes.length - 1)];
    (window as any).raceTimeout = finishTime;

    setRaceId(prev => prev + 1);
    setCountdown(3);
  };

  const simulateRace = (basePoints: CarPath, markers: FinishLineMarker[], cars: CarSpec[], totalLaps: number) => {
    // The user wants the first point of the track to be the start/finish line
    const finishLinePt = basePoints[0];
    
    // For Gokart, we ALWAYS force isLoop = true to ensure seamless transitions
    const isLoop = true;

    const smoothedBase = smoothPath(basePoints, 60, isLoop); // Even more segments for extreme smoothness
    
    // Pre-calculate segment distances and cumulative distances for the base path
    const segmentDistances: number[] = [];
    const cumulativeDistances: number[] = [0];
    let totalDist = 0;

    for (let i = 0; i < smoothedBase.length; i++) {
      const p1 = smoothedBase[i];
      const p2 = smoothedBase[(i + 1) % smoothedBase.length];
      const d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      segmentDistances.push(d);
      totalDist += d;
      cumulativeDistances.push(totalDist);
    }
    
    totalTrackDist.current = totalDist;

    const paths: Record<number, any[]> = {};
    const results: any[] = [];

    cars.forEach((car, index) => {
      // car.stats.speed is now 1-100.
      const baseSpeed = (car.stats.speed * 0.04 + 4) * 0.85;
      const lane = (index - 1.5) * (trackWidth * 0.18);
      const carPoints: any[] = [];
      
      const totalRaceDist = totalDist;
      
      let currentDist = 0; 
      let currentTime = 0;
      const dt = 0.01; 

      let lapCounter = 1;
      let hasLeftStart = false;

      // Spin out state
      let spinRemaining = 0;
      let spinCooldown = 0;
      let currentVelocity = baseSpeed;

      while (currentDist < totalRaceDist) {
        const lapDist = currentDist % totalDist;
        
        // Use binary search for point lookup
        let low = 0;
        let high = smoothedBase.length - 1;
        let pointIdx = 0;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (cumulativeDistances[mid] <= lapDist) {
            pointIdx = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        const p1 = smoothedBase[pointIdx];
        const p2 = smoothedBase[(pointIdx + 1) % smoothedBase.length];
        const pNextNext = smoothedBase[(pointIdx + 2) % smoothedBase.length];
        
        const segDist = segmentDistances[pointIdx];
        const fraction = segDist > 0 ? (lapDist - cumulativeDistances[pointIdx]) / segDist : 0;
        
        const baseX = p1.x + (p2.x - p1.x) * fraction;
        const baseY = p1.y + (p2.y - p1.y) * fraction;
        
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v2 = { x: pNextNext.x - p2.x, y: pNextNext.y - p2.y };
        
        const dx = v1.x + (v2.x - v1.x) * fraction;
        const dy = v1.y + (v2.y - v1.y) * fraction;
        
        const len = Math.sqrt(dx*dx + dy*dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const worldX = baseX + nx * lane;
        const worldY = baseY + ny * lane;
        
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
        
        // Spin out logic
        const diff = Math.abs(Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x));
        const normalizedCurvature = Math.min(diff * 10, 1.0);
        
        const speedFactor = car.stats.speed / 100;
        const gripFactor = car.stats.grip / 100;
        const reliabilityFactor = car.stats.reliability / 100;
        
        // Only check for spin in significant curves
        const isHighCurvature = normalizedCurvature > 0.45;
        
        // Pseudo-random based on distance and car ID for determinism
        // Using a higher frequency for the sine wave to make it more "random" frame-to-frame
        const pseudoRandom = (Math.sin(currentDist * 200 + car.id * 33) + 1) / 2;
        
        // Risk increases with speed and curvature, decreases significantly with grip
        const riskFactor = (currentVelocity / baseSpeed) * normalizedCurvature * (1.3 - gripFactor);
        
        // Chance to spin: much lower base probability, heavily dampened by reliability and grip
        const baseChance = 0.0004; 
        const spinChance = (baseChance * riskFactor) / (reliabilityFactor * 15 + 1);
        
        if (spinRemaining <= 0 && spinCooldown <= 0 && isHighCurvature && pseudoRandom < spinChance) {
          // Spin duration depends on safety and braking (how well they recover)
          const recoveryFactor = (car.stats.safety + car.stats.braking) / 200;
          spinRemaining = 0.6 + (1.0 - recoveryFactor) * 0.6; // 0.6 to 1.2 seconds
          spinCooldown = 8.0; // Longer cooldown between spins
        }

        let rotationOffset = 0;
        let slideX = 0;
        let slideY = 0;
        let targetSpeed = baseSpeed;

        if (spinRemaining > 0) {
          // Slow down during spin
          const brakingFactor = car.stats.braking / 100;
          targetSpeed = baseSpeed * 0.2 * (1.0 + brakingFactor * 0.3);
          
          // Skid effect: rotate sideways and slide
          const spinDuration = 1.0; 
          const spinProgress = 1.0 - (spinRemaining / spinDuration);
          
          // Rotate to 45 degrees sideways and then back
          rotationOffset = Math.sin(spinProgress * Math.PI) * 55;
          
          // Slide slightly outward (using normal vector nx, ny)
          const slideMagnitude = Math.sin(spinProgress * Math.PI) * 2.5; // Slide up to 2.5%
          slideX = nx * slideMagnitude;
          slideY = ny * slideMagnitude;
          
          spinRemaining -= dt;
        } else {
          // Normal curve slowdown
          const brakingFactor = car.stats.braking / 100;
          const curveSlowdown = Math.min(diff * (2.5 - brakingFactor), 0.4);
          targetSpeed = baseSpeed * (1.0 - curveSlowdown);
          
          if (spinCooldown > 0) spinCooldown -= dt;
        }

        // Apply acceleration to reach target speed
        const accelFactor = car.stats.accel / 100;
        const accelSpeed = 2.0 + accelFactor * 8.0;
        if (currentVelocity < targetSpeed) {
          currentVelocity = Math.min(currentVelocity + accelSpeed * dt, targetSpeed);
        } else {
          currentVelocity = Math.max(currentVelocity - 15.0 * dt, targetSpeed); // Quick braking
        }

        angle += rotationOffset;

        if (carPoints.length > 0) {
          const lastAngle = carPoints[carPoints.length - 1].rotate;
          while (angle - lastAngle > 180) angle -= 360;
          while (angle - lastAngle < -180) angle += 360;
        }

        // Lap counting based on proximity to the first point
        const distToStart = Math.sqrt(Math.pow(worldX - finishLinePt.x, 2) + Math.pow(worldY - finishLinePt.y, 2));
        if (distToStart > 15) hasLeftStart = true;
        if (hasLeftStart && distToStart < 6) {
          lapCounter++;
          hasLeftStart = false;
        }

        const currentLap = Math.min(maxLaps, lapCounter);
        carPoints.push({ x: worldX + slideX, y: worldY + slideY, rotate: angle, time: currentTime, lap: currentLap });
        
        currentDist += currentVelocity * dt;
        currentTime += dt;
      }
      
      // Add one final point to close the loop perfectly at the end of the race
      const pFinal = getPointAtDistance(smoothedBase, totalRaceDist, totalDist, isLoop);
      const angleFinal = Math.atan2(pFinal.dy, pFinal.dx) * (180 / Math.PI) - 90;
      carPoints.push({ 
        x: pFinal.x + (-pFinal.dy / (Math.sqrt(pFinal.dx**2 + pFinal.dy**2) || 1)) * lane, 
        y: pFinal.y + (pFinal.dx / (Math.sqrt(pFinal.dx**2 + pFinal.dy**2) || 1)) * lane, 
        rotate: angleFinal, 
        time: currentTime, 
        lap: totalLaps 
      });

      paths[car.id] = carPoints;
      results.push({ 
        ...car, 
        rawTime: currentTime, 
        finalTime: formatTime(currentTime),
        points: carPoints 
      });
    });

    return { paths, results: results.sort((a, b) => a.rawTime - b.rawTime) };
  };

  useEffect(() => {
    if (countdown === 0) {
      setRaceStartTime(Date.now());
    }
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCountdown(null);
          setIsRacing(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [countdown]);

  // Use animate for the race progress to ensure maximum fluidity
  useEffect(() => {
    if (isRacing) {
      const timeout = (window as any).raceTimeout || 20;
      // Progress goes from 0 to 1 over the calculated duration
      const controls = animate(raceProgress, 1, {
        duration: timeout,
        ease: "linear",
        onComplete: () => finishRace()
      });
      return () => controls.stop();
    }
  }, [isRacing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  const finishRace = () => {
    setIsRacing(false);
    setRaceFinished(true);
    
    // Incrementa i giri dell'auto selezionata per l'usura
    const selectedCar = getSelectedCar();
    if (selectedCar) {
      addCarLaps(selectedCar, 1);
    }

    // Stop audio on finish
    bgMusicRef.current?.pause();
    raceLoopAudioRef.current?.pause();

    setShowResults(true);
    
    // Check if player won (player is always id 1 in our simulation)
    if (raceResults.length > 0 && raceResults[0].id === 1) {
      setUserWon(true);
      setTimeout(() => setUserWon(false), 5000);
    }
  };

  const closeResults = () => {
    setRaceFinished(false);
    setShowResults(false);
    raceProgress.set(0);
    // Resume background music if not muted
    if (!isMuted) {
      bgMusicRef.current?.play().catch(e => console.log(e));
    }
  };

  const stopRace = () => {
    setIsRacing(false);
    setCountdown(null);
    setRaceFinished(false);
    setShowResults(false);
    raceProgress.set(0);
  };

  // Audio Refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const raceLoopAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    bgMusicRef.current = new Audio(AUDIO_BG_MUSIC);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.9; // Maximize volume for better audibility

    countdownAudioRef.current = new Audio(AUDIO_COUNTDOWN);
    countdownAudioRef.current.volume = 0.9;

    raceLoopAudioRef.current = new Audio(AUDIO_RACE_LOOP);
    raceLoopAudioRef.current.loop = true;
    raceLoopAudioRef.current.volume = 0.7;

    // Start BG music on mount
    bgMusicRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));

    return () => {
      bgMusicRef.current?.pause();
      countdownAudioRef.current?.pause();
      raceLoopAudioRef.current?.pause();
    };
  }, []);

  // Handle Mute
  useEffect(() => {
    if (bgMusicRef.current) bgMusicRef.current.muted = isMuted;
    if (countdownAudioRef.current) countdownAudioRef.current.muted = isMuted;
    if (raceLoopAudioRef.current) raceLoopAudioRef.current.muted = isMuted;
  }, [isMuted]);

  // Handle Race Audio Transitions
  useEffect(() => {
    if (countdown === 3) {
      countdownAudioRef.current?.play().catch(e => console.log(e));
    }
    
    if (isRacing) {
      raceLoopAudioRef.current?.play().catch(e => console.log(e));
    } else {
      raceLoopAudioRef.current?.pause();
      if (raceLoopAudioRef.current) raceLoopAudioRef.current.currentTime = 0;
    }
  }, [countdown, isRacing]);

  return (
    <div 
      id="race-container"
      className="fixed inset-0 z-[9999] overflow-hidden bg-stone-900 pointer-events-auto"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
        <img 
          src={BACKGROUND_URL} 
          alt="Pista Gokart Grigia" 
          className="absolute inset-0 w-full h-full object-fill select-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Racing Cars Layer */}
      {activeCars.length > 0 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {activeCars.map((car) => (
            carPaths[car.id] && (
              <RaceCar 
                key={`car-race-${car.id}-${raceId}`}
                car={car}
                points={carPaths[car.id]}
                progress={raceProgress}
                duration={(window as any).raceTimeout || 20}
              />
            )
          ))}
        </div>
      )}

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-[10005] flex flex-col items-center justify-center bg-black/20 pointer-events-none">
          {countdown > 0 && countdown <= 3 && (
            <motion.img 
              key={`semaforo-${countdown}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              src={
                countdown === 3 ? "https://loneboo-images.s3.eu-south-1.amazonaws.com/semrosso.webp" :
                countdown === 2 ? "https://loneboo-images.s3.eu-south-1.amazonaws.com/semgiallo.webp" :
                "https://loneboo-images.s3.eu-south-1.amazonaws.com/semverde.webp"
              }
              className="w-32 h-auto mb-4"
              referrerPolicy="no-referrer"
            />
          )}
          <motion.div
            key={`countdown-${countdown}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white font-luckiest text-9xl uppercase"
          >
            {countdown === 0 ? "VIA!" : countdown}
          </motion.div>
        </div>
      )}

      {/* Race Finished Message & Results */}
      <AnimatePresence>
        {raceFinished && (
          <div className="absolute inset-0 z-[10005] flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-yellow-400 text-blue-900 font-luckiest text-4xl md:text-6xl px-12 py-6 rounded-3xl border-4 border-white shadow-2xl uppercase mb-8"
            >
              Gara Finita!
            </motion.div>

            {/* Winner Message */}
            {userWon && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="bg-yellow-400 text-blue-900 font-luckiest text-4xl md:text-6xl px-12 py-4 rounded-full border-4 border-white shadow-xl uppercase mb-8 z-50"
              >
                HAI VINTO!
              </motion.div>
            )}

            {/* Race Results Box */}
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border-4 border-blue-500 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-luckiest text-blue-900 uppercase flex items-center gap-3">
                  <Trophy className="text-yellow-500" /> Classifica Finale
                </h3>
                <button 
                  onClick={closeResults}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors active:scale-90"
                >
                  <X size={32} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-3">
                {raceResults.map((result, index) => (
                  <motion.div 
                    key={result.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                      result.id === playerCarId ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-luckiest text-lg ${
                      index === 0 ? 'bg-yellow-400 text-white' : 
                      index === 1 ? 'bg-gray-300 text-white' : 
                      index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <img 
                      src={result.displayImage} 
                      alt={result.name} 
                      className="object-contain transition-all"
                      style={{ 
                        width: index === 0 ? '64px' : index === 1 ? '56px' : index === 2 ? '48px' : '40px',
                        height: index === 0 ? '64px' : index === 1 ? '56px' : index === 2 ? '48px' : '40px'
                      }}
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1">
                      <p className="font-luckiest text-base text-gray-800 uppercase">{result.name}</p>
                      {result.id === playerCarId && (
                        <span className="text-[10px] font-bold text-blue-500 uppercase">La tua auto</span>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-luckiest text-lg text-blue-900">{result.finalTime}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lap Counter - LED Scoreboard Style */}
      {isRacing && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] pointer-events-none">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-zinc-900/90 border border-zinc-700 px-4 py-1 rounded-md shadow-lg flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              <span className="font-mono text-xs text-red-500 tracking-wider uppercase font-bold">
                LIVE
              </span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-700" />
            <span className="font-mono text-lg text-yellow-400 tracking-tight drop-shadow-[0_0_5px_rgba(250,204,21,0.4)]">
              LAP <motion.span>{currentLapDisplay}</motion.span><span className="text-zinc-500 mx-1">/</span>{maxLaps}
            </span>
          </motion.div>
        </div>
      )}

      {/* Car Selection Modal */}
      <AnimatePresence>
        {showCarSelection && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-luckiest text-blue-900 uppercase">Scegli la tua auto</h2>
                <button 
                  onClick={() => setShowCarSelection(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {carSelectionError ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <AlertCircle size={64} className="text-red-500 mb-4" />
                  <p className="text-xl font-luckiest text-gray-700 uppercase">{carSelectionError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getOwnedCars().map(carName => {
                    const car = CAR_DATA.find(c => c.name === carName);
                    if (!car) return null;
                    return (
                      <button
                        key={car.id}
                        onClick={() => initRace(car.name)}
                        className="group p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"
                      >
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-luckiest text-sm text-gray-700 uppercase">{car.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons & UI - Top Level */}
      <div className="fixed top-6 left-6 right-6 z-[10001] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setView(AppView.GRAY_CITY)}
            className="pointer-events-auto transition-all active:scale-90 hover:brightness-110"
          >
            <img 
              src="https://loneboo-images.s3.eu-south-1.amazonaws.com/escigaragokart.webp" 
              alt="Esci" 
              className="w-16 md:w-24 h-auto"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        {/* Race Controls */}
        <div className="flex flex-col gap-4 pointer-events-none items-end">
          {!isRacing && !raceFinished && (
            <>
              <button
                onClick={startRace}
                className="pointer-events-auto transition-all active:scale-95 hover:brightness-110"
              >
                <img 
                  src="https://loneboo-images.s3.eu-south-1.amazonaws.com/iniziagaragokart.webp" 
                  alt="Inizia Gara" 
                  className="w-16 md:w-24 h-auto"
                  referrerPolicy="no-referrer"
                />
              </button>
            </>
          )}

          {isRacing && (
            <button
              onClick={stopRace}
              className="pointer-events-auto transition-all active:scale-95 hover:brightness-110"
            >
              <img 
                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/fermagaragokart.webp" 
                alt="Ferma Gara" 
                className="w-16 md:w-24 h-auto"
                referrerPolicy="no-referrer"
              />
            </button>
          )}
        </div>
      </div>

      {/* Audio Toggle Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[10001]">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="group relative pointer-events-auto transition-all active:scale-90 hover:brightness-110"
        >
          <img 
            src={AUDIO_TOGGLE_IMG} 
            alt="Audio Toggle" 
            className="w-12 md:w-16 h-auto drop-shadow-lg"
            referrerPolicy="no-referrer"
          />
          {isMuted && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-1 bg-red-500 rotate-45 absolute" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

const RaceCar: React.FC<{
  car: CarSpec;
  points: any[];
  progress: any;
  duration: number;
}> = React.memo(({ car, points, progress, duration }) => {
  // Each car should follow its own simulated timeline relative to the global race progress
  // We use the points array length to know how many 0.01s steps the car has
  const left = useTransform(progress, (v: number) => {
    if (!points || points.length < 2) return "0%";
    
    // Global time elapsed in the race
    const globalTime = v * duration;
    
    // Find the point in the car's specific timeline
    const exactIdx = globalTime / 0.01;
    const idx = Math.floor(exactIdx);
    
    if (idx >= points.length - 1) return points[points.length - 1].x + "%";
    if (idx < 0) return points[0].x + "%";
    
    const fraction = exactIdx - idx;
    const p1 = points[idx];
    const p2 = points[idx + 1];
    return (p1.x + (p2.x - p1.x) * fraction) + "%";
  });

  const top = useTransform(progress, (v: number) => {
    if (!points || points.length < 2) return "0%";
    const globalTime = v * duration;
    const exactIdx = globalTime / 0.01;
    const idx = Math.floor(exactIdx);
    
    if (idx >= points.length - 1) return points[points.length - 1].y + "%";
    if (idx < 0) return points[0].y + "%";
    
    const fraction = exactIdx - idx;
    const p1 = points[idx];
    const p2 = points[idx + 1];
    return (p1.y + (p2.y - p1.y) * fraction) + "%";
  });

  const rotate = useTransform(progress, (v: number) => {
    if (!points || points.length < 2) return 0;
    const globalTime = v * duration;
    const exactIdx = globalTime / 0.01;
    const idx = Math.floor(exactIdx);
    
    if (idx >= points.length - 1) return points[points.length - 1].rotate;
    if (idx < 0) return points[0].rotate;
    
    const fraction = exactIdx - idx;
    const p1 = points[idx];
    const p2 = points[idx + 1];
    
    let r1 = p1.rotate;
    let r2 = p2.rotate;
    
    // Smooth rotation wrapping
    while (r2 - r1 > 180) r2 -= 360;
    while (r2 - r1 < -180) r2 += 360;
    
    return r1 + (r2 - r1) * fraction;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top,
        rotate,
        x: "-50%",
        y: "-50%",
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform, left, top',
        zIndex: 30,
      }}
    >
      <img 
        src={car.image} 
        alt={car.name} 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
});

export default GrayCityPistaGokart;
