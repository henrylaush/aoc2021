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

// (.)    :: (b -> c) -> (a -> b) -> a -> c
// (.) f g = \x -> f (g x)
export const compose = (bc) => (ab) => (...x) => bc(ab(...x));
