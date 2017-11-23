import io from 'socket.io-client';
import $ from 'jquery';

const socket = io("http://localhost:8888");
receive();

// json → 文字列に変換して送信する関数
function send(name, data) {    
    socket.emit(name, JSON.stringify(data));
}

function receive() {
    socket.on('receiveMessage', (d) => {
        const data = JSON.parse(d)
        console.log(d)
        $('#message_list').append(`<div>${data.text}</div>`)
    });
}


$('#emit').on('click', () => {
    const value = $('#message').val()
    console.log(value)
    send('message', {text: value});
 });
