/**
 *
 * @param {Array} arr - 평탄화 할 배열
 * @param {Function} helper - 평탄화 시킬 때 필터링할 함수
 * @returns
 */
export function recursiveFlatten(arr, helper = () => true) {
  return arr.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      const flattenedChild = recursiveFlatten(cur, helper);
      acc = acc.concat(flattenedChild);
    } else {
      if (helper(cur)) acc.push(cur);
    }
    return acc;
  }, []);
}
