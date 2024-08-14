//单开一个Form.jsx的目的是这里的代码可以被重复使用
import Link from 'next/link'; //导入了 next/link 模块中的 Link 组件，用于在应用中创建客户端导航链接。

//这是定义一个名为 Form 的函数组件，并解构传递给组件的 props 对象，提取 type、post、setPost、submitting 和 handleSubmit 这几个属性。
const Form = ({
    type, post, setPost, submitting, handleSubmit
}) => {
    return (
        <section className='w-full max-w-full flex-start flex-col'>
            <h1 className='head_text text-left'>
                <span className='blue_gradient'>{type} Post</span>
            </h1>

            <p className='desc text-left max-w-md'>
                {type} and share amazing prompts with the world, and let your imagination run wild with any AI-powered platform.
            </p>

            {/*下面一大块都是“表单控件”form，由两个label和一个放俩按钮的div组成*/}
            <form
                onSubmit={handleSubmit}
                className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
            >
                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-700'>
                        Your AI prompt
                    </span>

                    <textarea
                        value={post.prompt}
                        onChange={(e) => setPost({ ...post, prompt: e.target.value })}
                        placeholder='Write your prompt here...'
                        required
                        className='form_textarea'
                    />
                </label>

                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-700'>
                        Tag{' '}
                        <span className='font-normal'>
                            (#product, #webdevelopment, #idea)
                        </span>
                    </span>

                    <input
                        value={post.tag}
                        onChange={(e) => setPost({ ...post, tag: e.target.value })}
                        placeholder='#tag'
                        required
                        className='form_input'
                    />
                </label>

                <div className='flex-end mx-3 mb-5 gap-4'> {/*两个按钮*/}
                    <Link href='/' className='text-gray-500 text-sm'>
                        Cancel
                    </Link>

                    <button
                        type='submit'
                        disabled={submitting}
                        className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
                    >
                        {submitting ? `${type}...` : type}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Form
