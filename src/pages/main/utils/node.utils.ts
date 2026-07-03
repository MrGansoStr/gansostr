
export const gen_coordinate = (start:number = 0, end:number = 10, salt:number= 2 ) => {
    let i: number = start;
    const array = []
    for ( i ; i < end; i = i + salt) {
        array.push(i)
    }
    return array;
}

export const getRandomIndexInArray = (array: number[] = []) => {
    const rand_index:number = Math.floor(Math.random() * array.length)
    return rand_index
}

export const gen_combination = (x: number[] = [], y: number[] = [], z: number[] = []) => {
    const index_x: number = getRandomIndexInArray(x);
    const index_y: number = getRandomIndexInArray(y);
    const index_z: number = getRandomIndexInArray(z);

    const num_x: number = x[index_x]
    const num_y: number = y[index_y]
    const num_z: number = z[index_z]
    return {indexes: [index_x, index_y, index_z], nums: [num_x, num_y, num_z]}
}

export const gen_positions = (quantity: number = 10, radius: number = 40) => {
    const positions: [number, number, number][] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < quantity; i++) {
        const y = 1 - (i / Math.max(quantity - 1, 1)) * 2;
        const r = Math.sqrt(Math.max(1 - y * y, 0));
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        positions.push([x * radius, y * radius, z * radius]);
    }

    return positions;
}
