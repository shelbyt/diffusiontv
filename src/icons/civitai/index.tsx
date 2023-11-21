import React from 'react';

interface SvgProps {
	className?: string;
	size?: number; // Size in pixels
    color?: string; // Color of the SVG

}

const Civitai: React.FC<SvgProps> = ({ className, size = 24, color = '#1067eaff' }) => {
	const svgSize = `${size}px`; // Convert the size to a pixel string

	return (
		<svg
			className={className}
			width={svgSize}
			height={svgSize}
			viewBox="0 0 300 300"
			preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg"
		><g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
			fill={color}
			stroke="none">
				<path d="M1495 2501 c-4 -3 -199 -117 -433 -252 l-427 -246 -3 -506 -2 -505
57 -33 c32 -18 171 -98 308 -177 138 -80 266 -154 285 -165 19 -10 76 -43 127
-73 51 -30 94 -54 98 -54 5 0 52 26 483 276 117 68 234 136 260 150 26 14 66
37 90 51 l42 25 -2 505 -3 505 -437 253 c-240 139 -440 250 -443 246z m113
-81 c48 -28 94 -54 102 -59 41 -25 483 -279 539 -310 35 -20 74 -46 87 -58
l24 -22 -1 -474 c0 -352 -3 -479 -12 -490 -12 -14 -122 -87 -132 -87 -3 0 -65
-35 -138 -79 -268 -159 -556 -321 -572 -321 -8 0 -122 62 -253 137 -130 75
-264 152 -297 171 -33 18 -64 37 -70 42 -5 4 -37 22 -70 39 -70 37 -89 48
-132 79 l-32 22 -1 473 c0 357 3 478 13 496 6 13 32 34 57 48 25 14 62 36 82
49 21 13 39 24 42 24 2 0 129 73 282 161 309 179 363 208 382 209 7 0 52 -23
100 -50z"/>
				<path d="M1466 2165 c-75 -39 -132 -71 -141 -78 -5 -4 -64 -38 -130 -76 -186
-105 -247 -144 -268 -172 -18 -25 -19 -45 -18 -338 1 -280 3 -315 19 -336 14
-20 68 -55 167 -111 11 -6 76 -44 145 -84 162 -95 249 -140 269 -140 19 0 18
0 221 117 85 50 195 113 243 141 121 70 126 78 127 183 0 77 -2 88 -23 107
-22 21 -33 22 -177 22 l-153 0 -76 -42 c-42 -22 -95 -52 -118 -65 -23 -12 -47
-23 -54 -23 -6 0 -45 20 -87 45 -41 25 -76 45 -79 45 -2 0 -13 8 -24 19 -18
16 -19 29 -17 132 l3 113 75 46 c135 83 123 83 253 7 l112 -65 158 -1 c155 -2
157 -1 182 23 23 23 25 33 25 109 0 81 -1 84 -33 115 -18 18 -36 32 -39 32 -3
0 -69 37 -147 83 -238 140 -360 207 -376 207 -5 0 -23 -7 -39 -15z m337 -190
l257 -147 0 -92 0 -91 -162 5 -163 5 -116 68 -116 67 -127 -72 -126 -72 0
-141 0 -141 127 -72 126 -72 122 70 122 70 157 0 157 0 -3 -91 -3 -90 -235
-135 c-129 -75 -253 -146 -275 -159 l-40 -23 -275 158 -275 159 -3 324 -2 324
197 114 c109 62 234 134 278 160 70 42 83 46 100 35 11 -7 136 -79 278 -161z"/>

			</g>
		</svg>
	);
};

export default Civitai;
