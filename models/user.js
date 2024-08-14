import { Schema, model, models } from 'mongoose';
//为了帮助我们interact with MongoDB数据库
//Schema：用于定义文档结构（模式）
//model：用于创建模型（Model）
//models：用于检查已经存在的模型，以避免重复定义

//**********Schema和model的区别？**********
//Schema：
//用来定义文档结构的
//它描述了存储在 MongoDB 中的文档的形状和内容，包括字段类型、验证规则、默认值等

//model：
//Model 是基于 Schema 创建的
//需要先定义一个 Schema，然后用这个 Schema 创建一个 Model
//Model 提供了与数据库交互的方法，如 save、find、findById、update、delete 等
//Model 可以实例化一个具体的文档对象，可以通过实例化对象对单个文档进行操作
//“文档对象”的例子：
/*
 {
  "email": "user@example.com",
  "username": "user123",
  "image": "http://example.com/image.jpg"
}
*/

//定义用户模式
const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'], //设置为唯一值，如果重复会返回指定错误信息
        required: [true, 'Email is required!'], //设置为必填字段，如果缺少会返回指定错误信息
    },
    username: {
        type: String,
        required: [true, 'Email is required!'], //设置为必填字段
        match: [/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 3-20 alphanumeric letters and be unique!"],
    }, //设置正则表达式验证用户名的格式，长度为 3-20 个字符，只能包含字母数字和某些特殊字符，并且不能以下划线或点开始或结束，且不能包含连续的下划线或点。
    image: {
        type: String,
    }
});

// The "models" object is provided by the Mongoose library and stores all the registered models.
// If a model name "User" already exists in the "models" object, it assigns that existing model to the "User" variable.
// This prevents redefining the model and ensures that the eixting model is reused.

// If a model named "User" does not exist in the "models" object, the "model" function from Mongoose is called to create a new mode
// The newly created model is then assigned to the "User" variable.

//创建或获取用户模型
const User = models.User || model("User", UserSchema);
//models.User：检查是否已经存在名为 User 的模型，如果存在则使用该模型
//model("User", UserSchema)：如果不存在，则使用定义的 UserSchema 创建一个新的 User 模型
//括号里的双引号User：这里的 "User" 是模型的名称，用于在 Mongoose 中注册该模型。当你调用 model("User", UserSchema) 时，Mongoose 会使用这个名称在其内部注册该模型。如果以后再用相同的名称调用 model 函数，它会返回已经注册的模型，而不会重新创建它。
//const后面的User：这是一个 JavaScript 变量，用于在代码中引用和操作这个模型
//如果双引号User改成Happy，const后面的User也要改成Happy

//导出用户模型
export default User;

//这里写完了现在有了model for our user，可以回去route.js了