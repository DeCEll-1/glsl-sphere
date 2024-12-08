#ifndef FNC_BLENDCOLORDODGE
#define FNC_BLENDCOLORDODGE
float blendColorDodge(in float base, in float blend) {
    return (blend == 1.) ? blend : min(base / (1. - blend), 1.);
}
vec3 blendColorDodge(in vec3 base, in vec3 blend) {
    return vec3(blendColorDodge(base.r, blend.r),
        blendColorDodge(base.g, blend.g),
        blendColorDodge(base.b, blend.b));
}
vec3 blendColorDodge(in vec3 base, in vec3 blend, in float opacity) {
    return (blendColorDodge(base, blend) * opacity + base * (1. - opacity));
}
#endif
