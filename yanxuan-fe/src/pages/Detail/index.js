import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Edit from '../../components/Edit/index';
import Comment from '../../components/Comment/index';
import './index.less';
import moment from 'moment';
import cookie from 'react-cookies';
import { Avatar, Button } from 'antd';
const Detail = (props) => {
    const id = props.match.params.id;
    const [detailData, setDetailData] = useState([]);
    const edit = useRef();
    const dateFormatter = (value) => {
        var date = moment.parseZone(value).local().format('YYYY-MM-DD HH:mm');
        return date;
    }
    const clearInput = () => {
        edit.current.setVal('');
    }
    const submit = (superiorId) => {
        const text = edit.current.getVal();
        if (!text.length) {
            alert("不能为空");
            return;
        }
        if (!cookie.load('username')) {
            alert("请先登录");
            return;
        }
        const params = {
            word: text,
            postingId: id,
            superiorId: superiorId,
        };
        axios.post('/api/newCmt', params).then(res => {
            const data = res.data;
            alert(data.msg);
            if (data.code == 200) {
                clearInput();
            }
        })
    }
    useEffect(() => {
        axios.get(`/api/getDetail?id=${id}`).then(res => {
            const data = res.data;
            if (data.code == 200) {
                setDetailData(data.data)
            }
        });
    }, [props])

    return (
        <div className="Detail">
            <p className="title">{detailData.head ? detailData.head.title : ''}</p>
            <div className="comment">
                <Avatar style={{ width: '50px', height: '50px' }} className="avatar" src={detailData.head ? detailData.head.avatar : ''} />
                <div className="comment-msg">
                    <span className="username">{detailData.head ? detailData.head.username : ''}</span>
                    <span className="date">{detailData.head ? dateFormatter(detailData.head.date) : ''}</span>
                    <p dangerouslySetInnerHTML={{ __html: detailData.head ? detailData.head.word : '' }}></p>
                </div>
            </div>
            {
                detailData.comments ? detailData.comments.map((item, index) => {
                    return (<Comment data={{ ...item, index: index }} key={item.id} />)
                }) : ''
            }
            <Edit ref={edit} />
            <Button onClick={() => { submit(-1) }}>回复</Button>
        </div>
    )
}
export default Detail;