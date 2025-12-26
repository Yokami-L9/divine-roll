// Simplex/Perlin noise implementation for procedural textures
export class PerlinNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = Math.random()) {
    this.permutation = this.generatePermutation(seed);
    this.p = [...this.permutation, ...this.permutation];
  }

  private generatePermutation(seed: number): number[] {
    const perm = Array.from({ length: 256 }, (_, i) => i);
    // Shuffle using seed
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    return perm;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.p[X] + Y;
    const B = this.p[X + 1] + Y;

    return this.lerp(
      this.lerp(this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y), u),
      this.lerp(this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1), u),
      v
    );
  }

  // Fractal Brownian Motion for more natural textures
  fbm(x: number, y: number, octaves: number = 6, lacunarity: number = 2, persistence: number = 0.5): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise2D(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }

  // Turbulence for rougher textures
  turbulence(x: number, y: number, octaves: number = 6): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * Math.abs(this.noise2D(x * frequency, y * frequency));
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return value / maxValue;
  }

  // Ridge noise for mountains
  ridgedNoise(x: number, y: number, octaves: number = 6): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      const n = 1 - Math.abs(this.noise2D(x * frequency, y * frequency));
      value += amplitude * n * n;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

export const perlin = new PerlinNoise();
