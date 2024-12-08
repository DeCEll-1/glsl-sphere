#include "space.frag"

// Calculate normal at a point on the sphere using the SDF gradient
vec3 calcNormal(vec3 p, vec4 sphere) {
    const vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
            sdSphere(p + e.xyy, sphere.xyz, sphere.w) - sdSphere(p - e.xyy, sphere.xyz, sphere.w),
            sdSphere(p + e.yxy, sphere.xyz, sphere.w) - sdSphere(p - e.yxy, sphere.xyz, sphere.w),
            sdSphere(p + e.yyx, sphere.xyz, sphere.w) - sdSphere(p - e.yyx, sphere.xyz, sphere.w)
        ));
}

// Simple lighting model
float shade(vec3 p, vec3 normal, vec3 lightPos) {
    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir), 0.0);
    return diff; // Diffuse lighting with orange tint
}

// Calculate UV coordinates for the sphere's surface
vec2 sphereUV(vec3 hitPos, vec4 sphere) {
    vec3 localPos = normalize(hitPos - sphere.xyz); // Normalize to sphere's local space
    float u = 0.5 + atan(localPos.z, localPos.x) / (2.0 * 3.14159265359); // Longitude
    float v = 0.5 - asin(localPos.y) / 3.14159265359; // Latitude
    return vec2(u, v);
}
