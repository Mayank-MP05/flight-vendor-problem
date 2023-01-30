const printVendorWiseLatency = (vendorDB) => {
    console.log('Vendors latency log: ');
    for (let vendor of vendorDB) {
        console.log(`${vendor.vendorName} : ${vendor.vendorLatency}ms`);
    }
}

const printLine = () => {
    console.log('-------------------------------------');
}

module.exports = { printVendorWiseLatency, printLine }