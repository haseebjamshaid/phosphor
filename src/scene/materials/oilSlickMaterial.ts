import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import { Color } from 'three'
import { snoise } from './glsl/noise'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uDisplacement;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  ${snoise}

  void main() {
    vec3 p = position;
    vec3 dir = normalize(position);
    float n1 = snoise(dir * 1.5 + vec3(0.0, 0.0, uTime * 0.18));
    float n2 = snoise(dir * 3.2 - vec3(uTime * 0.12));
    float disp = n1 * 0.65 + n2 * 0.35;
    float amount = 0.16 + uBass * 0.55 + uDisplacement * 0.6;
    p += normal * disp * amount;
    vNoise = disp;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = -mv.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;
  uniform float uColorShift;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uAccent;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  // IQ cosine palette → smooth rainbow band, used for the thin-film iridescence.
  vec3 palette(float t) {
    return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);

    float t = fres * 1.4 + vNoise * 0.5 + uTreble * 0.6 + uColorShift + uTime * 0.04;
    vec3 iri = palette(fract(t));

    vec3 base = mix(uPrimary, uSecondary, fres);
    vec3 color = mix(base, iri, 0.55 + uMid * 0.35);
    color += uAccent * fres * (0.35 + uBeat * 0.9);

    float glow = fres * (0.7 + uBeat * 1.3);
    color *= (0.45 + glow);

    gl_FragColor = vec4(color, 1.0);
  }
`

/**
 * Iridescent oil-slick material: simplex-noise displacement in the vertex stage,
 * fresnel-driven thin-film rainbow in the fragment stage. Emissive output so the
 * bloom pass makes it glow. Uniforms are driven per-frame from the AudioFrame.
 */
export const OilSlickMaterial = shaderMaterial(
  {
    uTime: 0,
    uBass: 0,
    uMid: 0,
    uTreble: 0,
    uBeat: 0,
    uDisplacement: 0,
    uColorShift: 0,
    uPrimary: new Color('#6ea8ff'),
    uSecondary: new Color('#b06cff'),
    uAccent: new Color('#7cffcb'),
  },
  vertexShader,
  fragmentShader,
)

extend({ OilSlickMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    oilSlickMaterial: ThreeElement<typeof OilSlickMaterial>
  }
}
