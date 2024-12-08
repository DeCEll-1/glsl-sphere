#ifdef GL_ES
precision mediump float;
#endif
// i suggest reading https://chatgpt.com/share/674bdc5c-36bc-8006-828b-82be0e3752a3 if you want to learn more about it
// im not clever enough to explain it

vec3 cameraPos = vec3(0., 0., -2.5); // Camera position
vec3 spherePos = vec3(0., 0., 0.); // Sphere center position
float sphereRadius = 3.; // Sphere radius

vec3 lightLocations[] = vec3[](
        vec3(20., 20., 20.),
        vec3(-20., -20., -20.)
    );

#include "lightning.frag"
#include "sphereShaders.frag"

void getColorOnSphere(out vec4 fragColor, in vec3 loc) {
    vec2 uv = sphereUV(loc, vec4(spherePos, sphereRadius));
    vec4 col = vec4(1.);

    sphereShaderNebula(fragColor, uv);

    // fragColor = vec4(1.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= .5;
    uv *= 2.;
    uv.x *= iResolution.x / iResolution.y;
    vec4 col = vec4(vec3(uv, 0.), -1.);
    float speed = .1;
    // Circular camera motion
    cameraPos = vec3(
            cos(iTime * speed) * 5.0, // X position
            0.3 * 5., // Y position (no vertical motion)
            sin(iTime * speed) * 5.0 // Z position
        );

    vec3 rayOrigin = cameraPos;

    vec3 rayDir = normalize(vec3(uv, 1.0)); // Perspective projection

    // Compute the direction vector from the camera to the target
    vec3 toTarget = normalize(spherePos - cameraPos);

    // Derive yaw and pitch from the direction vector
    float yaw = atan(toTarget.x, toTarget.z); // Left/right rotation
    float pitch = asin(toTarget.y); // Up/down rotation

    vec2 angles = vec2(yaw, pitch);
    vec3 forward;
    vec3 right;
    vec3 up;
    calculateCameraOrientation(angles, forward, right, up);

    // Reconstruct rayDir with camera orientation
    rayDir = normalize(uv.x * right + uv.y * up + forward);

    vec3 hitPos;
    vec4 sphere = vec4(spherePos, sphereRadius);
    float distanceFromCam = rayMarch(rayOrigin, rayDir, sphere, hitPos);
    if (distanceFromCam > 0.) {
        vec3 normal = calcNormal(hitPos, sphere); // Compute normal at hit point
        vec4 pointColor = vec4(1.);
        getColorOnSphere(pointColor, hitPos);
        vec4 mixedColors = pointColor;
        // for (int i = 0; i < lightLocations.length(); i++) {
        //     float mult = shade(hitPos, normal, lightLocations[i]); // Compute shading
        //     mixedColors += pointColor * mult;
        // }
        // mixedColors = mixedColors;
        col = vec4(mixedColors); // Output color
    } else {
        col = vec4(0.0, 0.0, 0.0, 1.0); // Background color
    }

    fragColor = col;
}
