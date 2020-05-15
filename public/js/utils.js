const drawTriangle = (x0, y0, r, angle) => {
  const n = 3;
  let points = new Array(n).fill(0).map((p, i) => {
    const a = i / n * 2 * Math.PI;
    const x = x0 + r * Math.cos(a);
    const y = y0 + r * Math.sin(a);
    return [x, y];
  });
  // return points;
  triangle(
    points[0][0],
    points[0][1],
    points[1][0],
    points[1][1],
    points[2][0],
    points[2][1],
  );
}