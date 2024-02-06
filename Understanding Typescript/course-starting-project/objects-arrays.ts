// const person: {
//     name: string;
//     age: number;
// } = {
//     name: 'Nik',
//     age: 30,
// }; longer way to write it, the better syntax is the one below

// const person: {
//     name: string;
//     age: number;
//     hobbies: string[];
//     role: [number, string];
// } = {
//     name: 'Nik',
//     age: 30,
//     hobbies: ['Sports', 'Strings'],
//     role: [2, 'author'],
// };

enum Role {
    admin,
    read_only,
    author,
}

const person = {
    name: 'Nik',
    age: 30,
    hobbies: ['Sports', 'Strings'],
    role: Role.admin,
};

let favACtivity: string[];
favACtivity = ['Sports'];

console.log(person.name);
