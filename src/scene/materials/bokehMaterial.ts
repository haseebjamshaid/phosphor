import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import { Color } from 'three'

const RANGE = 14.0 // depth the orbs travel before wrapping back to the far plane

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uBeat;
  uniform float uSize;
  uniform float uTravel;
  attribute float aSeed;
  attribute float aScale;
  varying float vScale;
  varying float vFade;

  void main() {
    vec3 p = position;
    // Gentle lateral drift...
    p.x += cos(uTime * 0.15 + aSeed * 6.2831) * 0.25;
    p.y += sin(uTime * 0.2 + aSeed * 6.2831) * 0.35;
    // ...and a warp toward the camera, speed set by uTravel (energy-driven on the CPU).
    float z = mod(aSeed * ${RANGE.toFixed(1)} + uTravel, ${RANGE.toFixed(1)}) - 10.0;
    p.z = z;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = aScale * uSize * (1.0 + uBass * 1.0 + uBeat * 1.4);
    gl_PointSize = size * (300.0 / -mv.z);

    // Fade in from the far plane, fade out as it streaks past the camera.
    vFade = smoothstep(-10.0, -6.0, z) * (1.0 - smoothstep(2.0, 4.0, z));
    vScale = aScale;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLevel;
  uniform float uBeat;
  varying float vScale;
  varying float vFade;

  void main() {
    // Soft defocused disc: radial falloff from the point center.
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 2.0);
    gl_FragColor = vec4(uColor * (0.6 + uLevel * 0.8 + uBeat * 0.6), a * vScale * vFade * 0.8);
  }
`

/**
 * Soft blue bokeh orbs as additive point sprites that stream toward the camera like
 * a starfield — the warp speed (uTravel) is accumulated on the CPU from the music's
 * energy, so the field rushes past during build-ups. Bloom turns the cores to glow.
 */
export const BokehMaterial = shaderMaterial(
  { uTime: 0, uBass: 0, uBeat: 0, uLevel: 0, uSize: 1, uTravel: 0, uColor: new Color('#3f6fff') },
  vertexShader,
  fragmentShader,
)

extend({ BokehMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    bokehMaterial: ThreeElement<typeof BokehMaterial>
  }
}
