import io from 'socket.io-client'
import config from '@/config'
let socket = io.connect(config.mainURL);

export default socket;