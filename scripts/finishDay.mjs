import fs from 'fs';

const folders = fs.readdirSync('.');
const existingDays = folders
    .filter(name => name.startsWith('Day'))
    .map(day => day.replace('Day', ''))
    .map(Number);
const newDay = Math.max(...existingDays) + 1;
const dayStr = "Day" + newDay;

fs.renameSync('today', dayStr);
