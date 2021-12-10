
Object.defineProperties(Array.prototype, {
    sum: {
        value: function(getValue = id => id) { return this.reduce((partial, item) => partial + getValue(item), 0)}
    },
    gather: {
        value: function(getKey = id => id, combiner = (existing, value) => ([...(existing ?? []), value])) {
        return this.map(item => [getKey(item), item]).reduce((bag, [key, value]) => ({ ...bag, [key]: combiner(bag[key], value) }), {})
        }
    }
})