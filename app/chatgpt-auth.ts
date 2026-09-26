// Compatibility names retained for existing imports. Authentication is now Google via NextAuth.
import {getServerSession} from 'next-auth';import {redirect} from 'next/navigation';import {authOptions} from '@/lib/auth';
export type ChatGPTUser={userId:string;displayName:string;email:string;fullName:string|null};
export async function getChatGPTUser():Promise<ChatGPTUser|null>{const session=await getServerSession(authOptions);const u=session?.user as {id?:string;email?:string;name?:string}|undefined;if(!u?.id||!u.email)return null;return {userId:u.id,email:u.email,displayName:u.name||u.email,fullName:u.name||null};}
function safe(path:string){return path.startsWith('/')&&!path.startsWith('//')?path:'/';}
export function chatGPTSignInPath(returnTo:string){return '/login?returnTo='+encodeURIComponent(safe(returnTo));}
export async function requireChatGPTUser(returnTo:string){const u=await getChatGPTUser();if(!u)redirect(chatGPTSignInPath(returnTo));return u;}
export function chatGPTSignOutPath(){return '/logout';}
