// Cached Data
// Example queues, we don't need to save this into a database
// Since we need commands like play and queue to have the same data you get it as this script
// This script is ignored when adding commands which is useful

let queue = new Map();

module.exports = {
    'queue':queue,
    'depsFile': require('../deps')
};