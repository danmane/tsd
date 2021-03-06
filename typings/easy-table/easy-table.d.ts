// Type definitions for easy-table 0.2.0
// Project: https://github.com/eldargab/easy-table
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
interface EasyTableStatic {
	new():EasyTable;
	printArray(array:any[], cellPrinter?:EasyTableCellPrinter, tablePrinter?:EasyTablePrinter):string;
	printObject(object:any, cellPrinter?:EasyTableCellPrinter, tablePrinter?:EasyTablePrinter):string;

	//printer helpers
	Number(length:number):EasyTableCellPrinter;
	RightPadder(char:string):EasyTableCellPrinter;
	LeftPadder(char:string):EasyTableCellPrinter;
}

interface EasyTable {
	cell:EasyTableCell;
	newRow():void;
	toString():string;
	printTransposed():string;
	print():string;

	sort(fields:string):void;
	sort(comparer:(a:any, b:any) => number):void;

	total(label:string, accumulator:EasyTableAccumulator, totalPrinter:EasyTableCellPrinter):void;
}
interface EasyTableCell extends Function {
	(label:string, value:any, printer?:EasyTableCellPrinter, width?:number):void;
}
interface EasyTableCellPrinter extends Function{
	(obj:any, cell:EasyTableCell):string;
}
interface EasyTablePrinter extends Function{
	(table:EasyTable):string;
}
interface EasyTableAccumulator extends Function{
	(sum:number, val:number, index:number, length:number):number;
}

declare module "easy-table" {
export = EasyTable;
}