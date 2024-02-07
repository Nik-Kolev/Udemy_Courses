abstract class Department {
    static fiscalYear = 2020;
    // private readonly id: string;
    // private name: string;
    protected employees: string[] = [];

    constructor(protected readonly id: string, public name: string) {
        // this.name = n;
        // console.log(Department.fiscalYear);
    }

    static createEmployee(name: string) {
        return { name };
    }

    abstract describe(this: Department): void;

    addEmployee(employee: string) {
        // this.id = 2;
        this.employees.push(employee);
    }

    printEmployeeInfo() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    constructor(id: string, public admin: string[]) {
        super(id, 'IT');
    }

    describe() {
        console.log('IT department');
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;
    private static instance: AccountingDepartment;

    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error('No report found.');
    }

    set mostRecentReport(value: string) {
        if (!value) {
            throw new Error('Please insert a value here!');
        }
        this.addReport(value);
    }

    private constructor(id: string, private reports: string[]) {
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AccountingDepartment('d2', []);
        return this.instance;
    }

    describe() {
        console.log('Accounting Department - ID: ' + this.id);
    }

    addEmployee(name: string) {
        if (name === 'Nik') {
            return;
        }
        this.employees.push(name);
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports() {
        console.log(this.reports);
    }
}

const employee1 = Department.createEmployee('Axm');
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment('d1', ['Nik']);

it.addEmployee('Nik');
it.addEmployee('Petar');

// accounting.employees[2] = 'Anna';

it.describe();
it.printEmployeeInfo();

console.log(it);

// const accountCopy = { name: 's', describe: accounting.describe };

// accountCopy.describe();

// const accounting = new AccountingDepartment('d2', []);

const accounting = AccountingDepartment.getInstance();

// console.log(accounting.mostRecentReport);
accounting.mostRecentReport = 'asd';

accounting.addReport('something something');

console.log(accounting.mostRecentReport);

accounting.addEmployee('Max');
// accounting.printEmployeeInfo();
// accounting.printReports();

accounting.describe();
