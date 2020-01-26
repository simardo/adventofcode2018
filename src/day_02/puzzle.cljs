(ns day-02.puzzle
    (:require [day-02.input :as input]
              [clojure.string :as cstr])
)

; PART 1

(defn compute-checksum [r m]
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

(defn get-checksum [i m]
    (reduce compute-checksum {:2 0 :3 0}
        (map #(reduce compute-str {} (sequence %))
            (cstr/split-lines i)
        )
    )
)

(defn do-part1 [s]
    (let [cs (get-checksum s {:2 0 :3 0})] (* (get cs :2) (get cs :3)))
)

; PART 2

(defn do-compare [s c]
    (let [m (filter #(not= % nil)
                (map #(if (= %1 %2) %1 nil)
                    (sequence s) (sequence c)
                )
            )]
        (let [ct (count m)]
            (if (= ct (dec (count s)))
                (apply str m)
            )
        )
    )
)

(defn compute-dup [s i v]
    (filter #(not= % nil)
        (map #(do-compare s %)
            (map #(nth v %)
                (take (- (count v) i) (iterate inc i))
            )
        )
    )
)

(defn do-part2 [s]
    (let [lines (cstr/split-lines s)]
        (nth (nth
            (filter #(= (count %) 1)
                (map #(compute-dup %1 %2 lines)
                    lines (iterate inc 1)
                )
            )
        0) 0)
    )
)
