const opentype = require("opentype.js");
const fs = require('fs');
const font = opentype.loadSync(`node_modules/@fontsource/roboto/files/roboto-all-400-normal.woff`);
const alphabetChars = '!@#$%^&*()_+}{POIUYTREWQASDFGHJKL:"|?><MNBVCXZ~`zxcvbnm,./\\\';lkjhgfdsaqwertyuiop[]=-0987654321§ ';
const randomList = alphabetChars.split('');
randomList.sort(() => Math.random() - 0.5);
const randomChars = randomList.join('');
const alphabet = {}
const decoder = {}
const glyphs = [];
const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    advanceWidth: 650,
    path: new opentype.Path()
});
glyphs.push(notdefGlyph);
for (let i = 0;i<alphabetChars.length;i++) {
    const char = alphabetChars[i];
    const randomChar = randomChars[i];
    const index =  font.charToGlyphIndex(randomChar);
    const glyph = font.glyphs.get(index);
    let name = char;
    if (char === ' ') {
        name = 'space';
    }
    const newGlyph = new opentype.Glyph({
        name: name,
        unicode: char.charCodeAt(0),
        advanceWidth: glyph.advanceWidth,
        path: glyph.path
    });
    glyphs.push(newGlyph);
    alphabet[randomChars[i]] = alphabetChars[i];
    decoder[alphabetChars[i]] = randomChars[i];
}
const hello = 'Hello World !';
let encoded = '';
for (let ch of hello) {
    const a = alphabet[ch];
    if (a === undefined) {
        encoded += ' ';
    } else {
        encoded += a;
    }
}
console.log(`text: ${hello}`);
console.log(`encoded: ${encoded}`);

const newFont = new opentype.Font({
    familyName: 'Cryptofont',
    styleName: 'Medium',
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    glyphs: glyphs
});



function saveFont() {
    const familyName = newFont.getEnglishName('fontFamily');
    const styleName = newFont.getEnglishName('fontSubfamily');
    const fileName = familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
    const ab = newFont.toArrayBuffer();
    const buffer = new Buffer(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    fs.writeFileSync(`data/${fileName}`, buffer);
    fs.writeFileSync('data/decoder.json', JSON.stringify(decoder))
    fs.writeFileSync('data/encoder.json', JSON.stringify(alphabet))
}

try {
    saveFont();
} catch (e) {
    console.log(e);
}
