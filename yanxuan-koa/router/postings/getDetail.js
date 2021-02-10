const query = require('../../mysql/connect');
const mysql = require('mysql');
module.exports = async (ctx, next) => {
    const id = mysql.escape(ctx.request.query.id);
    const sql = `select * from postings where id=${id}`;
    const [head, err] = await query(sql);
    const authorid=head.authorid;
    const userSql=`select username,avatar from users where id=${authorid}`;
    const cmtSql=`select a.username,a.avatar,b.* from users a,comments b where a.id=b.authorid and b.postingId=${id}`;
    const user=await query(userSql);
    const comments=await query(cmtSql);
    const res={
        head:{
            date:head.date,
            title:head.title,
            word:head.word,
            username:user[0].username,
            avatar:user[0].avatar
        },
        comments:comments
    }
    if (err) {
        ctx.response.body = {
            code: 500,
            msg: err
        }
    } else {
        ctx.response.body = {
            code: 200,
            data: res
        }
    }
}