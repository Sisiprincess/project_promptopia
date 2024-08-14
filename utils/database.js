import mongoose from "mongoose"; //Mongoose 是一个帮助你连接和操作 MongoDB 数据库的工具

let isConnected = false; // 追踪是否已经连接到数据库

export const connectToDB = async() => { //这个异步函数的作用是连接到数据库
    mongoose.set('strictQuery', true); 
    //这行代码告诉 Mongoose 要严格对待查询条件
    //不设置这个console里可能会报错，所以作者推荐设置strictQuery为true

    if(isConnected){
        console.log('MongoDB is already connected');
        return;
    } //如果已经连接到数据库，就打印一条消息并返回，不再重新连接，这里是为了避免重复连接

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
        })

        isConnected = true;
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error);
    }
}

//这里写完了现在可以回去route.js了