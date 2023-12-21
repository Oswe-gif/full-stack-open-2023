const _ = require('lodash');

const dummy = (blogs) => {
    console.log('testing')
    return 1;
}
const totalLikes =(blogs) =>{
    return blogs.reduce((sum, blog)=>sum = blog.likes + sum,0)
}
const favoriteBlog = (blogs)=>{
    const mostLiked = blogs.reduce((mostLiked,blog)=>{
       return mostLiked= blog.likes > mostLiked[1] ? [blog._id, blog.likes]: mostLiked
    },[0,0])
    const blog=blogs.find(blog => blog._id===mostLiked[0]);
    return ({title: blog.title, author:blog.author, likes:blog.likes})   
}
const mostBlogs = (blogs)=>{
    const autors=[]
    blogs.forEach(x => {
        let contador=0
        blogs.forEach(y=>{
            if(y.author===x.author){
                contador=contador+1
            }
        })
        autors.push({author: x.author, blogs: contador})
    });
    const dataArr = new Set(autors);
    let result = [...dataArr];
    
    return _.sortBy(result, 'blogs').at(-1)
}

const mostLikes = (blogs)=>{
    const autors=[]
    blogs.forEach(x => {
        let likes=0
        blogs.forEach(y=>{
            if(y.author===x.author){
                likes+=y.likes
            }
        })
        autors.push({author: x.author, likes: likes})
    });
    const dataArr = new Set(autors);
    let result = [...dataArr];
    
    return _.sortBy(result, 'likes').at(-1)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}