import observe from "./observe"

// 专门处理arr
function observeArr(arr){
    for(let i = 0; i<arr.length;i++){
        observe(arr[i])
    }
}

export default observeArr