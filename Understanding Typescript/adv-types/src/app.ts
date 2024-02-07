type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    startDate: Date;
};

// interface ElevatedEmployee extends Employee, Admin {}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
    name: 'Nik',
    privileges: ['create-server'],
    startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: string, b: string): string;
function add(a: number, b: number): number;
function add(a: Combinable, b: Combinable) {
    if (typeof a === 'string' || typeof b === 'string') {
        // type guard
        return a.toString() + b.toString();
    }
    return a + b;
}

const result = add('1', '2');

const fetchUserData = {
    id: 'u1',
    name: 'Nik',
    job: { title: 'CEO', description: 'My own company' },
};

// console.log(fetchUserData.job && fetchUserData.job.title);
console.log(fetchUserData?.job?.title);

const userInput = null;

const storedData = userInput ?? 'DEFAULT';

type UnknownEmployee = Employee | Admin;

function printEmployeeInfo(emp: UnknownEmployee) {
    console.log('Name: ' + emp.name);
    if ('privileges' in emp) {
        console.log('Privileges: ' + emp.privileges);
    }
    if ('startDate' in emp) {
        console.log('Start date: ' + emp.startDate);
    }
}

printEmployeeInfo(e1);

class Car {
    drive() {
        console.log('Driving...');
    }
}

class Truck {
    drive() {
        console.log('Driving a truck...');
    }

    loadCargo(amount: number) {
        console.log('Loading cargo ... ' + amount);
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();
    // if ('loadCargo' in vehicle) {
    //     vehicle.loadCargo(1000);
    // } one way to do it
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
    type: 'bird';
    flyingSpeed: number;
}

interface Horde {
    type: 'horse';
    runningSpeed: number;
}

type Animal = Bird | Horde;

function moveAnimal(animal: Animal) {
    let speed;
    switch (animal.type) {
        case 'bird':
            speed = animal.flyingSpeed;
            break;
        case 'horse':
            speed = animal.runningSpeed;
            break;
    }
    console.log('Moving at ' + speed);
}

moveAnimal({ type: 'bird', flyingSpeed: 20 });

// const para = <HTMLInputElement>document.getElementById('user-input')!;
const para = document.getElementById('user-input')! as HTMLInputElement;

para.value = 'Hi there!';

interface ErrorContainer {
    [key: string]: string;
}

const errorBag: ErrorContainer = {
    email: 'Not valid email!',
    username: 'Must start with a capital character!',
};
