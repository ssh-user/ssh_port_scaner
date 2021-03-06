const scaner = require("./scaner");
const { getIPsByStar, getIPsByStartEndAddress } = require("./helper");
const { writeFile } = require('./save');

const START_IP_RANGE = "192.168.0.1";
const END_IP_RANGE = "192.168.255.255";


// start
(async function () {
    try {
        let ips = await getIPsByStartEndAddress(START_IP_RANGE, END_IP_RANGE);
        let scanned = [];

        for (let ip of ips) {
            let options = {
                host: ip,
                port: 22,
                timeout: 200 // optimal time. less value get too much wrong results.
            };

            let result = await scaner(options);
            if (result == "open") {
                // you can save to DB or something another ..
                scanned.push({
                    host: ip,
                    status: "open",
                    date: Date.now()
                });
            };
        };

        console.log(`Checked - ${ips.length} hosts. Find 'open' - ${scanned.length} hosts.`);

        await writeFile("./assets/result", JSON.stringify(scanned));
    } catch (error) {
        console.error(error);
    };
})();
