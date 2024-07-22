export function splitToPoints(array, target) {
    let points = [];
    for (let packet of array) {
        points.push({ x: packet["EPOCH"], y: packet[target] });
    }
    return points;
}