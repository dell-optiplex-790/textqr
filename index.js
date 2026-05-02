var qrcode = require('qrcode');
var canvas = require('canvas');
var msg = require('prompt-sync')()('Message? ');
var code = qrcode.create(msg, {
    errorCorrectionLevel: 'L'
}).segments;
var qr = canvas.createCanvas(256, 256);
var miniqr = canvas.createCanvas(64, 64);
var ctx = qr.getContext('2d');
var mctx = miniqr.getContext('2d');

function isBlack(r, g, b) {
    return r < 100 && g < 100 && b < 100;
}

qrcode.toCanvas(qr, code, err => {
    if(err) {
        throw err;
    }

    // downscale
    var str = '', dat, dat2, dat$ = [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3]
    ], m;
    for(var y = 0; y < 256; y += 4) {
        for(var x = 0; x < 256; x += 4) {
            _ = [];
            for(var i = 0; i < 3; i++) {
                m = _.push(0) - 1;
                for(var j = 0; j < dat$.length; j++) {
                    _[m] += ctx.getImageData(x + dat$[j][0], y + dat$[j][1], 1, 1).data[i];
                }
                _[m] = Math.floor(_[m] / dat$.length);
            }
            mctx.fillStyle = 'rgb(' + _.join() + ')';
            mctx.fillRect(x / 4, y / 4, 1, 1);
        }
    }

    // render
    for(var y = 0; y < 64; y += 2) {
        for(var x = 0; x < 64; x++) {
            dat = Array.from(mctx.getImageData(x, y, 1, 1).data);
            dat2 = Array.from(mctx.getImageData(x, y + 1, 1, 1).data);
            str += isBlack(dat2[0], dat2[1], dat2[2]) ? (isBlack(dat[0], dat[1], dat[2]) ? ' ' : '▀') : (isBlack(dat[0], dat[1], dat[2]) ? '▄' : '█');
        }
        str += '\n';
    }
    str = str.split('\n').map(e => e.trim()).join('\n').trim();

    // print out
    console.log(str);
})