(ns day-02.puzzle
    (:require [day-02.input :as input]
              [clojure.string :as cstr])
)

(println "PART 1")

(defn calc-checksum [r m]
    (let [res
        (if (> (.indexOf (vals m) 2) -1)
            (assoc r :2 (inc (get r :2)))
            r
        )]
        (if (> (.indexOf (vals m) 3) -1)
            (assoc res :3 (inc (get res :3)))
            res
        )
    )
)

(defn compute-str [m s]
    (if (contains? m s)
        (assoc m s (inc (get m s)))
        (assoc m s 1)
    )
)

(defn do-puzzle [i m]
    (reduce calc-checksum {:2 0 :3 0}
        (map #(reduce compute-str {} (sequence %))
            (cstr/split-lines i)
        )
    )
)

(let [cs (do-puzzle input/INPUT_02 {:2 0 :3 0})] (println (* (get cs :2) (get cs :3))))

; "abcdef
; bababc
; abbcde
; abcccd
; aabcdd
; abcdee
; ababab"
