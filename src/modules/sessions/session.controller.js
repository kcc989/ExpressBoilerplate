import Session from './session.model';

 export async function createSession(req, res) {
   try {
    const newSession = {
      userId: req.user.id,
    }
  
    const session = await Session.create(newSession);
    
    return res.status(200).set('token', session.token).end();
   } catch (e) {
    return res.status(500).json(e);
   }
 }