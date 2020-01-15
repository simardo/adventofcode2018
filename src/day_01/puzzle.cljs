(ns day-01.puzzle
    (:require [day-01.input :as input]
              [clojure.string :as cstr]
              [goog.string :as gstr]))

(println "PART 1")

(println
    (reduce +
        (map gstr/parseInt
            (cstr/split-lines input/INPUT_01)
        )
    )
)


(println "PART 2")

(println
    (let [refs (map gstr/parseInt
                (cstr/split-lines input/INPUT_01))]
        (loop [i 0 acc 0 r #{}]
            (if (< i (count refs))
                (let [a (+ acc (nth refs i))]
                    (if (not (contains? r a))
                        (recur (inc i) a (conj r a))
                        (println a)
                    )
                )
                (recur 0 acc r)
            )
        )
    )
)
