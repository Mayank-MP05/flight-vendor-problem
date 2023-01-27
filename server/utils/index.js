function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(delayInMs = 3000,fn, ...args) {
    await timeout(delayInMs);
    return fn(...args);
}

module.exports = {
    sleep,
    timeout
}