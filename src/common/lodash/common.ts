import _ from 'lodash'
const common={
    traverseMap<T>(obj:Object,handle:(item:T,key?:string)=>boolean|void){
        if(typeof handle ==='function'){
            for(let key of _.keys(obj)){
                if(obj.hasOwnProperty(key)){
                    let end=handle(obj[key],key)
                    if(end){
                        break;
                    }
                }
            }
        }

    },
    getRandArr(num:number):Array<number>{
        let arr=_.range(num);
        let res:number[]=[];
        while(arr.length>0){
            let rand=_.random(0,arr.length-1);
            let n=common.deleteArrItem(arr,rand)
            res.push(n)
        }
        return res;
    },
    deleteArrItem<T>(arr:T[],index:number):T{
        let res:T=arr[index]
        arr.splice(index,1)
        return res;
    }
}

export default common