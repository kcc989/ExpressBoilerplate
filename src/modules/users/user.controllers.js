import User from './user.model';
import { read } from 'fs';

 export async function signUp(req, res) {
     try {
         const user = await User.create(req.body);
         return res.status(201).json(user);
     } catch (e) {
         return res.status(500).json(e);
     }
 }

 export async function test(req, res) {
     return res.status(200).end();
 }