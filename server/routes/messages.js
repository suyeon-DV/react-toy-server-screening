import { readDB, writeDB } from './../src/dbController.js';
import {v4} from 'uuid';

const getMessages = () => {
    return readDB('messages');
}

const setMessages = (data) => {
    return writeDB('messages', data);
}

const messagesRoute = [
    { // Get Messages
        method: 'get',
        route: '/messages',
        handler: (req, res) => {
            const msgs = getMessages()
            res.send(msgs);
        }
    }, { // Create Messages
        method: 'post',
        route: '/messages',
        handler: ({body}, res) => {
            const megs = getMessages()
            const newMsg = {
                id: v4(),
                text: body.text,
                userId: body.userId,
                timeStamp: Date.now()
            }
            megs.unshift(newMsg);
            setMessages(megs);
            res.send(newMsg);
        }
    }, { // Update Messages
        method: 'put',
        route: '/messages/:id',
        handler: ({body, params: {id}}, res) => {
            try {
                const megs = getMessages();
                const targetIndex = msgs.findIndex((msg) => msg === id);

                if (targetIndex < 0) throw '메시지가 없습니다.';
                if (megs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

                const newMsg = {...megs[targetIndex], text: body.text}
                msgs.splice(targetIndex, 1, newMsg);
                setMessages(msg);
                res.send(newMsg);
            } catch (err) {
                res.status(500).send({ error: err })
            }

        }
    }, { // Delete Messages
        method: 'delete',
        route: '/messages/:id',
        handler: ({body, params: {id}}, res) => {
            try {
                const megs = getMessages();
                const targetIndex = megs.findIndex((msg) => msg.id === id);
                if (targetIndex < 0) throw "메시지가 없습니다."
                if (megs[targetIndex].userId !== body.userId) throw '사용자가 없습니다.'
    
                msgs.splice(targetIndex, 1);
                setMessages(megs);
                res.send(id);                
            } catch (err) {
                res.status(500).send({ error: err });
            }
        }
    },
]

export default messagesRoute;
