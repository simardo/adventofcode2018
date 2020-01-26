(ns day-02.tests
    (:require [cljs.test :refer-macros [deftest is testing run-tests]]
              [day-02.puzzle :as puzzle]
              [day-02.input :as input]
    ))

(def input_a
"abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab")

(def input_b
"abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz")

(deftest test-a
    (is (= 12 (puzzle/do-part1 input_a)))
)

(deftest test-b
    (is (= "fgij" (puzzle/do-part2 input_b)))
)

(run-tests)

(println (puzzle/do-part1 input/INPUT_02))

(println (puzzle/do-part2 input/INPUT_02))
