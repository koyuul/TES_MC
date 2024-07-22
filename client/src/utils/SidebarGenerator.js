export function generateSidebarLabels(id, array) {
    let labels = [];
    for (let key of Object.keys(array[0])) {
        labels.push({ id: id + "_" + key, name: key });
    }
    return labels;
}
