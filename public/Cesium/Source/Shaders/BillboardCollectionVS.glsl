#ifdef INSTANCED
attribute vec2 direction;
#endif
attribute vec4 positionHighAndScale;
attribute vec4 positionLowAndRotation;
attribute vec4 compressedAttribute0;                       // pixel offset, translate, horizontal origin, vertical origin, show, direction, texture coordinates (texture offset)
attribute vec4 compressedAttribute1;                       // aligned axis, translucency by distance, image width
attribute vec4 compressedAttribute2;                       // label horizontal origin, image height, color, pick color, size in meters, valid aligned axis, 13 bits free
attribute vec4 eyeOffset;                                  // eye offset in meters, 4 bytes free (texture range)
attribute vec4 scaleByDistance;                            // near, nearScale, far, farScale
attribute vec4 pixelOffsetScaleByDistance;                 // near, nearScale, far, farScale
attribute vec4 compressedAttribute3;                       // distance display condition near, far, disableDepthTestDistance, dimensions
#ifdef CLAMP_TO_GROUND
attribute vec4 textureCoordinateBounds;                    // the min and max x and y values for the texture coordinates
#endif
#ifdef VECTOR_TILE
attribute float a_batchId;
#endif

varying vec2 v_textureCoordinates;
#ifdef CLAMP_TO_GROUND
varying vec4 v_textureCoordinateBounds;
varying vec4 v_originTextureCoordinateAndTranslate;
varying vec4 v_dimensionsAndImageSize;
varying vec3 v_eyeDepthDistanceAndApplyTranslate;
varying mat2 v_rotationMatrix;
#endif

varying vec4 v_pickColor;
varying vec4 v_color;

const float UPPER_BOUND = 32768.0;

const float SHIFT_LEFT16 = 65536.0;
const float SHIFT_LEFT12 = 4096.0;
const float SHIFT_LEFT8 = 256.0;
const float SHIFT_LEFT7 = 128.0;
const float SHIFT_LEFT5 = 32.0;
const float SHIFT_LEFT3 = 8.0;
const float SHIFT_LEFT2 = 4.0;
const float SHIFT_LEFT1 = 2.0;

const float SHIFT_RIGHT12 = 1.0 / 4096.0;
const float SHIFT_RIGHT8 = 1.0 / 256.0;
const float SHIFT_RIGHT7 = 1.0 / 128.0;
const float SHIFT_RIGHT5 = 1.0 / 32.0;
const float SHIFT_RIGHT3 = 1.0 / 8.0;
const float SHIFT_RIGHT2 = 1.0 / 4.0;
const float SHIFT_RIGHT1 = 1.0 / 2.0;

void main()
{
    // Modifying this shader may also require modifications to Billboard._computeScreenSpacePosition

    // unpack attributes
    vec3 positionHigh = positionHighAndScale.xyz;
    vec3 positionLow = positionLowAndRotation.xyz;
    float scale = positionHighAndScale.w;

#if defined(ROTATION) || defined(ALIGNED_AXIS)
    float rotation = positionLowAndRotation.w;
#else
    float rotation = 0.0;
#endif

    float compressed = compressedAttribute0.x;

    vec2 pixelOffset;
    pixelOffset.x = floor(compressed * SHIFT_RIGHT7);
    compressed -= pixelOffset.x * SHIFT_LEFT7;
    pixelOffset.x -= UPPER_BOUND;

    vec2 origin;
    origin.x = floor(compressed * SHIFT_RIGHT5);
    compressed -= origin.x * SHIFT_LEFT5;

    origin.y = floor(compressed * SHIFT_RIGHT3);
    compressed -= origin.y * SHIFT_LEFT3;

#ifdef CLAMP_TO_GROUND
    vec2 depthOrigin = origin.xy;
#endif
    origin -= vec2(1.0);

    float show = floor(compressed * SHIFT_RIGHT2);
    compressed -= show * SHIFT_LEFT2;

#ifdef INSTANCED
    vec2 textureCoordinatesBottomLeft = czm_decompressTextureCoordinates(compressedAttribute0.w);
    vec2 textureCoordinatesRange = czm_decompressTextureCoordinates(eyeOffset.w);
    vec2 textureCoordinates = textureCoordinatesBottomLeft + direction * textureCoordinatesRange;
#else
    vec2 direction;
    direction.x = floor(compressed * SHIFT_RIGHT1);
    direction.y = compressed - direction.x * SHIFT_LEFT1;

    vec2 textureCoordinates = czm_decompressTextureCoordinates(compressedAttribute0.w);
#endif

    float temp = compressedAttribute0.y  * SHIFT_RIGHT8;
    pixelOffset.y = -(floor(temp) - UPPER_BOUND);

    vec2 translate;
    translate.y = (temp - floor(temp)) * SHIFT_LEFT16;

    temp = compressedAttribute0.z * SHIFT_RIGHT8;
    translate.x = floor(temp) - UPPER_BOUND;

    translate.y += (temp - floor(temp)) * SHIFT_LEFT8;
    translate.y -= UPPER_BOUND;

    temp = compressedAttribute1.x * SHIFT_RIGHT8;
    float temp2 = floor(compressedAttribute2.w * SHIFT_RIGHT2);

    vec2 imageSize = vec2(floor(temp), temp2);

#ifdef CLAMP_TO_GROUND
    float labelHorizontalOrigin = floor(compressedAttribute2.w - (temp2 * SHIFT_LEFT2));
    float applyTranslate = 0.0;
    if (labelHorizontalOrigin != 0.0) // is a billboard, so set apply translate to false
    {
        applyTranslate = 1.0;
        labelHorizontalOrigin -= 2.0;
        depthOrigin.x = labelHorizontalOrigin + 1.0;
    }

    depthOrigin = vec2(1.0) - (depthOrigin * 0.5);

    temp = compressedAttribute3.w;
    temp = temp * SHIFT_RIGHT12;
    vec2 dimensions;
    dimensions.y = (temp - floor(temp)) * SHIFT_LEFT12;
    dimensions.x = floor(temp);
#endif

#ifdef EYE_DISTANCE_TRANSLUCENCY
    vec4 translucencyByDistance;
    translucencyByDistance.x = compressedAttribute1.z;
    translucencyByDistance.z = compressedAttribute1.w;

    translucencyByDistance.y = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;

    temp = compressedAttribute1.y * SHIFT_RIGHT8;
    translucencyByDistance.w = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;
#endif

#ifdef ALIGNED_AXIS
    vec3 alignedAxis = czm_octDecode(floor(compressedAttribute1.y * SHIFT_RIGHT8));
    temp = compressedAttribute2.z * SHIFT_RIGHT5;
    bool validAlignedAxis = (temp - floor(temp)) * SHIFT_LEFT1 > 0.0;
#else
    vec3 alignedAxis = vec3(0.0);
    bool validAlignedAxis = false;
#endif

    vec4 pickColor;
    vec4 color;

    temp = compressedAttribute2.y;
    temp = temp * SHIFT_RIGHT8;
    pickColor.b = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    pickColor.g = (temp - floor(temp)) * SHIFT_LEFT8;
    pickColor.r = floor(temp);

    temp = compressedAttribute2.x;
    temp = temp * SHIFT_RIGHT8;
    color.b = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    color.g = (temp - floor(temp)) * SHIFT_LEFT8;
    color.r = floor(temp);

    temp = compressedAttribute2.z * SHIFT_RIGHT8;
    bool sizeInMeters = floor((temp - floor(temp)) * SHIFT_LEFT7) > 0.0;
    temp = floor(temp) * SHIFT_RIGHT8;

    pickColor.a = (temp - floor(temp)) * SHIFT_LEFT8;
    pickColor /= 255.0;

    color.a = floor(temp);
    color /= 255.0;

    ///////////////////////////////////////////////////////////////////////////

    vec4 p = czm_translateRelativeToEye(positionHigh, positionLow);
    vec4 positionEC = czm_modelViewRelativeToEye * p;

#ifdef CLAMP_TO_GROUND
    float eyeDepth = positionEC.z;
    v_rotationMatrix = mat2(1.0, 0.0, 0.0, 1.0);
#endif

    positionEC = czm_eyeOffset(positionEC, eyeOffset.xyz);
    positionEC.xyz *= show;

    ///////////////////////////////////////////////////////////////////////////

#if defined(EYE_DISTANCE_SCALING) || defined(EYE_DISTANCE_TRANSLUCENCY) || defined(EYE_DISTANCE_PIXEL_OFFSET) || defined(DISTANCE_DISPLAY_CONDITION) || defined(DISABLE_DEPTH_DISTANCE)
    float lengthSq;
    if (czm_sceneMode == czm_sceneMode2D)
    {
        // 2D camera distance is a special case
        // treat all billboards as flattened to the z=0.0 plane
        lengthSq = czm_eyeHeight2D.y;
    }
    else
    {
        lengthSq = dot(positionEC.xyz, positionEC.xyz);
    }
#endif

#ifdef EYE_DISTANCE_SCALING
    float distanceScale = czm_nearFarScalar(scaleByDistance, lengthSq);
    scale *= distanceScale;
    translate *= distanceScale;
    // push vertex behind near plane for clipping
    if (scale == 0.0)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

    float translucency = 1.0;
#ifdef EYE_DISTANCE_TRANSLUCENCY
    translucency = czm_nearFarScalar(translucencyByDistance, lengthSq);
    // push vertex behind near plane for clipping
    if (translucency == 0.0)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

#ifdef EYE_DISTANCE_PIXEL_OFFSET
    float pixelOffsetScale = czm_nearFarScalar(pixelOffsetScaleByDistance, lengthSq);
    pixelOffset *= pixelOffsetScale;
#endif

#ifdef DISTANCE_DISPLAY_CONDITION
    float nearSq = compressedAttribute3.x;
    float farSq = compressedAttribute3.y;
    if (lengthSq < nearSq || lengthSq > farSq)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

    // Note the halfSize cannot be computed in JavaScript because it is sent via
    // compressed vertex attributes that coerce it to an integer.
    vec2 halfSize = imageSize * scale * czm_resolutionScale * 0.5;
    halfSize *= ((direction * 2.0) - 1.0);

    vec2 originTranslate = origin * abs(halfSize);

#if defined(ROTATION) || defined(ALIGNED_AXIS)
    if (validAlignedAxis || rotation != 0.0)
    {
        float angle = rotation;
        if (validAlignedAxis)
        {
            vec4 projectedAlignedAxis = czm_modelViewProjection * vec4(alignedAxis, 0.0);
            angle += sign(-projectedAlignedAxis.x) * acos( sign(projectedAlignedAxis.y) * (projectedAlignedAxis.y * projectedAlignedAxis.y) /
                    (projectedAlignedAxis.x * projectedAlignedAxis.x + projectedAlignedAxis.y * projectedAlignedAxis.y) );
        }

        float cosTheta = cos(angle);
        float sinTheta = sin(angle);
        mat2 rotationMatrix = mat2(cosTheta, sinTheta, -sinTheta, cosTheta);
        halfSize = rotationMatrix * halfSize;

        #ifdef CLAMP_TO_GROUND
            v_rotationMatrix = rotationMatrix;
        #endif
    }
#endif

    if (sizeInMeters)
    {
        positionEC.xy += halfSize;
    }

    float mpp = czm_metersPerPixel(positionEC);

    if (!sizeInMeters)
    {
        originTranslate *= mpp;
    }

    positionEC.xy += originTranslate;
    if (!sizeInMeters)
    {
        positionEC.xy += halfSize * mpp;
    }

    positionEC.xy += translate * mpp;
    positionEC.xy += (pixelOffset * czm_resolutionScale) * mpp;
    gl_Position = czm_projection * positionEC;
    v_textureCoordinates = textureCoordinates;

#ifdef LOG_DEPTH
    czm_vertexLogDepth();
#endif

#ifdef DISABLE_DEPTH_DISTANCE
    float disableDepthTestDistance = compressedAttribute3.z;

    if (disableDepthTestDistance == 0.0 && czm_minimumDisableDepthTestDistance != 0.0)
    {
        disableDepthTestDistance = czm_minimumDisableDepthTestDistance;
    }

    if (disableDepthTestDistance != 0.0)
    {
        // Don't try to "multiply both sides" by w.  Greater/less-than comparisons won't work for negative values of w.
        float zclip = gl_Position.z / gl_Position.w;
        bool clipped = (zclip < -1.0 || zclip > 1.0);
        if (!clipped && (disableDepthTestDistance < 0.0 || (lengthSq > 0.0 && lengthSq < disableDepthTestDistance)))
        {
            // Position z on the near plane.
            gl_Position.z = -gl_Position.w;
#ifdef LOG_DEPTH
            czm_vertexLogDepth(vec4(czm_currentFrustum.x));
#endif
        }
    }
#endif

#ifdef CLAMP_TO_GROUND
    if (sizeInMeters) {
        translate /= mpp;
        dimensions /= mpp;
        imageSize /= mpp;
    }
    v_eyeDepthDistanceAndApplyTranslate.x = eyeDepth;
    v_eyeDepthDistanceAndApplyTranslate.y = disableDepthTestDistance;
    v_eyeDepthDistanceAndApplyTranslate.z = applyTranslate;
    v_originTextureCoordinateAndTranslate.xy = depthOrigin;
    v_originTextureCoordinateAndTranslate.zw = translate;
    v_textureCoordinateBounds = textureCoordinateBounds;
    v_dimensionsAndImageSize.xy = dimensions * scale;
    v_dimensionsAndImageSize.zw = imageSize * scale;
#endif

    v_pickColor = pickColor;

    v_color = color;
    v_color.a *= translucency;
}
