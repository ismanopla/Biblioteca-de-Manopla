import 'server-only';
import {getStore} from '@netlify/blobs';
export function store(){return getStore({name:'biblioteca-v1',consistency:'strong'});}
export async function listRecords<T>(prefix:string):Promise<T[]>{const result:T[]=[];for await(const page of store().list({prefix,paginate:true})){const rows=await Promise.all(page.blobs.map(b=>store().get(b.key,{type:'json'})));for(const row of rows)if(row)result.push(row as T);}return result;}
export async function writeRecord(prefix:string,id:string,value:unknown){await store().setJSON(prefix+id,value);}
export async function readRecord<T>(prefix:string,id:string){return await store().get(prefix+id,{type:'json'}) as T|null;}
