//**********文件路径解释**********
//app/api 目录：
//这是 Next.js 应用中存放 API 路由的目录，所有在 app/api 目录下的文件和目录会被自动处理为 API 路由

//auth 目录：
//这是一个自定义的目录，用于存放与身份验证相关的 API 路由
//你可以在这个目录中定义多个身份验证相关的 API 端点

//[...nextauth] 动态路由：
//[...] 语法表示一个动态路由捕获所有路径
//nextauth 是捕获的路径参数，可以匹配多种子路径
//这个文件名和路径形式是 NextAuth.js 的约定，用于处理所有与 NextAuth.js 相关的身份验证请求。

import NextAuth from "next-auth/next";//这里视频里是'next-auth'，后面没有/next，我把/next拿走了没有差别
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user'; //定义了Schema和用户模型
import { connectToDB } from '@utils/database'; //定义链接到MongoDB的函数

const handler = NextAuth({
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })],

    //below is an object containing callbacks
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            });

            session.user.id = sessionUser._id.toString();

            return session;
        },

        //首先要获得session，我们需要让用户先sign in，所以视频里，先写下面的signIn
        async signIn({ profile }) {
            try {
                // serverless -> Lambda -> dynamodb
                //keep in mind, every JS route is known as a serverless route
                //接上句which means that this is a Lambda function that opens only when it's get called
                //接上句so every time it's get called, it needs to spin up the server and make a connection to the database
                //in this way we don't need to keep running our server constantly, which is great!
                //but we have to make a connection to the database
                //然后说完这句话，作者去utils开了个新的file叫database.js用来hook to a database
                await connectToDB();

                //检查用户是否已经存在
                const userExists = await User.findOne({
                    email: profile.email
                })

                //如果不存在，create a new user and save in the database
                //这种情况下的话，我们需要创建一个function to create the user and add it to the database
                //为了实现上一步，我们先要去创建一个model，based on which the document of the user will be created
                //所以之后我去models文件夹里面新开了一个user.js
                //在user.js设定好之后我回来了
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(), //to make sure there are no spaces
                        image: profile.picture
                    })
                }
                //User.create 方法中使用的字段名称必须与您在 Mongoose 模型（Schema）中定义的字段名称一致。Mongoose 模型定义了文档的结构、字段类型和其他约束条件。在创建文档时，字段名称需要与模型中的字段名称匹配，以确保数据被正确存储。

                return true; //如果sign in成功的话
            } catch (error) {
                console.log(error);
                return false; //如果sign in失败的话
            }
        },
    },
})

export { handler as GET, handler as POST }; //这句话一定要，否则Sign In按钮不显示