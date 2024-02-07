// const userName = 'Nik';
// let age = 30;

// function add(a: number, b: number) {
//     let result;
//     result = a + b;
//     return result;
// }

// console.log(result);

// if (age > 20) {
//     let isOld = true;
// }

// console.log(isOld);

// const add = (a: number, b: number) => a + b;

// console.log(add(2, 5));

// const printOutput = (output: string | number) => console.log(output);

// printOutput(add(2, 5));

// const button = document.querySelector('button');

// if (button) {
//     button.addEventListener('click', (event) => console.log(event));
// }

// const hobbies = ['Sports', 'Cooking'];
// const activeHobbies = ['Hiking'];

// activeHobbies.push(...hobbies);

// const person2 = { ...person };

// const add = (...numbers: number[]) => {
//     return numbers.reduce((a, b) => a + b, 0);
// };

// const addedNumbers = add(1, 2, 3, 4, 1, 2, 3, 4);

// console.log(addedNumbers);

// const [a, b, ...remaining] = hobbies;

const person: { fname: string; age: number } = {
    fname: 'Nik',
    age: 30,
};

const { fname, age } = person;

console.log(fname);
console.log(age);
