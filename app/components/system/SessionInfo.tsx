'use server'
import { getServerSession } from 'next-auth';
import {authoptions} from '../../api/auth/authOptions/authoptions';

const SessionInfo = async () => {    
    const session = await getServerSession(authoptions)
    const user = session?.user    
    if (session) {
        return user
    } else {
        return null
    }
}

export default SessionInfo