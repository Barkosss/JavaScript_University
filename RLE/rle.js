function EncodeEscape(Inf) {
    var count = 1; 
    let arr = [...Inf]; // РЎРѕС…СЂР°РЅСЏРµРј РІ РјР°СЃСЃРёРІ РјР°СЃСЃРёРІ РёР· СЃРёРјРІРѕР»РѕРІ СЃС‚СЂРѕРєРё
    let newArr = []; // РќРѕРІС‹Р№ РјР°СЃСЃРёРІ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ РєРѕРґРѕРІ ASCII СЃРёРјРІРѕР»РѕРІ
    for (let i = 0; i < arr.length; i++) { 
        if (arr[i] == arr[i + 1]) {
            count += 1; 
        }
        else { 

            if ((arr[i] == 35) && (arr[i + 1] != 35)) { 
                let sch=count;
                while (count > 0) {

                    if (count >= 256) { 
                        while (count >= 256) {
                            newArr.push(35, 255, 35) // Р”РѕР±Р°РІР»СЏРµРј РІ РЅРѕРІС‹Р№ РјР°СЃСЃРёРІ - 35 255 35 (#255#)
                            count -= 256
                        }
                    }
                    else { 
                        newArr.push(35, count-1, 35) // Р”РѕР±Р°РІР»СЏРµРј РІ РЅРѕРІС‹Р№ РјР°СЃСЃРёРІ - 35 count-1 35 (#РљРѕР»-РІРѕ РїРѕРІС‚.СЃРёРјРІРѕР»РѕРІ РјРёРЅСѓСЃ РѕРґРёРЅ#)
                        count = 0 // РџСЂРёСЂР°РІРЅРёРІР°РµРј РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ Рє РЅСѓР»СЋ РґР»СЏ РІС‹С…РѕРґР° РёР· С†РёРєР»Р° While
                    }
                }
                count = 1 
            }
            else if (arr[i] != 35) { 
                while (count > 0) { 
                    if (count >= 259) { 
                        while (count >= 259) {
                            newArr.push(35, 255, arr[i]) // Р”РѕР±Р°РІР»СЏРµРј РІ РЅРѕРІС‹Р№ РјР°СЃСЃРёРІ - 35 255 arr[i] (#255РўРµРє.СЃРёРјРІРѕР»)
                            count -= 259 
                        }
                    }
                    else if (count < 4) { // Р•СЃР»Рё РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ РјРµРЅСЊС€Рµ 4
                        for (let j = 0; j < count; j++) { 
                            newArr.push(arr[i]) 
                        }
                        count = 0 // РџСЂРёСЂР°РІРЅРёРІР°РµРј РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ Рє РЅСѓР»СЋ (РґР»СЏ РІС‹С…РѕРґР° РёР· С†РёРєР»Р°)
                    }
                    else { // Р•СЃР»Рё РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ Р±РѕР»СЊС€Рµ 4 Рё РјРµРЅСЊС€Рµ 259
                        newArr.push(35, count - 4, arr[i]) // Р”РѕР±Р°РІР»СЏРµРј РІ РЅРѕРІС‹Р№ РјР°СЃСЃРёРІ - 35 РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ - 4 С‚РµРєСѓС‰РёР№ СЃРёРјРІРѕР»
                        count = 0 // РџСЂРёСЂР°РІРЅРёРІР°РµРј РєРѕР»-РІРѕ РїРѕРІС‚РѕСЂРµРЅРёР№ Рє РЅСѓР»СЋ (РґР»СЏ РІС‹С…РѕРґР° РёР· С†РёРєР»Р°)
                    }
                }
            }
            count = 1 // РџСЂРёСЂР°РІРЅРёРІР°РµРј Рє РїРµСЂРµРјРµРЅРЅРѕР№ СЃ РєРѕР»-РІРѕРј РїРѕРІС‚РѕСЂРµРЅРёР№ РµРґРёРЅРёС†Сѓ (Р”Р»СЏ СѓС‡С‘С‚Р° РїРµСЂРІРѕРіРѕ СЃРёРјРІРѕР»Р°)
        }
    }

    Inf = newArr; // РџРµСЂРµРјРµРЅРЅР°СЏ content С‚РµРїРµСЂСЊ СЂР°РІРЅР° РјР°СЃСЃРёРІСѓ, РєРѕС‚РѕСЂС‹Р№ РІ newArr (newArr С…СЂР°РЅРёС‚ РІ СЃРµР±Рµ РјР°СЃСЃРёРІ РёР· РєРѕРґРѕРј ASCII СЃРёРјРІРѕР»РѕРІ)
    return Inf; 
}

function DecodeEscape(Inf) {
    let arr = [...Inf]; // РЎРѕС…СЂР°РЅСЏРµРј РјР°СЃСЃРёРІ, РєРѕС‚РѕСЂС‹Р№ С…СЂР°РЅРёС‚ РІ СЃРµР±Рµ РєРѕРґС‹ ASCII СЃРёРјРІРѕР»РѕРІ
    let newArr = []; // РќРѕРІС‹Р№ РјР°СЃСЃРёРІ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ
    let count = 0 
    for (let i = 0; i < content.length; i++) { 
        if ((arr[i] == 35) && (arr[i + 2] == 35)) {
            for (let n = 0; n < arr[i + 1] + 1; n++) { 
                newArr.push(35) 
            }
            i += 2 
        }
        else if (arr[i] == 35) { 
            count = arr[i + 1] + 4; // РЎРѕС…СЂР°РЅСЏРµРј: ASCII РєРѕРґ СЃР»РµРґСѓСЋС‰РµРјСѓ СЃРёРјРІРѕР»Р° + 4
        }
        else { 
            if ((arr[i] + 4 == count)) { // Р•СЃР»Рё РєРѕРґ С‚РµРєСѓС‰РµРіРѕ СЃРёРјРІРѕР»Р° + 4 СЂР°РІРµРЅ СЃС‡С‘С‚С‡РёРєСѓ
                for (let k = 0; k < count; k++) { 
                    newArr.push(arr[i + 1]) 
                } 
                i += 1 
            }
            else { 
                newArr.push(arr[i]) 
            }
            count = 0 
        }
    }
    Inf = newArr; // РџРµСЂРµРјРµРЅРЅР°СЏ content С‚РµРїРµСЂСЊ СЂР°РІРЅР° РјР°СЃСЃРёРІСѓ, РєРѕС‚РѕСЂС‹Р№ РІ newArr (newArr С…СЂР°РЅРёС‚ РІ СЃРµР±Рµ РјР°СЃСЃРёРІ РёР· РєРѕРґРѕРј ASCII СЃРёРјРІРѕР»РѕРІ)
    return Inf; // Р’РѕР·РІСЂР°С‰Р°РµРј РјР°СЃСЃРёРІ content
}

function jumpCode(Inf){
    let arr=[...Inf]; // РЎРѕС…СЂР°РЅСЏРµРј РІ РјР°СЃСЃРёРІ РјР°СЃСЃРёРІ РёР· СЃРёРјРІРѕР»РѕРІ СЃС‚СЂРѕРєРё
    let newArr=[]; // РјР°СЃСЃРёРІ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ Р·Р°РєРѕРґРёСЂРѕРІР°РЅРЅС‹С… СЃРёРјРІРѕР»РѕРІ
    
    console.log(arr)
    for (let i=0; i<arr.length; i++){
        let arrAS=[];
        let count_same=0;
        if ((arr[i]==arr[i+1]) * (arr[i]==arr[i+2])){
            while ((arr[i]==arr[i+1])*(count_same<129)){
                arrAS.push(arr[i])
                count_same+=1;
                i+=1;
            }   
            newArr.push(count_same+126, arr[i]) // РѕС‚ 0 РґРѕ 127 РєРѕРґС‹ (РІСЃРµРіРѕ 128)=> С‚Р°Рє РєР°Рє РЅР°С‡РёРЅР°РµРј СЃ 1, С‡С‚РѕР±С‹ СѓС‡РёС‚С‹РІР°С‚СЊ 0 РґРѕР±Р°РІР»СЏРµРј 126
        }
        else{
            while (!((arr[i] == arr[i + 1]) && (arr[i] == arr[i + 2])) && (count_same < 127)){
                count_same+=1;
                arrAS.push(arr[i])
                i+=1;
            }
            newArr.push(count_same-1) // -1, РїРѕС‚РѕРјСѓ С‡С‚Рѕ СѓС‡РёС‚С‹РІР°РµРј 0
            newArr.push(...arrAS)
            i-=1;
        }

    }
    Inf=newArr;
    return Inf;
}
function JumpDecode(Inf){
    let arr=[...Inf];
    let newArr=[];
    for (let i=0; i<Inf.length;i++){
        if (arr[i]>=128){
            while (arr[i]>125){
                newArr.push(arr[i+1])
                arr[i]-=1;
            }
            i+=1;
        }
        else{
            newArr.push(...arr.slice(i+1,arr[i]+i+2));
            i+=arr[i]+1;
        }
    } 
    Inf=newArr;
    return Inf;
}
const error = require('console'); // РРјРїРѕСЂС‚ РјРѕРґСѓР»СЏ console РІ РїРµСЂРµРјРµРЅРЅСѓСЋ error
const fs = require('fs'); // Р¤СѓРЅРєС†РёСЏ РґР»СЏ С‡С‚РµРЅРёСЏ С„Р°Р№Р»РѕРІ - File System
const args = process.argv; // РњР°СЃСЃРёРІ РёР· Р°СЂРіСѓРјРµРЅС‚РѕРІ, РєРѕС‚РѕСЂС‹Рµ СѓРєР°Р·Р°РЅС‹ РІ РєРѕРЅСЃРѕР»Рµ
const inp = args[4]; // Р¤Р°Р№Р» РґР»СЏ С‡С‚РµРЅРёСЏ
const otp = args[5]; // Р¤Р°Р№Р» РґР»СЏ Р·Р°РїРёСЃРё
const content = fs.readFileSync(inp); // Р§С‚РµРЅРёРµ СЃС‚СЂРѕРєРё РёР· С„Р°Р№Р»Р° inp
let veryNewContent = content;
if (args[3] == 'escape') { // Р•СЃР»Рё РёСЃРїРѕР»СЊР·СѓРµРј РјРµС‚РѕРґ "Escape"
    if (args[2] == 'encode') { // РљРѕРґРёСЂРѕРІР°РЅРёРµ РґР°РЅРЅС‹С…
        veryNewContent = EncodeEscape(content) // Р—Р°РїСѓСЃРє С„СѓРЅРєС†РёРё РґР»СЏ РєРѕРґРёСЂРѕРІР°РЅРёСЏ СЃС‚СЂРѕРєРё С‡РµСЂРµР· РјРµС‚РѕРґ "Escape"
    }
    else if (args[2] == 'decode') { // Р”РµРєРѕРґРёСЂРѕРІР°РЅРёРµ РґР°РЅРЅС‹С…
        veryNewContent = DecodeEscape(content) // Р—Р°РїСѓСЃРє С„СѓРЅРєС†РёРё РґР»СЏ РґРµРєРѕРґРёСЂРѕРІР°РЅРёСЏ СЃС‚СЂРѕРєРё, Р·Р°РєРѕРґРёСЂРѕРІР°РЅРЅС‹Р№ РјРµС‚РѕРґРѕРј "Escape"
    }
    else error // Р’С‹РІРѕРґ РѕС€РёР±РєРё
    // Р”Р»СЏ СЃРѕР·РґР°РЅРёСЏ Р±СѓС„РµСЂР° СЃСЂР°Р·Сѓ РЅСѓР¶РЅРѕРіРѕ СЂР°Р·РјРµСЂР° РІ Node.js РёРјРµРµС‚СЃСЏ РјРµС‚РѕРґ Buffer.from(), РєРѕС‚РѕСЂС‹Р№ РїСЂРёРЅРёРјР°РµС‚ СЃС‚СЂРѕРєСѓ Рё СЃРѕР·РґР°РµС‚ РїРѕРґ РЅРµРµ Р±СѓС„РµСЂ.
    const buffer = Buffer.from(veryNewContent); // РСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РґР»СЏ СЃРѕР·РґР°РЅРёСЏ Р±СѓС„РµСЂР° РЅСѓР¶РЅРѕРіРѕ СЂР°Р·РјРµСЂР°. РћРЅ РїСЂРёРЅРјРёР°РµС‚ СЃС‚СЂРѕРєСѓ. РџРѕРґСЂРѕР±РЅРµРµ ^
    fs.writeFileSync(otp, buffer); // Р—Р°РїРёСЃС‹РІР°РµРј Р±СѓС„РµСЂ (^) РІ С„Р°Р№Р» РґР»СЏ Р·Р°РїРёСЃРё
    console.log(veryNewContent) // Р’С‹РІРѕРґ РІ РєРѕРЅСЃРѕР»СЊ (Р”РµР±Р°Рі)
    console.log(buffer) // Р’С‹РІРѕРґ РІ РєРѕРЅСЃРѕР»СЊ (Р”РµР±Р°Рі)
    const newContent = fs.readFileSync(otp); // Р§РёС‚Р°РµРј РЅРѕРІС‹Р№ РєРѕРЅС‚РµРЅС‚ РёР· С„Р°Р№Р»Р° РґР»СЏ Р·Р°РїРёСЃРё
}
else if (args[3] == 'jump') { // Р•СЃР»Рё РёСЃРїРѕР»СЊР·СѓРµРј РјРµС‚РѕРґ "Jump"
    if (args[2] == 'encode') { // РљРѕРґРёСЂРѕРІР°РЅРёРµ РґР°РЅРЅС‹С…
        veryNewContent = jumpCode(content) // Р—Р°РїСѓСЃРє С„СѓРЅРєС†РёРё РґР»СЏ РєРѕРґРёСЂРѕРІР°РЅРёСЏ СЃС‚СЂРѕРєРё РјРµС‚РѕРґРѕРј "Jump"
    }
    else if (args[2] == 'decode') { // Р”РµРєРѕРґРёСЂРѕРІР°РЅРёРµ РґР°РЅРЅС‹С…
        veryNewContent = JumpDecode(content) // Р—Р°РїСѓСЃРє С„СѓРЅРєС†РёРё РґР»СЏ РґРµРєРѕРґРёСЂРѕРІР°РЅРёСЏ СЃС‚СЂРѕРєРё, Р·Р°РєРѕРґРёСЂРѕРІР°РЅРЅС‹Р№ РјРµС‚РѕРґРѕРј "Jump"
    }
    else error
    const buffer = Buffer.from(veryNewContent); // РСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РґР»СЏ СЃРѕР·РґР°РЅРёСЏ Р±СѓС„РµСЂР° РЅСѓР¶РЅРѕРіРѕ СЂР°Р·РјРµСЂР°. РћРЅ РїСЂРёРЅРёРјР°РµС‚ СЃС‚СЂРѕРєСѓ
    fs.writeFileSync(otp, buffer); // Р—Р°РїРёСЃС‹РІР°РµРј Р±СѓС„РµСЂ (^) РІ С„Р°Р№Р» РґР»СЏ Р·Р°РїРёСЃРё
    console.log(buffer) 
    console.log(veryNewContent)
}
else error // Р’С‹РІРѕРґ РѕС€РёР±РєРё