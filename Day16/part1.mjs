import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];
const table = new Map(
  [
    ['0', '0000'],
    ['1', '0001'],
    ['2', '0010'],
    ['3', '0011'],
    ['4', '0100'],
    ['5', '0101'],
    ['6', '0110'],
    ['7', '0111'],
    ['8', '1000'],
    ['9', '1001'],
    ['A', '1010'],
    ['B', '1011'],
    ['C', '1100'],
    ['D', '1101'],
    ['E', '1110'],
    ['F', '1111'],
  ]
)
function processLine(line) {
  lines.push(line.split('').reduce((p, c) => (p + table.get(c)),''));
}

// End template, start code
function parseNum(numStr) {
  let i = 0;
  let result = '';
  while(numStr[i] === '1' || numStr[i] === '0') {
    result += numStr.slice(i+1, i + 5);
    if (numStr[i] === '0') break;
    i += 5;
  }
  return { value: parseInt(result, 2), consumed: i + 5 };
}

function parseLiteral(bStr) {
  const type = bStr.slice(3, 6);
  if(type !== '100') return Promise.reject({ input: bStr, type, reason: 'type mismatch, expect 100' });
  const version = bStr.slice(0, 3);
  const numStr = bStr.slice(6);
  const num = parseNum(numStr);

  return Promise.resolve({ 
    type: 'literal', 
    version: parseInt(version, 2), 
    value: num.value,
    length: 6 + num.consumed,
  });
}

function parse(bStr) {
  return parseLiteral(bStr).catch(() => parseOperator(bStr));
}

async function parseOperatorType0(bStr) {
  const length = parseInt(bStr.slice(7, 22), 2);

  const subPackets = [];
  let subPacketStr = bStr.slice(22, 22 + length);
  let consumed = 0;

  while (consumed < length) {
    const subPacket = await parse(subPacketStr);
    subPackets.push(subPacket);
    consumed += subPacket.length;
    subPacketStr = subPacketStr.slice(subPacket.length);
  }
  return { length: consumed + 22, subPackets }
}

async function parseOperatorType1(bStr) {
  const length = parseInt(bStr.slice(7, 18), 2);
  
  let subPacketStr = bStr.slice(18);
  let consumed = 18;
  const subPackets = [];
  
  for (let i = 0; i < length; i++) {
    const subPacket = await parse(subPacketStr);
    subPackets.push(subPacket);
    consumed += subPacket.length;
    subPacketStr = subPacketStr.slice(subPacket.length);
  }
  return { length: consumed, subPackets }
}

async function parseOperator(bStr) {
  const type = bStr.slice(3, 6);
  if (type === '100') throw { input: bStr, type, reason: 'type mismatch, expect not 100' };
  const version = bStr.slice(0, 3);

  const lenTypeId = bStr[6];

  if (lenTypeId !== '0' && lenTypeId !== '1') throw { input: bStr, type, reason: 'len id mismatch, expect 0 or 1' };

  const common = { type: 'operator', lengthId: lenTypeId, version: parseInt(version, 2) };
  if (lenTypeId === '0') {
    const result = await parseOperatorType0(bStr);
    return { ...common, ...result };
  }

  if (lenTypeId === '1') {
    const result = await parseOperatorType1(bStr);
    return { ...common, ...result };
  }
}

function getVersions(packet) {
  return [packet.version, ...((packet.subPackets || []).flatMap(getVersions))]
}

async function processLines(lines) {
  const results = await Promise.all(lines.map(parse));
  return results
  .flatMap(getVersions).sum();
}

// End code, start template
function handleProblem() {
  processLines(lines).then(
    console.log,
    // i => console.log(JSON. stringify(i, null, 2)),
    console.error,
  ).finally(() => {
    process.exit(0);
  })
}

rl.on('line', processLine).on('close', handleProblem);
