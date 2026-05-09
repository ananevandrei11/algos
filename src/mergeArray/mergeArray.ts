export function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let lastRealIndexNums1 = m - 1;
    let lastRealIndexNums2 = n - 1;
    let lastIndexNums1 = m + n - 1;

    while (lastRealIndexNums1 >= 0 && lastRealIndexNums2 >= 0) {
        const val1 = nums1?.[lastRealIndexNums1];
        const val2 = nums2?.[lastRealIndexNums2];
        if (val1 === undefined || val2 === undefined) break;
        if (val1 >= val2) {
            nums1[lastIndexNums1] = val1;
            lastRealIndexNums1 -= 1;
        } else {
            nums1[lastIndexNums1] = val2;
            lastRealIndexNums2 -= 1;
        }
        lastIndexNums1 -= 1;
    }

    while (lastRealIndexNums2 >= 0) {
        const val2 = nums2[lastRealIndexNums2];
        if (val2 === undefined) break;
        nums1[lastIndexNums1] = val2;
        lastRealIndexNums2 -= 1;
        lastIndexNums1 -= 1;
    }
};