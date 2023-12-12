const fs = require('fs');

const alg = process.argv[process.argv.length-3];
const strFile = fs.readFileSync(process.argv[process.argv.length-2], 'utf8');
const sstrFile = fs.readFileSync(process.argv[process.argv.length-1], 'utf8');
let ints = new Array();
let ns = 0;
let ешь = 0;
let tt = false;
let cc = false;

if(!fs.existsSync(process.argv[process.argv.length-2]))
	console.log('no such a string file in directory');

if(!fs.existsSync(process.argv[process.argv.length-1]))
	console.log('no such a substring file in directory');

let nnn = 0;
for(let i = 2;i<process.argv.length-2;i++){
	if(process.argv[i]==='-t') tt = true;
	if(process.argv[i]==='-n'){
		if(!isNaN(Number(process.argv[i+1])))
			nnn = Number(process.argv[i+1]);
		else console.log('there must be a number after "-n"');
	}
}


let arr = new Array(256);
function BM(str, sstr){
	let m = sstr.length;
	for(let i = 0; i<m; i++)
		arr[sstr.charCodeAt(i)] = i;
	console.log(arr)
	let j = 0;
	while(j<str.length){
		let sh = -1;
		let ii = 0;
		cc = true;
		for(let i = m-1; i>-1; i--){
			console.log(str[j+i], sstr[i])
			if(str[j+i]!=sstr[i]){
				cc = false;
				if(m-1 - i === 0) sh = m-1-i;
				ii = i;
				break;
			}
		}
		if(cc)ints.push(j);
		console.log(j+ii)
		j += Math.max(1, m - arr[str.charCodeAt(j+ii)] - 1 - sh);
		
		ns++;
		if(ints.length === nnn && nnn!=0) break;
	}
	return ns;
}
let startTime = performance.now(); 
console.log('number of found substrings:', BM(strFile, sstrFile));
let endTime = performance.now();
ешь = endTime - startTime;

if(nnn>0)
	console.log('first',nnn,'entries:', ints);
else console.log('first indexes of matches:', ints);
if(tt)console.log('time used to find substrings:', ешь);