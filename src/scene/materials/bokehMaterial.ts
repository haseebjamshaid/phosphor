import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import { Color } from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uSize;
  attribute float aSeed;
  attribute float aScale;
  varying float vScale;

  void main() {
    vec3 p = position;
    // Slow drift so the orbs feel alive even without audio.
    p.y += sin(uTime * 0.2 + aSeed * 6.2831) * 0.35;
    p.x += cos(uTime * 0.15 + aSeed * 6.2831) * 0.25;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = aScale * uSize * (1.0 + uBass * 1.4);
    gl_PointSize = size * (300.0 / -mv.z);
    vScale = aScale;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLevel;
  varying float vScale;

  void main() {
    // Soft defocused disc: radial falloff from the point center.
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 2.0);
    gl_FragColor = vec4(uColor * (0.6 + uLevel * 0.8), a * vScale * 0.7);
  }
`

/**
 * Soft blue bokeh orbs rendered as additive point sprites. Size pulses with bass;
 * the bloom pass turns the bright cores into glow. Uniforms driven from the AudioFrame.
 */
export const BokehMaterial = shaderMaterial(
  { uTime: 0, uBass: 0, uLevel: 0, uSize: 1, uColor: new Color('#3f6fff') },
  vertexShader,
  fragmentShader,
)

extend({ BokehMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    bokehMaterial: ThreeElement<typeof BokehMaterial>
  }
}
