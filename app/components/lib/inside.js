export default function inside(target, radius, point) {
	const a = target.x;
	const b = target.y;
	const { x, y } = point;

	let r = radius;
	const dist = (a - x) * (a - x) + (b - y) * (b - y);
	r *= r;

	return dist < r;
}
