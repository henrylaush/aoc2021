import Text.Parsec
import Text.Parsec.String

import Data.Tuple ( swap )
import qualified Data.Map.Strict as Map
import qualified Data.List as List
import Data.Char (digitToInt)

type Version = Int
type Type = Int
type Value = Int
type LenType = Char

data Packet = L Version Type Value | O Version Type [Packet] deriving (Show, Eq)

table = Map.fromList [
  ('0', "0000"),
  ('1', "0001"),
  ('2', "0010"),
  ('3', "0011"),
  ('4', "0100"),
  ('5', "0101"),
  ('6', "0110"),
  ('7', "0111"),
  ('8', "1000"),
  ('9', "1001"),
  ('A', "1010"),
  ('B', "1011"),
  ('C', "1100"),
  ('D', "1101"),
  ('E', "1110"),
  ('F', "1111")]

toBinaryString :: String -> String
toBinaryString s = s >>= (Map.!) table

toDec :: String -> Int
toDec = List.foldl' (\acc x -> acc * 2 + digitToInt x) 0

binChar :: Parser Char
binChar = oneOf "01"

parseNDigit :: Int -> Parser [Char]
parseNDigit n = count n binChar

parseVersion :: Parser Int
parseVersion = toDec <$> parseNDigit 3

parseLiteralType :: Parser Int
parseLiteralType = toDec <$> string "100"

parseHasNext :: Parser [Char]
parseHasNext = char '1' *> parseNDigit 4

parseNoNext :: Parser [Char]
parseNoNext = char '0' *> parseNDigit 4

parseLiteralNum :: Parser Int
parseLiteralNum = toDec <$> ((++) <$> (concat <$> many parseHasNext) <*> parseNoNext)

parseLiteral :: Parser Packet
parseLiteral = L <$> parseVersion <*> parseLiteralType <*> parseLiteralNum

-- Operator
parseOperationType :: Parser Int
parseOperationType = toDec <$> parseNDigit 3

-- Type 0
parseTypeZeroLength :: Parser Int
parseTypeZeroLength = toDec <$> parseNDigit 15

parseTypeZeroContent :: Parser [Packet]
parseTypeZeroContent = expandTypeZeroContent <$> (parseTypeZeroLength >>= parseNDigit)

expandTypeZeroContent :: [Char] -> [Packet]
expandTypeZeroContent = either (error "parse error") id . parse (many parsePacket) ""

parseTypeZeroId :: Parser Char 
parseTypeZeroId = char '0'

parseTypeZero :: Parser Packet
parseTypeZero = O <$> parseVersion <*> parseOperationType <* parseTypeZeroId <*> parseTypeZeroContent

-- Type 1
parseTypeOneContent :: Parser [Packet]
parseTypeOneContent = (toDec <$> parseNDigit 11) >>= parseCountPacket

parseCountPacket :: Int -> Parser [Packet]
parseCountPacket n = count n parsePacket

parseTypeOne :: Parser Packet
parseTypeOne = O <$> parseVersion <*> parseOperationType <* char '1' <*> parseTypeOneContent

parsePacket :: Parser Packet
parsePacket = try (parseLiteral) <|> try (parseTypeZero) <|> try (parseTypeOne)

-- Part 1
sumVersions :: Packet -> Int
sumVersions (L v _ _) = v
sumVersions (O v _ ps) = v + List.foldl' (\acc x -> acc + sumVersions x) 0 ps

part1 :: [String] -> [Int]
part1 = map (either (const 0) (sumVersions) . parse parsePacket "")

-- Part 2
zeroOne :: Bool -> Int
zeroOne True = 1
zeroOne False = 0

calculate :: Packet -> Int
calculate (L _ _ val) = val
calculate (O _ 0 ps) = sum $ map calculate ps
calculate (O _ 1 ps) = product $ map calculate ps
calculate (O _ 2 ps) = minimum $ map calculate ps
calculate (O _ 3 ps) = maximum $ map calculate ps
calculate (O _ 5 ps) = zeroOne $ calculate (head ps) > calculate (last ps)
calculate (O _ 6 ps) = zeroOne $ calculate (head ps) < calculate (last ps)
calculate (O _ 7 ps) = zeroOne $ calculate (head ps) == calculate (last ps)
calculate (O _ _ ps) = 0

part2 :: [String] -> [Int]
part2 = map (either (const 0) (calculate) . parse parsePacket "")

main :: IO()
main = readInput >>= \content ->
       print (part1 content) >>
       print (part2 content) >>
       return ()

readInput :: IO [String]
readInput = map toBinaryString . lines <$> readFile "input.txt"

testCase :: String
testCase = "110100101111111000101000"