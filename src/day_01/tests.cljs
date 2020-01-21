(ns day-01.tests
    (:require [cljs.test :refer-macros [deftest is testing run-tests]]
              [day-01.puzzle :as puzzle]
              [day-01.input :as input]
    ))

(def input_a
"+1
+1
+1")

(def input_b
"+1
+1
-2")

(def input_c
"-1
-2
-3")

(def input_d
"+1
-1")

(def input_e
"+3
+3
+4
-2
-4")

(def input_f
"-6
+3
+8
+5
-6")

(def input_g
"+7
+7
-2
-7
-4")

(deftest test-a
    (is (= 3 (puzzle/do-part1 input_a)))
)

(deftest test-b
    (is (= 0 (puzzle/do-part1 input_b)))
)

(deftest test-c
    (is (= -6 (puzzle/do-part1 input_c)))
)

(deftest test-d
    (is (= 1 (puzzle/do-part2 input_d)))
)

(deftest test-e
    (is (= 10 (puzzle/do-part2 input_e)))
)

(deftest test-f
    (is (= 5 (puzzle/do-part2 input_f)))
)

(deftest test-g
    (is (= 14 (puzzle/do-part2 input_g)))
)

(run-tests)

(println (puzzle/do-part1 input/INPUT_01))
(println (puzzle/do-part2 input/INPUT_01))
