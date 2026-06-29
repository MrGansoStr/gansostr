
export const gen_coordinate = (start:number = 0, end:number = 10, salt:number= 2 ) => {
    let i: number = start;
    const array = []
    for ( i ; i < end; i = i + salt) {
        // console.log(i)
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
    // for(let i: number = 0; i < x.length; i++) { 
    
    const num_x: number = x[index_x]
    const num_y: number = y[index_y]
    const num_z: number = z[index_z] 
    return {indexes: [index_x, index_y, index_z], nums: [num_x, num_y, num_z]}
    // }

}

export const gen_positions = (quantity: number = 10) => {
    const calc_quantity = quantity * 2;
    const calc_quantity_salt_3 = quantity * 3;
    
    const x: number[] = gen_coordinate(0, calc_quantity, 2);
    const y: number[] = gen_coordinate(0, calc_quantity_salt_3, 3);
    const z: number[] = gen_coordinate(0, calc_quantity, 2);

    const uniquePositions: Set<number[]> = new Set();
    // console.log(uniquePositions, x, y, z)
    while (x.length != 0) {
        const combinations = gen_combination(x, y, z);
        if (!uniquePositions.has(combinations.nums)) {
            uniquePositions.add(combinations.nums);
            x.splice(combinations.indexes[0], 1);
            y.splice(combinations.indexes[1], 1);
            z.splice(combinations.indexes[2], 1);
        }
    }

    // console.log(uniquePositions)
    return uniquePositions;
}