const fs = require('fs');

const alg = process.argv[process.argv.length-3];
const strFile = fs.readFileSync(process.argv[process.argv.length-2], 'utf8');
const sstrFile = fs.readFileSync(process.argv[process.argv.length-1], 'utf8');
let ints = new Array();
let ns = 0;
let cols = new Array();
let tim = 0;

if(strFile === undefined)
	console.log('no such a string file in directory');

if(sstrFile === undefined)
	console.log('no such a substring file in directory');

let n = 0;
let sm = 0;
let hash = 0;

function Brute(str, substr){
	for (let i =0; i<str.length;i++){
		resl = '';
		if(str[i]===substr[0]){
			for(let j = i; j< str.length; j++){
				resl+=str[j];
				if(resl === substr){
					n++;
					ints.push(i);
					break;
				}
			}
		}
	}
	return n;
}
function H1(str, substr){
	let len = substr.length;
	for(let i = 0; i<len; i++){
		sm+=substr[i].charCodeAt();
		hash+=str[i].charCodeAt();
	}
	
	for(let i = 0; i<str.length-len-1; i++){
		if(hash===sm){
			n+=1;
			ints.push(i);
			cols.push(str.slice(i,i+len))
		}
		hash-=str[i].charCodeAt();
		hash+=str[i+len-1].charCodeAt();
	}
	return n;
}
function H2(str, substr){
	let len = substr.length;
	for(let i = 0; i<len; i++){
		sm+=substr[i].charCodeAt()**2;
		hash+=str[i].charCodeAt()**2;
	}
	
	for(let i = 0; i<str.length-len-1; i++){
		if(hash===sm){
			n+=1;
			ints.push(i);
			cols.push(str.slice(i,i+len))
		}
		hash-=str[i].charCodeAt()**2;
		hash+=str[i+len-1].charCodeAt()**2;
	}
	return n;
}
function H3(str, substr){
	let len = substr.length;
	for(let i = 0; i<len; i++){
		sm+=substr[i].charCodeAt()*(2**(len-1-i));
		hash+=str[i].charCodeAt()*(2**(len-1-i));
	}
	
	for(let i = 0; i<str.length-len; i++){
		if(hash===sm){
			n+=1;
			ints.push(i);
			cols.push(str.slice(i,i+len))
		}
		hash-=str[i].charCodeAt()*(2**(len-1));
		hash*=2;
		hash+=str[i+len].charCodeAt();
	}
	return n;
}
if(alg==='b'){
	let startTime = performance.now(); 
	console.log('number of found substrings:', Brute(strFile, sstrFile));
	let endTime = performance.now();
	ешь = endTime - startTime;
}
if(alg==='h1'){
	let startTime = performance.now(); 
	console.log('number of found substrings:', H1(strFile, sstrFile));
	let endTime = performance.now();
	tim = endTime - startTime;
}
if(alg==='h2'){
	let startTime = performance.now(); 
	console.log('number of found substrings:', H2(strFile, sstrFile));
	let endTime = performance.now();
	tim = endTime - startTime;
}
if(alg==='h3'){
	let startTime = performance.now(); 
	console.log('number of found substrings:', H3(strFile, sstrFile));
	let endTime = performance.now();
	tim = endTime - startTime;
}
for(let i = 2;i<process.argv.length-3;i++){
	if(process.argv[i]==='-t') console.log('time used to find substrings:', tim);
	if(process.argv[i]==='-n'){
		if(!isNaN(Number(process.argv[i+1])))
			console.log('first',Number(process.argv[i+1]),'entries:', ints.slice(0,Number(process.argv[i+1])));
		else console.log('there must be a number after "-n"');
	} 
	if(process.argv[i]==='-c'){
		let m =0;
		for (let i = 0; i<cols.length; i++){
			if(cols[i]!=sstrFile)m++;
		}
		console.log('number of collisions:', m);
	}
}