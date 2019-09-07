module.exports = {
    "AllowExtras":true, // Load commands from extra
    "Prefix":"wb!", // Universal Prefix
    "Port": 5000, // Port to listen to
    "baseUrl": `http://localhost:${this.Port}`,
    "owner": "525840152103223338",
    'YoutubeAPiKey': String(process.env.YoutubeAPiKey)
};