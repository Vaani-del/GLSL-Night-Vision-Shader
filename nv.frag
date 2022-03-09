// Color filter
// Values are the relative strengths of the RGB channels
// Filter color is normalized so don't worry about unbalanced values
// Pure white means grayscale/monochrome filter
// Whiteclip is how white the brightest areas are. This can be negative
vec3 colorFilter = normalize(vec3(0.00, 1.0, 0.75)); // NVG color
float whiteclip = 1.0;

//---------//
// Some luminance standards:
	// ITU-R BT.601
	// vec3 luminance = vec3(0.299, 0.587, 0.114);
	// BT 701 luminance
	// vec3 luminance = vec3(0.2126, 0.7152, 0.0722);
	// SMPTE 240M
	// vec3 luminance = vec3(0.212, 0.701, 0.087);

void main()
{
	// Exposure curve
	float expcurve = 2.0 * ((150.0 - abs(exposure)) / 100.0);
	float exp = abs(exposure) / expcurve;

	// Get input pixels
	vec3 color = texture(InputTexture, res).rgb;

	// Desaturate
	// BT 701 luminance
	vec3 luminance = vec3(0.2126, 0.7152, 0.0722);
	color = dot(color.rgb, luminance);

	// Multiply by exposure
	color *= max(exp, 1.0);

	// Clamp
	color = vec3(
		clamp(color.r, 0.0, 1.0),
		clamp(color.g, 0.0, 1.0),
		clamp(color.b, 0.0, 1.0));

	// Filter channels for preferred color
	color *= clamp(colorFilter + (color * whiteclip), 0.0, 1.0);

	// Output
	FragColor = vec4(color, 1.0);
}
