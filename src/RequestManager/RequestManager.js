
class Queue{

    constructor(){
        this.requests = {};
        this.first = 0;
        this.last = 0;
    }
    
    enqueue(f_obj){
        this.requests[this.last] = f_obj;
        this.last++;
    }
    
    dequeue(){
        const deleted = this.requests[this.first];
        delete this.requests[this.first];
        this.first++;
        return deleted;
    }
    peek(){
        return this.requests[this.first];
    }
    isEmpty(){
        return this.last-this.first===0;
    }
}

export const queue = new Queue();



