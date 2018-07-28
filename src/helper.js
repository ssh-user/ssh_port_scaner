/**
 * Convert ip like 80.233.*.* to array of ips ["80.233.0.0", "80.233.0.1"...]
 * ALERT! dont insert *.*.*.* ip to parse. It's SO BIG, so many possible combinations
 * 1.0.0.* - array length = 256 address and has size ~4Kb
 * 1.0.*.* - array length = 65 536 address and has size ~1Mb
 * 1.*.*.* - array length = 16 777 216 address and has size ~250Mb (in real test it shows more 1GB memory use by node process O_o )
 * *.*.*.* - array length = 4 294 967 296 address and has size ~64Gb (here your computer - die)
 * 
 * @param {String} address 
 * @return { Promise<String[]> }
 */
function getIPsByStar(address) {
    return new Promise((resolve, reject) => {
        try {
            let arr = _verificationAndConvertToArr(address);

            // convert array
            arr = arr.map((elem) => {
                if (elem == "*")
                    return { start: 0, end: 255 };
                return { start: elem, end: elem };
            });

            let result = _getIPsRange(arr);

            return resolve(result);
        } catch (error) {
            return reject(error.message);
        };
    });
};

/**
 * Return ips range by start and end positions. Remember, start position should be more then end, otherwise can be unpredictable result
 * @param {String} start ex. 10.203.100.0
 * @param {String} end ex. 10.203.213.255
 * @return { Promise<String[]> }
 */
function getIPsByStartEndAddress(start, end) {
    return new Promise((resolve, reject) => {
        try {
            start = _verificationAndConvertToArr(start);
            end = _verificationAndConvertToArr(end);

            let arr = [];
            // merge start and end arrays
            for (let i = 0; i < 4; ++i) {
                arr.push({
                    start: start[i],
                    end: end[i]
                });
            };

            let result = _getIPsRange(arr);

            return resolve(result);
        } catch (error) {
            return reject(error.message);
        };
    });
};

module.exports = {
    getIPsByStar,
    getIPsByStartEndAddress
};

function _getIPsRange(array) { // ex [{ start: 1, end: 1 }, { start: 1, end: 1 }, { start: 1, end: 1 }, { start: 1, end: 5 }]
    let result = [];

    for (let first = array[0].start; first <= array[0].end; ++first) {
        for (let second = array[1].start; second <= array[1].end; ++second) {
            for (let third = array[2].start; third <= array[2].end; ++third) {
                for (let fouth = array[3].start; fouth <= array[3].end; ++fouth) {
                    result.push(`${first}.${second}.${third}.${fouth}`);
                };
            };
        };
    };

    return result;
};

function _verificationAndConvertToArr(address) {
    // if no arguments
    if (!address)
        throw new Error("cannot parse null");

    address = address.trim();

    // if not only digitals, coma and *
    if (!/^[0-9\.\*]+$/.test(address))
        throw new Error("should be only '0-9', '.' , '*' ");

    // split and convert string to numbers
    let arr = address.split(".").map((elem, index) => {

        // if empty path of IP. Throw error
        if (!elem)
            throw new Error("cannot parse null");

        // it,s normal
        if (elem == "*")
            return '*';

        // first path of IP can't be a zero.   ex. 0.123.123.123
        if (index == 0 && elem == "0")
            return 1;

        let parseElem = +elem;
        if (Number.isNaN(parseElem))
            throw new Error("parse return NaN");

        // 255 is max of ip range
        if (parseElem > 255)
            return 255;

        // if no errors - return parsed number
        return parseElem;
    });

    return arr;
};