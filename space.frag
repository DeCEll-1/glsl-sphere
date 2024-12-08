float sdSphere(vec3 p, vec3 center, float radius) {
    return length(p - center) - radius;
}

void calculateCameraOrientation(vec2 angles, out vec3 forward, out vec3 right, out vec3 up) {
    float yaw = angles.x; // Left/right rotation
    float pitch = angles.y; // Up/down rotation

    // Calculate forward vector using spherical coordinates
    forward = normalize(vec3(
                cos(pitch) * sin(yaw), // X
                sin(pitch), // Y
                cos(pitch) * cos(yaw) // Z
            ));

    // Calculate the right and up vectors
    right = normalize(cross(vec3(0.0, 1.0, 0.0), forward)); // Perpendicular to up and forward
    up = cross(forward, right); // Perpendicular to forward and right
}

// Ray marching function
float rayMarch(vec3 ro, vec3 rd, vec4 sphere, out vec3 hitPos) {
    const int MAX_STEPS = 100; // Max iterations for ray marching
    const float MAX_DIST = 100.0; // Max distance to trace
    const float SURFACE_DIST = 0.001; // Minimum distance to consider a hit

    float distance = 0.0; // Accumulated distance
    for (int i = 0; i < MAX_STEPS; i++) {
        hitPos = ro + distance * rd; // Current position on the ray
        float d = sdSphere(hitPos, sphere.xyz, sphere.w); // Distance to sphere

        if (d < SURFACE_DIST) {
            return distance; // Hit the surface
        }
        if (distance > MAX_DIST) {
            break; // Exceeded maximum trace distance
        }

        distance += d; // Move forward by the distance
    }
    return -1.0; // Did not hit anything
}
