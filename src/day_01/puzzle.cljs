(ns day-01.puzzle
    (:require [clojure.string :as cstr]
              [goog.string :as gstr]))

; PART 1

(defn do-part1 [s]
    (reduce +
        (map gstr/parseInt
            (cstr/split-lines s)
        )
    )
)

; PART 2

(defn do-part2 [s]
    (let [refs (map gstr/parseInt
                (cstr/split-lines s))]
        (loop [i 0 acc 0 r #{}]
            (if (< i (count refs))
                (let [a (+ acc (nth refs i))]
                    (if (not (contains? r a))
                        (recur (inc i) a (conj r a))
                        a
                    )
                )
                (recur 0 acc r)
            )
        )
    )
)
