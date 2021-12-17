import Text.Parsec
import Text.Parsec.String

import Data.Tuple ( swap )
import qualified Data.Map.Strict as Map
import qualified Data.List as List
import Data.Either (fromRight)

data Command = F Int | D Int | U Int deriving (Show, Eq)

parseInt :: Parser Int
parseInt = read <$> many digit

-- parseForward :: Parser Command
parseForward = F <$> (string "forward " *> parseInt)

parseDown :: Parser Command
parseDown = D <$> (string "down " *> parseInt)

parseUp :: Parser Command
parseUp = U <$> (string "up " *> parseInt)

parseCommand :: Parser Command
parseCommand = try parseForward <|> try parseDown <|> try parseUp

-- Part 1
data State1 = S1 Int Int deriving (Show, Eq)

runPart1State :: State1 -> Command -> State1
runPart1State (S1 forward depth) (F n) = S1 (forward + n) depth
runPart1State (S1 forward depth) (U n) = S1 forward (depth - n)
runPart1State (S1 forward depth) (D n) = S1 forward (depth + n)

getPart1Result :: State1 -> Int 
getPart1Result (S1 forward depth) = forward * depth

part1 :: [String] -> Int
part1 = getPart1Result . foldl runPart1State (S1 0 0) . fromRight undefined . mapM (parse parseCommand "")

-- Part 2
data State2 = S2 Int Int Int deriving (Show, Eq)

runPart2State :: State2 -> Command -> State2
runPart2State (S2 forward depth aim) (F n) = S2 (forward + n) (depth + aim * n) aim
runPart2State (S2 forward depth aim) (U n) = S2 forward depth (aim - n)
runPart2State (S2 forward depth aim) (D n) = S2 forward depth (aim + n)

getPart2Result :: State2 -> Int 
getPart2Result (S2 forward depth _) = forward * depth

part2 :: [String] -> Int
part2 = getPart2Result . foldl runPart2State (S2 0 0 0) . fromRight undefined . mapM (parse parseCommand "")

main :: IO()
main = readInput >>= \content ->
       print (part1 content) >>
       print (part2 content) >>
       return ()

readInput :: IO [String]
readInput = lines <$> readFile "input.txt"

testCase :: String
testCase = "110100101111111000101000"