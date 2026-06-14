/**
 * Radial kaleidoscope: fold screen UVs into mirrored angular segments around the
 * center, with a radius-dependent twist. Implemented as a postprocessing `mainUv`
 * remap so it mirrors the whole scene before later passes (grain/CA) sit on top.
 */
export const kaleidoscopeFragment = /* glsl */ `
  uniform float uSegments;
  uniform float uTwist;

  void mainUv(inout vec2 uv) {
    vec2 p = uv - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);

    float seg = 6.2831853 / max(uSegments, 1.0);
    a = mod(a, seg);
    a = abs(a - seg * 0.5);   // mirror within each wedge
    a += uTwist * r;          // swirl by radius

    p = vec2(cos(a), sin(a)) * r;
    uv = p + 0.5;
  }
`
