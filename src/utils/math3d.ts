import { SphereCoord } from "@/types/portfolio";

/**
 * Calculates uniform point distributions across a 2-sphere surface using
 * the Fibonacci Sphere Lattice (Spherical Sunflower Grid).
 *
 * @param total Total number of points (cards) to distribute
 * @param radius Radius of the sphere in 3D coordinate units
 * @returns Array of SphereCoord objects containing cartesian and spherical coordinates
 */
export function calculateFibonacciSpherePoints(total: number, radius: number): SphereCoord[] {
  if (!Number.isFinite(total) || !Number.isFinite(radius) || total <= 0 || radius <= 0) {
    return [];
  }

  const points: SphereCoord[] = [];
  // Golden angle in radians: pi * (3 - sqrt(5))
  const phiGold = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < total; i++) {
    // Latitude y in range (-1, 1)
    const yNorm = 1 - (2 * i + 1) / total;
    // Radius at latitude y
    const radiusAtLat = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    // Azimuthal angle theta modulo 2*PI
    const theta = (i * phiGold) % (2 * Math.PI);

    const x = radius * radiusAtLat * Math.cos(theta);
    const y = radius * yNorm;
    const z = radius * radiusAtLat * Math.sin(theta);

    // Polar angle phi in range [0, PI]
    const phi = Math.acos(Math.max(-1, Math.min(1, yNorm)));

    points.push({
      x,
      y,
      z,
      phi,
      theta,
    });
  }

  return points;
}

/**
 * Normalizes a 3D vector to unit length
 */
export function normalizeVector(x: number, y: number, z: number): [number, number, number] {
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return [0, 0, 1];
  }
  const len = Math.sqrt(x * x + y * y + z * z);
  if (!Number.isFinite(len) || len === 0) {
    return [0, 0, 1];
  }
  return [x / len, y / len, z / len];
}
