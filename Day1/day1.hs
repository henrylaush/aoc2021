import Text.Parsec
import Text.Parsec.String

import Data.Tuple ( swap )
import qualified Data.Map.Strict as Map
import qualified Data.List as List

-- Part 1
part1 :: [Int] -> Int
part1 input = length $ filter id $ zipWith (>) (drop 1 input) input 

-- Part 2

part2 :: [Int] -> Int
part2 input = length $ filter id $ zipWith (>) (drop 3 input) input 

main :: IO()
main = readInput >>= \content ->
       print (part1 content) >>
       print (part2 content) >>
       return ()

readInput :: IO [Int]
readInput = map read . lines <$> readFile "input.txt"
